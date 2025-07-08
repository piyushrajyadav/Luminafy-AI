"use client"

import { useState } from "react"
import { Download, RefreshCw, Sparkles, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface OutputSectionProps {
  originalImage: string | null
  generatedImage: string | null
  isGenerating: boolean
  isDark: boolean
  onRegenerate: () => void
}

export default function OutputSection({
  originalImage,
  generatedImage,
  isGenerating,
  isDark,
  onRegenerate,
}: OutputSectionProps) {
  const [showComparison, setShowComparison] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)

  const downloadImage = () => {
    if (!generatedImage) return

    const link = document.createElement("a")
    link.href = generatedImage
    link.download = "ai-photoshoot-generated.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!originalImage && !generatedImage && !isGenerating) {
    return (
      <Card
        className={`p-8 backdrop-blur-md border-opacity-20 shadow-2xl h-96 flex items-center justify-center ${
          isDark ? "bg-white/10 border-white/20" : "bg-white/70 border-gray-200"
        }`}
      >
        <div className="text-center">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isDark ? "bg-purple-400/20" : "bg-purple-100"
            }`}
          >
            <Sparkles className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            Your AI Photoshoot Will Appear Here
          </h3>
          <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Upload an image and select a style to get started
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className={`p-8 backdrop-blur-md border-opacity-20 shadow-2xl ${
        isDark ? "bg-white/10 border-white/20" : "bg-white/70 border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>🖼️ Your AI Photoshoot</h2>

        {originalImage && generatedImage && (
          <Button
            onClick={() => setShowComparison(!showComparison)}
            variant="outline"
            size="sm"
            className={`rounded-full ${
              isDark
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                : "bg-white/50 border-gray-200 text-gray-700 hover:bg-white/70"
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            {showComparison ? "Hide" : "Show"} Comparison
          </Button>
        )}
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <div
            className={`w-16 h-16 rounded-full border-4 border-t-transparent animate-spin ${
              isDark ? "border-purple-400" : "border-purple-600"
            }`}
          />
          <p className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
            Transforming your image...
          </p>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Applying the selected style to your photo. This usually takes 10-20 seconds
          </p>
        </div>
      )}

      {!isGenerating && (originalImage || generatedImage) && (
        <div className="space-y-6">
          {showComparison && originalImage && generatedImage ? (
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl h-96">
                <div className="absolute inset-0 flex" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                  <img
                    src={originalImage || "/placeholder.svg"}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}>
                  <img
                    src={generatedImage || "/placeholder.svg"}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Slider */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize"
                  style={{ left: `${sliderPosition}%` }}
                  onMouseDown={(e) => {
                    const rect = e.currentTarget.parentElement!.getBoundingClientRect()
                    const handleMouseMove = (e: MouseEvent) => {
                      const newPosition = ((e.clientX - rect.left) / rect.width) * 100
                      setSliderPosition(Math.max(0, Math.min(100, newPosition)))
                    }
                    const handleMouseUp = () => {
                      document.removeEventListener("mousemove", handleMouseMove)
                      document.removeEventListener("mouseup", handleMouseUp)
                    }
                    document.addEventListener("mousemove", handleMouseMove)
                    document.addEventListener("mouseup", handleMouseUp)
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-2 text-sm">
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>Original</span>
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>AI Generated</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {generatedImage && (
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={generatedImage || "/placeholder.svg"}
                    alt="Generated photoshoot"
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {originalImage && !generatedImage && (
                <div className="rounded-2xl overflow-hidden opacity-50">
                  <img src={originalImage || "/placeholder.svg"} alt="Original" className="w-full h-96 object-cover" />
                </div>
              )}
            </div>
          )}

          {generatedImage && (
            <div className="flex gap-3">
              <Button
                onClick={downloadImage}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </Button>

              <Button
                onClick={onRegenerate}
                variant="outline"
                className={`rounded-xl ${
                  isDark
                    ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    : "bg-white/50 border-gray-200 text-gray-700 hover:bg-white/70"
                }`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          )}            <div className="text-center">
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                Powered by Cloudflare Workers AI – Stable Diffusion
              </p>
            </div>
        </div>
      )}
    </Card>
  )
}
