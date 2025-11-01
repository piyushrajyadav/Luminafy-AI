import { type NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

const HF_TOKEN = process.env.HF_TOKEN;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    console.log("API route called at", new Date().toISOString())
    const { image, prompt, mode } = await request.json()
    console.log("Received data:", { hasImage: !!image, prompt, mode })

    // Handle different modes
    if (mode === 'text-to-image') {
      return await handleTextToImage(prompt)
    } else if (mode === 'img2img' || mode === 'enhancement') {
      return await handleImageTransformation(image, prompt)
    }

    return NextResponse.json(
      { error: "Invalid request: missing mode" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process request" },
      { status: 500 }
    )
  }
}

async function handleTextToImage(prompt: string) {
  if (!HF_TOKEN) {
    return NextResponse.json(
      { error: "Hugging Face API token not configured" },
      { status: 500 }
    )
  }

  if (!prompt) {
    return NextResponse.json(
      { error: "Prompt is required" },
      { status: 400 }
    )
  }

  try {
    console.log("Calling Hugging Face API...")
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            num_inference_steps: 50,
            guidance_scale: 7.5,
          }
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const imageBlob = await response.blob()
    const buffer = Buffer.from(await imageBlob.arrayBuffer())
    const base64Image = buffer.toString('base64')
    const imageUrl = `data:image/png;base64,${base64Image}`

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    )
  }
}

async function handleImageTransformation(image: string, prompt: string) {
  if (!REPLICATE_API_TOKEN) {
    console.log("Replicate not configured, using Hugging Face")
    return await handleTextToImage(prompt)
  }

  if (!image || !prompt) {
    return NextResponse.json(
      { error: "Image and prompt required" },
      { status: 400 }
    )
  }

  try {
    const replicate = new Replicate({
      auth: REPLICATE_API_TOKEN,
    })

    const output = await replicate.run(
      "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
      {
        input: {
          image: image,
          prompt: prompt,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          image_guidance_scale: 1.5,
        },
      }
    )

    let imageUrl: string
    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0]
    } else if (typeof output === "string") {
      imageUrl = output
    } else {
      throw new Error("Unexpected output format")
    }

    const imageResponse = await fetch(imageUrl)
    const imageBlob = await imageResponse.blob()
    const arrayBuffer = await imageBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const imageDataUrl = `data:image/png;base64,${base64}`

    return NextResponse.json({ imageUrl: imageDataUrl })
  } catch (error) {
    console.error("Replicate error:", error)
    return await handleTextToImage(prompt)
  }
}
