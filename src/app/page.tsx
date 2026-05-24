"use client";
import HeroVideo from './components/HeroVideo';
import ProductCard from './components/ProductCard';
import AiDecorPreview from './components/AiDecorPreview';
import ProductFilter from './components/ProductFilter';
import { useState } from 'react';

export default function Home() {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState('Tout voir');
  
  const featuredProducts = [
    { id: 1, name: "Vase en Céramique Minimaliste", material: "Blanc Cassé", price: 45.00, img: "Photo Vase" },
    { id: 2, name: "Miroir Mural Organique", material: "Bois de Chêne", price: 120.00, img: "Photo Miroir" },
    { id: 3, name: "Lampe de Table Tissée", material: "Lumière chaude", price: 85.00, img: "Photo Lampe" },
    { id: 4, name: "Tapis Berbère Authentique", material: "Laine 100%", price: 250.00, img: "Photo Tapis" }
  ];

  // Catégories par pièce
  const roomCategories = [
    "Tout voir",
    "Salon",
    "Cuisine",
    "Jardin & Extérieur",
    "Salle de Bain",
    "Chambre Adulte",
    "Chambre Enfant",
    "Toilettes"
  ];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      
      {/* 0. Navbar Premium (Sticky Glassmorphism) */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Menu Mobile (Hamburger) */}
          <button className="md:hidden p-2 text-stone-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>

          {/* Logo */}
          <div className="text-2xl font-serif font-bold text-stone-900 tracking-widest uppercase">
            ELITE<span className="text-amber-500">.</span>
          </div>

          {/* Liens Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            <a href="#" className="text-stone-900 border-b-2 border-transparent hover:border-amber-500 transition-all pb-1">Nouveautés</a>
            <a href="#pieces" className="text-stone-600 hover:text-stone-900 transition-colors">Par Pièce</a>
            <a href="#boutique" className="text-stone-600 hover:text-stone-900 transition-colors">Boutique</a>
            <a href="/about" className="text-stone-600 hover:text-stone-900 transition-colors">Savoir-faire</a>
          </nav>

          {/* Icônes Utilitaires (Recherche, Compte, Panier) */}
          <div className="flex items-center gap-5 text-stone-900">
            <button className="hover:text-amber-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <button className="hover:text-amber-600 transition-colors hidden sm:block">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </button>
            <button className="hover:text-amber-600 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. Section Hero */}
      <HeroVideo />

      {/* 2. Barre de Réassurance (Trust Indicators) */}
      <div className="bg-stone-900 text-stone-300 py-8 px-4 border-b-4 border-amber-600">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-sm md:text-base font-medium tracking-wide">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
            <span>Artisanat d'Élite</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            <span>Retours Gratuits</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Inspiration Méditerranéenne</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Support 24/7</span>
          </div>
        </div>
      </div>

      {/* 3. Section IA */}
      <section className="py-20 px-4">
        {!isAiOpen ? (
          <div className="max-w-4xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-stone-900 shadow-2xl border border-amber-500/30 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-600/20 via-transparent to-stone-800/50"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
            
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 relative z-10 leading-tight">
              Laissez notre <span className="text-amber-400 italic">Intelligence Artificielle</span><br/> concevoir votre espace
            </h2>
            <p className="text-stone-300 mb-10 text-lg max-w-2xl mx-auto relative z-10">
              Prenez en photo votre pièce, choisissez un meuble, et laissez notre algorithme l'intégrer avec un réalisme époustouflant.
            </p>
            <button 
              onClick={() => setIsAiOpen(true)}
              className="px-10 py-5 bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 text-lg font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(251,191,36,0.3)] relative z-10 flex items-center justify-center gap-3 mx-auto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Essayer le Simulateur IA
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in duration-700">
            <AiDecorPreview />
            <div className="text-center mt-6">
              <button onClick={() => setIsAiOpen(false)} className="text-stone-500 font-medium underline hover:text-stone-900 transition">
                Fermer le simulateur
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. Grille Asymétrique */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl md:text-4xl font-serif text-stone-950 mb-10 text-center">Explorez nos Univers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[300px]">
          <div className="md:col-span-2 md:row-span-2 bg-stone-200 rounded-3xl relative overflow-hidden group flex items-end p-8 min-h-[300px]">
            <div className="absolute inset-0 bg-stone-800/10 group-hover:bg-stone-800/20 transition duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-serif text-stone-900 mb-2">Salons & Séjours</h3>
              <a href="#" className="inline-block border-b border-stone-900 text-stone-900 font-medium pb-1">Découvrir</a>
            </div>
          </div>
          <div className="bg-stone-300 rounded-3xl relative overflow-hidden group flex items-end p-8 min-h-[250px]">
            <div className="absolute inset-0 bg-stone-800/10 group-hover:bg-stone-800/20 transition duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-serif text-stone-900 mb-2">Luminaires</h3>
              <a href="#" className="inline-block border-b border-stone-900 text-stone-900 font-medium pb-1">Voir la collection</a>
            </div>
          </div>
          <div className="bg-amber-100 rounded-3xl relative overflow-hidden group flex items-end p-8 min-h-[250px]">
            <div className="absolute inset-0 bg-stone-800/5 group-hover:bg-stone-800/10 transition duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-serif text-stone-900 mb-2">Art de la Table</h3>
              <a href="#" className="inline-block border-b border-stone-900 text-stone-900 font-medium pb-1">Explorer</a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section Boutique avec Filtres par Pièce */}
      <section id="boutique" className="max-w-7xl mx-auto px-4 mt-20">
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-serif text-stone-950 mb-6 tracking-tight">
            Notre Collection
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg mb-10">
            Une sélection minutieuse de pièces uniques pour créer une atmosphère qui vous ressemble, pièce par pièce.
          </p>
          
          {/* Nouveau : Filtration Horizontale par Pièce */}
          <div id="pieces" className="flex overflow-x-auto pb-4 hide-scrollbar gap-3 justify-start md:justify-center">
            {roomCategories.map((room) => (
              <button
                key={room}
                onClick={() => setActiveRoom(room)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeRoom === room 
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900'
                }`}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        {/* Intégration du composant de filtre existant */}
        <ProductFilter />
      </section>

      {/* 6. Section Histoire / Savoir-Faire */}
      <section className="mt-32 py-24 bg-stone-800 text-stone-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="aspect-[4/5] bg-stone-700 rounded-t-[150px] rounded-b-3xl w-full max-w-md mx-auto flex items-center justify-center border-4 border-stone-600/50 relative overflow-hidden">
              <span className="text-stone-500 font-serif italic text-xl">Image de l'Atelier</span>
            </div>
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">Notre Identité</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              L'excellence à l'état pur.
            </h2>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed">
              Nous sélectionnons chaque matériau avec une exigence absolue. De la chaleur du bois de chêne à la pureté de la céramique, chaque pièce de notre collection est pensée pour durer et traverser les modes. Nous croyons en une décoration qui a une âme.
            </p>
            <a href="/about" className="inline-block px-8 py-4 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-stone-900 transition-colors rounded-full font-medium">
              Découvrir notre histoire
            </a>
          </div>
        </div>
      </section>

      {/* 7. Section Sélections Finales */}
      <section className="py-24 bg-stone-100 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-950">
              Sélections du moment
            </h2>
            <a href="/collection" className="text-stone-600 hover:text-stone-950 border-b border-stone-400 pb-1 transition font-medium hidden sm:inline-block">
              Voir tout le catalogue
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
                <ProductCard 
                  name={product.name}
                  material={product.material}
                  price={product.price}
                  imagePlaceholder={product.img}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <a href="/collection" className="text-stone-600 hover:text-stone-950 border-b border-stone-400 pb-1 transition font-medium">
              Voir tout le catalogue
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}