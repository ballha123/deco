import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import dns from 'dns';

// Force le runtime Node.js pour supporter les bibliothèques réseau (dns, https)
export const runtime = 'nodejs';

// Configuration du résolveur DNS pour contourner les blocages réseau
const customResolver = new dns.Resolver();
customResolver.setServers(['1.1.1.1', '8.8.8.8']);

const dnsBypassLookup = (hostname: string, options: any, callback: any) => {
  customResolver.resolve4(hostname, (err, addresses) => {
    if (err) return dns.lookup(hostname, options, callback);
    callback(null, addresses[0], 4);
  });
};

const bypassAgent = new https.Agent({
  lookup: dnsBypassLookup,
  rejectUnauthorized: false
});

export async function POST(req: Request) {
  try {
    const { image, mask, prompt } = await req.json();

    if (!image || !mask) {
      return NextResponse.json({ error: "Image et masque requis" }, { status: 400 });
    }

    const token = process.env.HF_API_TOKEN;
    if (!token) {
      console.error("HF_API_TOKEN manquant dans les variables d'environnement Vercel !");
      return NextResponse.json({ error: "Configuration serveur manquante" }, { status: 500 });
    }

    // Préparation des données
    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
    const base64Mask = mask.replace(/^data:image\/\w+;base64,/, "");
    
    const formData = new FormData();
    formData.append("inputs", `A high-quality 3D render of a ${prompt}, interior design, photorealistic`);
    formData.append("image", new Blob([Buffer.from(base64Image, 'base64')], { type: "image/png" }), "image.png");
    formData.append("mask_image", new Blob([Buffer.from(base64Mask, 'base64')], { type: "image/png" }), "mask.png");

    // Appel Hugging Face
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/OzzyGT/Realistic_Vision_V5.1_Inpainting",
      formData,
      {
        headers: { Authorization: `Bearer ${token.trim()}` },
        responseType: 'arraybuffer',
        httpsAgent: bypassAgent,
        timeout: 60000 
      }
    );

    const outputBase64 = `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`;
    
    return NextResponse.json({ output: outputBase64 });

  } catch (error: any) {
    console.error("Erreur API:", error.message);
    // On renvoie un JSON, jamais de HTML, pour que le Frontend puisse traiter l'erreur
    return NextResponse.json(
      { error: "Échec de la génération IA" }, 
      { status: 500 }
    );
  }
}