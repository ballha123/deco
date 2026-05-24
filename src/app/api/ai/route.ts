import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { image, mask, prompt } = await req.json();

    if (!image || !mask) {
      return NextResponse.json({ error: "Image et masque requis" }, { status: 400 });
    }

    const token = process.env.HF_API_TOKEN;
    
    // Conversion base64 vers buffer
    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
    const base64Mask = mask.replace(/^data:image\/\w+;base64,/, "");
    
    const formData = new FormData();
    formData.append("inputs", `A high-quality 3D render of a ${prompt}, interior design, photorealistic`);
    formData.append("image", new Blob([Buffer.from(base64Image, 'base64')], { type: "image/png" }), "image.png");
    formData.append("mask_image", new Blob([Buffer.from(base64Mask, 'base64')], { type: "image/png" }), "mask.png");

    // Utilisation de fetch natif (plus stable sur Vercel)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/OzzyGT/Realistic_Vision_V5.1_Inpainting",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HuggingFace error: ${errorData}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const outputBase64 = `data:image/jpeg;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    
    return NextResponse.json({ output: outputBase64 });

  } catch (error: any) {
    console.error("Erreur API détaillée:", error.message);
    return NextResponse.json(
      { error: "Échec de la génération IA" }, 
      { status: 500 }
    );
  }
}