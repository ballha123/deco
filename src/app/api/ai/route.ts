import { NextResponse } from 'next/server';
import https from 'https';
import axios from 'axios';

// Création d'un agent qui force la persistance de la connexion
const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false,
});

export async function POST(req: Request) {
  try {
    const { image, mask, prompt } = await req.json();
    const token = process.env.HF_API_TOKEN;

    if (!image || !mask) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
    const base64Mask = mask.replace(/^data:image\/\w+;base64,/, "");
    
    const formData = new FormData();
    formData.append("inputs", `A high-quality 3D render of a ${prompt}, interior design, photorealistic`);
    formData.append("image", new Blob([Buffer.from(base64Image, 'base64')], { type: "image/png" }));
    formData.append("mask_image", new Blob([Buffer.from(base64Mask, 'base64')], { type: "image/png" }));

    // Appel via axios avec l'agent forcé
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/OzzyGT/Realistic_Vision_V5.1_Inpainting",
      formData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        httpsAgent: agent,
        timeout: 60000, // On laisse 60 secondes pour la réponse
        responseType: 'arraybuffer'
      }
    );

    const outputBase64 = `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`;
    return NextResponse.json({ output: outputBase64 });

  } catch (error: any) {
    console.error("Erreur API:", error.message);
    return NextResponse.json({ error: "Échec génération: " + error.message }, { status: 500 });
  }
}