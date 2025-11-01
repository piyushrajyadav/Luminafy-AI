'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Sparkles, Download, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { DottedSurface } from '@/components/ui/dotted-surface'
import { ShootingStars } from '@/components/ui/shooting-stars'

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          mode: 'text-to-image'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      setGeneratedImage(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `luminafy-text-to-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <DottedSurface />
      <ShootingStars
        starColor="#00B4DB"
        trailColor="#0083B0"
        minSpeed={15}
        maxSpeed={35}
        minDelay={1000}
        maxDelay={3000}
      />
      <ShootingStars
        starColor="#00D4FF"
        trailColor="#0099CC"
        minSpeed={10}
        maxSpeed={25}
        minDelay={2000}
        maxDelay={4000}
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-cyan-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Text to Image
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Generate Images from Text
            </h2>
            <p className="text-white/60 text-lg">
              Describe your vision and watch AI bring it to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
              <h3 className="text-xl font-semibold mb-4 text-white">Your Prompt</h3>
              
              <Textarea
                placeholder="Describe the image you want to create... (e.g., 'A serene mountain landscape at sunset with a lake reflecting the orange sky')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </Card>

            {/* Output Section */}
            <Card className="p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Generated Image</h3>
                {generatedImage && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>

              <div className="aspect-square bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 text-cyan-400 animate-spin" />
                    <p className="text-white/60">Creating your masterpiece...</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center p-8">
                    <Sparkles className="h-16 w-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">Your generated image will appear here</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Tips Section */}
          <Card className="mt-8 p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
            <h3 className="text-lg font-semibold mb-4 text-white">💡 Tips for Better Results</h3>
            <ul className="grid md:grid-cols-2 gap-3 text-white/60 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Be specific and descriptive in your prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Include style keywords like "photorealistic", "watercolor", "digital art"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Mention lighting, mood, and atmosphere</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Add details about colors, composition, and perspective</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
