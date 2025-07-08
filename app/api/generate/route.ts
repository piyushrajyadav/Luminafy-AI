
import { type NextRequest, NextResponse } from "next/server"

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const DEMO_MODE = process.env.DEMO_MODE === "true";

const stylePrompts: Record<string, string> = {
  // Personal Photo Styles
  "professional-headshot":
    "professional headshot photo, neutral background, formal business attire, studio lighting, high quality portrait",
  "casual-lifestyle": "casual lifestyle photo, natural lighting, relaxed clothing, home or park setting, candid style",
  "social-media-vibe": "trendy social media photo, soft bokeh background, modern filters, Instagram-style",
  "business-profile": "business profile photo, subtle background blur, professional suit, office environment",
  "artistic-portrait": "artistic portrait, oil painting style, creative lighting, fine art photography",
  "ai-fantasy": "cyberpunk style portrait, neon lighting, futuristic aesthetic, vaporwave colors",
  "dating-profile": "warm and friendly portrait, cozy setting, natural smile, soft lighting",
  "travel-explorer": "travel portrait, scenic mountain or beach background, adventure style",
  "influencer-lookbook": "influencer style photo, trendy outfit, sharp lighting, Instagram ready",

  // Product Photo Styles
  "studio-white-bg": "product photo, clean white background, studio lighting, commercial photography",
  "gradient-banner": "product photo with stylish gradient background, modern advertising style",
  "lifestyle-placement": "product in lifestyle setting, real-world context, natural placement",
  "minimalist-display": "minimalist product display, centered composition, soft pastel background",
  "hero-product-shot": "hero product photography, dramatic lighting, shadows and glow effects",
  "flat-lay-design": "flat lay product photography, top-down view, organized composition",
  "mockup-ready": "product mockup style, clean presentation, ready for branding",
  "360-3d-angle": "product photography, multiple angles, 3D perspective view",
  "black-studio": "luxury product photo, black background, glossy finish, premium look",
  "food-plating": "food photography, styled plating, warm lighting, restaurant quality",

  // Creative Styles
  "anime-cartoon": "anime style illustration, cartoon art, Japanese animation style",
  "cyberpunk-neon": "cyberpunk aesthetic, neon colors, futuristic lighting, sci-fi style",
  "fantasy-mythical": "fantasy art style, magical themes, mythical elements, enchanted setting",
  "winter-summer-theme": "seasonal themed photo, weather effects, seasonal colors and mood",
  "aesthetic-moody": "aesthetic moody photography, minimalist tones, artistic composition",
  "ad-mockup-format": "advertisement layout, banner format, commercial design ready",
  "poster-output": "poster design format, A3/A4 layout, printable composition",
}

export async function POST(request: NextRequest) {
  try {
    console.log("API route called at", new Date().toISOString())
    const { image, style } = await request.json()
    console.log("Received data:", { hasImage: !!image, style, imageLength: image?.length || 0 })

    if (!image || !style) {
      console.log("Missing image or style:", { hasImage: !!image, style })
      return NextResponse.json({ success: false, error: "Image and style are required" }, { status: 400 })
    }

    // Demo mode - return a placeholder image
    if (DEMO_MODE) {
      console.log("Running in demo mode")
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate processing time
      return NextResponse.json({
        success: true,
        imageUrl: "https://picsum.photos/768/768?random=" + Date.now(), // Random placeholder image
      })
    }

    if (!CF_API_TOKEN || !CF_ACCOUNT_ID) {
      console.log("Missing Cloudflare API token or account ID")
      return NextResponse.json({ success: false, error: "Cloudflare API token or account ID not configured" }, { status: 500 })
    }

    // Set the style prompt to use
    const prompt = stylePrompts[style] || "professional photo, high quality, studio lighting"
    console.log("Using prompt:", prompt)

    try {
      // Extract base64 from data URL
      const base64Data = image.split(',')[1] || image;

      // Cloudflare expects base64 string (no data URL prefix)
      const cfEndpoint = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/runwayml/stable-diffusion-v1-5-img2img`;
      
      console.log("Calling Cloudflare Workers AI endpoint...");
      const response = await fetch(cfEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json", // Explicitly request JSON response
        },
        body: JSON.stringify({
          prompt,
          image_b64: base64Data,
          strength: 0.75,
        }),
      });

      // Log response status and headers for debugging
      console.log(`Cloudflare response status: ${response.status}`);
      console.log(`Cloudflare response type: ${response.headers.get('content-type')}`);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Cloudflare Workers AI error: ${response.status} - ${error}`);
      }

      // Handle the response based on content type
      const contentType = response.headers.get('content-type') || '';
      let imageUrl;

      if (contentType.includes('application/json')) {
        // Parse JSON response
        const result = await response.json();
        console.log("Cloudflare JSON response structure:", Object.keys(result));
        
        // Check different possible response structures
        if (result?.result?.image) {
          imageUrl = `data:image/png;base64,${result.result.image}`;
        } else if (result?.image) {
          imageUrl = `data:image/png;base64,${result.image}`;
        } else if (typeof result === 'string' && result.startsWith('data:image')) {
          imageUrl = result;
        } else {
          console.error("Unexpected JSON response structure:", result);
          throw new Error("Unexpected response format from Cloudflare Workers AI");
        }
      } else if (contentType.includes('image/')) {
        // Handle binary image response
        const imageBlob = await response.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = contentType.split(';')[0] || 'image/png';
        imageUrl = `data:${mimeType};base64,${base64}`;
      } else {
        // Try to parse as JSON first, fallback to binary if it fails
        try {
          const result = await response.json();
          if (result?.result?.image) {
            imageUrl = `data:image/png;base64,${result.result.image}`;
          } else {
            throw new Error("Invalid JSON response structure");
          }
        } catch (jsonError) {
          // Fallback to binary handling
          const text = await response.text();
          if (text.startsWith('data:image')) {
            imageUrl = text;
          } else {
            const rawResponse = await response.clone().arrayBuffer();
            const base64 = Buffer.from(rawResponse).toString('base64');
            imageUrl = `data:image/png;base64,${base64}`;
          }
        }
      }

      console.log("Image generation successful, returning image data");
      
      // Log the imageUrl length and first 100 characters for debugging
      if (imageUrl) {
        console.log(`Generated image URL length: ${imageUrl.length}`);
        console.log(`Image URL preview: ${imageUrl.substring(0, 100)}...`);
      }
      
      return NextResponse.json({
        success: true,
        imageUrl,
        style,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Determine user-friendly error message based on the type of error
      let userFriendlyError = "Image generation failed";
      let statusCode = 500;
      
      if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
        userFriendlyError = "Authentication error with Cloudflare. Please check your API token";
        statusCode = 401;
      } else if (errorMessage.includes("Rate limit") || errorMessage.includes("429")) {
        userFriendlyError = "Too many requests to Cloudflare. Please try again in a few minutes";
        statusCode = 429;
      } else if (errorMessage.includes("loading") || errorMessage.includes("503")) {
        userFriendlyError = "The AI model is warming up. Please try again in a few moments";
        statusCode = 503;
      } else if (errorMessage.includes("Invalid JSON") || errorMessage.includes("Unexpected token")) {
        userFriendlyError = "Error processing the response from Cloudflare. Try with a different image";
        statusCode = 500;
      }
      
      return NextResponse.json({ 
        success: false, 
        error: userFriendlyError, 
        details: errorMessage 
      }, { status: statusCode });
    }
  } catch (error) {
    console.error("API route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    const userFriendlyMessage = errorMessage.includes("Cloudflare Workers AI error") 
      ? "There was an issue with the Cloudflare Workers AI service. Please try again later." 
      : "Server error occurred. Please try again.";
    
    return NextResponse.json({ 
      success: false, 
      error: userFriendlyMessage, 
      details: errorMessage 
    }, { status: 500 });
  }
}
