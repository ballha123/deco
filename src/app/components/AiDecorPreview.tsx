"use client";

import { useState, useRef, DragEvent, useEffect } from 'react';

const PRODUCTS = [
  "Porte-manteaux mural minimaliste",
  "Miroir mural organique",
  "Étagère flottante en chêne",
  "Lampe murale design"
];

// Crée un pochoir noir avec un rond blanc à l'endroit cliqué par le client
const createMask = (imgSrc: string, posX: number, posY: number): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      // Fond noir intégral
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dessin du rond blanc (zone ciblée pour l'IA)
      const x = (posX / 100) * canvas.width;
      const y = (posY / 100) * canvas.height;
      
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x, y, canvas.width * 0.12, 0, 2 * Math.PI); // Masque légèrement étendu pour une meilleure fusion des ombres
      ctx.fill();

      resolve(canvas.toDataURL('image/png'));
    };
  });
};

export default function AiDecorPreview() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number, y: number } | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [imgContainerHeight, setImgContainerHeight] = useState(400);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Calcule la hauteur réelle de l'image chargée pour adapter le scan laser de l'IA
  useEffect(() => {
    if (imgRef.current && (result || image)) {
      const updateHeight = () => {
        if (imgRef.current) {
          setImgContainerHeight(imgRef.current.clientHeight);
        }
      };
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [image, result, loading]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setResult(null);
      setPos(null);
      setErrorMsg(null);
      setIsDemoMode(false);
    };
    reader.readAsDataURL(file);
  };

  const resetSimulator = () => {
    setImage(null);
    setResult(null);
    setPos(null);
    setErrorMsg(null);
    setIsDemoMode(false);
  };

  const handleGenerate = async () => {
    if (!image || !pos) return;
    
    setLoading(true);
    setErrorMsg(null);
    setIsDemoMode(false);

    try {
      // 1. Dessiner le masque à la volée
      const maskBase64 = await createMask(image, pos.x, pos.y);

      // 2. Appel asynchrone sécurisé via URL relative pour Vercel production
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image, 
          mask: maskBase64, 
          prompt: selectedProduct 
        }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "La génération a échoué.");
      
      if (data.output) {
        setResult(data.output);
        if (data.isDemo) {
          setIsDemoMode(true);
        }
      } else {
        throw new Error("Aucun rendu généré.");
      }
    } catch (err: any) {
      console.error("Erreur simulateur:", err);
      setErrorMsg(err.message || "Impossible de générer l'image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-[2rem] max-w-5xl mx-auto shadow-2xl overflow-hidden text-stone-900">
      
      {/* En-tête de l'outil */}
      <div className="bg-stone-50 border-b border-stone-200 p-8 md:p-10">
        <div className="text-center mb-8">
          <span className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-2 block font-sans">STUDIO IA ÉLITE</span>
          <h3 className="text-3xl md:text-4xl font-serif text-stone-900">Simulateur Réel de Transposition</h3>
          <p className="text-stone-500 mt-3 max-w-xl mx-auto font-sans">
            Sélectionnez une pièce de notre collection, chargez une photo de votre mur, et visualisez le produit instantanément chez vous.
          </p>
        </div>
        
        {/* Sélecteur de produits */}
        <div className="flex flex-wrap gap-3 justify-center">
          {PRODUCTS.map(p => (
            <button 
              key={p} 
              onClick={() => {
                setSelectedProduct(p);
                if (result) setResult(null);
              }} 
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 font-sans ${
                selectedProduct === p 
                  ? 'bg-stone-900 text-white shadow-lg scale-105' 
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-400 hover:text-stone-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Zone interactive */}
      <div className="p-8 md:p-10 bg-stone-100 flex flex-col items-center">
        
        <div className="w-full relative rounded-2xl overflow-hidden shadow-inner bg-white border border-stone-200"
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}>
          
          {image ? (
            <div 
              className={`relative ${!result && 'cursor-crosshair'}`}
              onClick={(e) => { 
                if (result || loading) return;
                const rect = e.currentTarget.getBoundingClientRect(); 
                setPos({ 
                  x: ((e.clientX - rect.left) / rect.width) * 100, 
                  y: ((e.clientY - rect.top) / rect.height) * 100 
                }); 
              }}
            >
              <img 
                ref={imgRef}
                src={result || image} 
                alt="Votre intérieur" 
                className={`w-full h-auto object-cover max-h-[600px] transition-all duration-1000 ${loading ? 'opacity-50 blur-sm' : 'opacity-100'}`} 
              />
              
              {/* Scan lumineux adaptatif de l'IA */}
              {loading && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl z-10 pointer-events-none">
                  <div 
                    style={{ '--scan-depth': `${imgContainerHeight}px` } as React.CSSProperties}
                    className="w-full h-1 bg-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,1)] animate-[scan_2s_ease-in-out_infinite]" 
                  />
                </div>
              )}

              {/* Point de ciblage */}
              {pos && !result && !loading && (
                <div className="absolute z-20 pointer-events-none" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}>
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-12 h-12 bg-amber-500/30 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                </div>
              )}

              {!pos && !result && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900/40 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="bg-white/90 text-stone-900 px-6 py-3 rounded-full font-medium shadow-xl">
                    Cliquez sur le mur pour cibler l'emplacement du produit
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Zone d'Upload */
            <div 
              className={`h-80 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 cursor-pointer ${
                isDragging ? 'border-amber-500 bg-amber-50/50' : 'border-stone-300 hover:border-amber-400 hover:bg-stone-50'
              }`} 
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-500'}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              </div>
              <p className="text-lg font-medium text-stone-700 mb-1 font-sans">
                {isDragging ? "Déposez votre photo ici" : "Cliquez ou glissez une photo de votre pièce"}
              </p>
              <p className="text-sm text-stone-400 font-sans">Formats acceptés : JPG, PNG</p>
            </div>
          )}
        </div>

        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileInput} />
        
        {/* Messages et erreurs */}
        {errorMsg && (
          <div className="w-full mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium text-center font-sans">
            {errorMsg}
          </div>
        )}

        {isDemoMode && (
          <div className="w-full mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 font-medium text-center font-sans">
            💡 Mode Démonstration activé de secours (Sera réel à 100% sur ton site en prod avec ta clé d'accès !)
          </div>
        )}

        {/* Boutons d'action */}
        <div className="w-full mt-8 flex flex-col sm:flex-row items-center gap-4">
          {!result ? (
            <button 
              onClick={handleGenerate} 
              disabled={loading || !pos} 
              className={`flex-1 py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 font-sans ${
                !pos 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                  : 'bg-stone-900 text-white hover:bg-amber-500 shadow-xl hover:-translate-y-1'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Génération réelle en cours...
                </>
              ) : (
                <>✨ Projeter ce meuble</>
              )}
            </button>
          ) : (
            <>
              <button 
                onClick={() => setResult(null)} 
                className="flex-1 py-4 px-8 border border-stone-300 text-stone-700 rounded-full font-bold hover:bg-stone-100 transition font-sans"
              >
                Essayer un autre produit
              </button>
              <button 
                onClick={resetSimulator} 
                className="flex-1 py-4 px-8 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-800 transition shadow-lg font-sans"
              >
                Changer de pièce (Photo)
              </button>
            </>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(var(--scan-depth, 400px)); opacity: 0; }
        }
      `}} />
    </div>
  );
}