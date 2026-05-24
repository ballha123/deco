import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_API_TOKEN);

export async function POST(req: Request) {
  try {
    const { image, mask, prompt } = await req.json();

    if (!image || !mask) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

 const imgBuffer = Buffer.from(image.split(",")[1], 'base64');
const maskBuffer = Buffer.from(mask.split(",")[1], 'base64');
    // Appel via le SDK officiel
   const result = await hf.imageToImage({
  model: "runwayml/stable-diffusion-inpainting",
  inputs: new Blob([imgBuffer], { type: "image/png" }), // Conversion explicite en Blob
  parameters: {
    mask_image: new Blob([maskBuffer], { type: "image/png" }), // Conversion explicite en Blob
    prompt: prompt || "interior design, high quality"
  }
});

    // Le SDK renvoie un Blob, on le convertit en base64
    const arrayBuffer = await result.arrayBuffer();
    const outputBase64 = `data:image/jpeg;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    
    return NextResponse.json({ output: outputBase64 });

  } catch (error: any) {
    console.error("Erreur SDK HF:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}