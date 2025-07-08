"use client"

import { useState } from "react"
import { Moon, Sun, RefreshCw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import StyleSelector from "@/components/style-selector"
import OutputSection from "@/components/output-section"

export default function Home() {
  const [isDark, setIsDark] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedStyle) return

    setIsGenerating(true)
    try {
      console.log("Starting generation with:", { hasImage: !!uploadedImage, style: selectedStyle })
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: uploadedImage,
          style: selectedStyle,
        }),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response received:", { success: data.success, hasImage: !!data.imageUrl, style: data.style })

      if (data.success) {
        setGeneratedImage(data.imageUrl)
        console.log("Image generation completed successfully using Cloudflare Workers AI")
      } else {
        console.error("Generation failed:", data.error, data.details)
        
        // More user-friendly error message
        const errorMessage = data.error || "Failed to generate image";
        const detailsMessage = data.details ? `\n\nDetails: ${data.details}` : '';
        
        alert(`${errorMessage}${detailsMessage}`);
      }
    } catch (error) {
      console.error("Generation failed:", error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to server'
      alert(`Network error: ${errorMessage}. Please check your internet connection and try again.`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
      }`}
    >
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}> Luminafy AI</h1>
          </div>
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className={`rounded-full backdrop-blur-md border-opacity-20 ${
              isDark
                ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                : "bg-white/50 border-gray-200 text-gray-700 hover:bg-white/70"
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 text-center py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${isDark ? "text-white" : "text-gray-900"}`}
          >
            ✨ Turn Any Photo into a{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Professional Photoshoot
            </span>{" "}
            Image with AI
          </h1>
          <p className={`text-xl md:text-2xl mb-12 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Perfect for creators, influencers, sellers, job seekers, and designers
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card
              className={`p-8 backdrop-blur-md border-opacity-20 shadow-2xl ${
                isDark ? "bg-white/10 border-white/20" : "bg-white/70 border-gray-200"
              }`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                📥 Upload Your Image
              </h2>
              <ImageUpload onImageUpload={setUploadedImage} isDark={isDark} />
            </Card>

            <Card
              className={`p-8 backdrop-blur-md border-opacity-20 shadow-2xl ${
                isDark ? "bg-white/10 border-white/20" : "bg-white/70 border-gray-200"
              }`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
                🎨 Choose Your Style
              </h2>
              <StyleSelector onStyleSelect={setSelectedStyle} selectedStyle={selectedStyle} isDark={isDark} />
            </Card>

            <Button
              onClick={handleGenerate}
              disabled={!uploadedImage || !selectedStyle || isGenerating}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Photoshoot
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div>
            <OutputSection
              originalImage={uploadedImage}
              generatedImage={generatedImage}
              isGenerating={isGenerating}
              isDark={isDark}
              onRegenerate={handleGenerate}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6 mt-16">
        <div className="max-w-4xl mx-auto">
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Built with ❤️ by Piyush Yadav
          </p>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-purple-500" : "bg-purple-300"
          }`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
            isDark ? "bg-pink-500" : "bg-pink-300"
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 ${
            isDark ? "bg-blue-500" : "bg-blue-300"
          }`}
        />
      </div>
    </div>
  )
}
