'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ImagePlus, Download, Loader2, Upload, X, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { DottedSurface } from '@/components/ui/dotted-surface'
import { ShootingStars } from '@/components/ui/shooting-stars'

const PREDEFINED_PROMPTS = [
  {
    label: 'Remove Blur',
    prompt: 'sharpen the image, remove blur, enhance details, increase clarity, professional photo quality',
    icon: '🔍'
  },
  {
    label: 'Enhance Colors',
    prompt: 'vibrant colors, enhanced saturation, balanced contrast, vivid and bright, color correction',
    icon: '🎨'
  },
  {
    label: 'Upscale Quality',
    prompt: 'high resolution, ultra detailed, 4K quality, crisp and sharp, professional grade',
    icon: '⬆️'
  },
  {
    label: 'Fix Lighting',
    prompt: 'balanced lighting, proper exposure, highlight details, shadow recovery, natural light',
    icon: '💡'
  },
  {
    label: 'Remove Noise',
    prompt: 'denoise image, grain removal, smooth texture, clean and clear, noise reduction',
    icon: '✨'
  },
  {
    label: 'Restore Photo',
    prompt: 'restore old photo, fix damage, color restoration, detail recovery, photo repair',
    icon: '🔧'
  }
]

export default function EnhancementPage() {
  const [customPrompt, setCustomPrompt] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setOriginalImage(reader.result as string)
        setEnhancedImage(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEnhance = async () => {
    if (!originalImage) {
      setError('Please upload an image first')
      return
    }

    let finalPrompt = ''
    if (useCustomPrompt) {
      if (!customPrompt.trim()) {
        setError('Please enter a custom prompt or select a preset')
        return
      }
      finalPrompt = customPrompt
    } else {
      if (!selectedPreset) {
        setError('Please select an enhancement preset')
        return
      }
      finalPrompt = selectedPreset
    }

    setLoading(true)
    setError(null)
    setEnhancedImage(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          image: originalImage,
          mode: 'enhancement'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance image')
      }

      setEnhancedImage(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (enhancedImage) {
      const link = document.createElement('a')
      link.href = enhancedImage
      link.download = `luminafy-enhanced-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const clearImage = () => {
    setOriginalImage(null)
    setEnhancedImage(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const selectPreset = (prompt: string) => {
    setSelectedPreset(prompt)
    setUseCustomPrompt(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <DottedSurface />
      <ShootingStars
        starColor="#6366F1"
        trailColor="#4F46E5"
        minSpeed={15}
        maxSpeed={35}
        minDelay={1000}
        maxDelay={3000}
      />
      <ShootingStars
        starColor="#8B5CF6"
        trailColor="#7C3AED"
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
            <ImagePlus className="h-6 w-6 text-indigo-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Image Enhancement
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
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent">
              Enhance Your Images with AI
            </h2>
            <p className="text-white/60 text-lg">
              Upload an image and choose an enhancement or create your own
            </p>
          </div>

          {/* Upload Section */}
          <Card className="p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] mb-8">
            <h3 className="text-xl font-semibold mb-4 text-white">Upload Image</h3>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            {!originalImage ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-md mx-auto block aspect-square bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-indigo-400/50 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer"
              >
                <Upload className="h-16 w-16 text-white/40" />
                <div className="text-center">
                  <p className="text-white/60 font-medium">Click to upload image</p>
                  <p className="text-white/40 text-sm mt-1">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </button>
            ) : (
              <div className="max-w-md mx-auto relative aspect-square bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            )}
          </Card>

          {/* Enhancement Options */}
          <Card className="p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Enhancement Options</h3>
              <Button
                onClick={() => setUseCustomPrompt(!useCustomPrompt)}
                variant="outline"
                size="sm"
                className={useCustomPrompt ? 'border-indigo-500 text-indigo-400' : 'border-white/20 text-white/60'}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {useCustomPrompt ? 'Use Presets' : 'Custom Prompt'}
              </Button>
            </div>

            {!useCustomPrompt ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PREDEFINED_PROMPTS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => selectPreset(preset.prompt)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPreset === preset.prompt
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/10 bg-white/5 hover:border-indigo-400/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{preset.icon}</div>
                    <div className="text-sm font-medium text-white">{preset.label}</div>
                  </button>
                ))}
              </div>
            ) : (
              <Textarea
                placeholder="Describe your custom enhancement... (e.g., 'make the image brighter and more vibrant, enhance the sky, sharpen the subject')"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
              />
            )}

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
              onClick={handleEnhance}
              disabled={loading || !originalImage || (!selectedPreset && !customPrompt.trim())}
              className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <ImagePlus className="h-5 w-5 mr-2" />
                  Enhance Image
                </>
              )}
            </Button>
          </Card>

          {/* Comparison Section */}
          {(loading || enhancedImage) && (
            <Card className="p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Before & After</h3>
                {enhancedImage && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Enhanced
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Original */}
                <div>
                  <p className="text-white/60 text-sm mb-2 font-medium">Original</p>
                  <div className="aspect-square bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    {originalImage && (
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Enhanced */}
                <div>
                  <p className="text-white/60 text-sm mb-2 font-medium">Enhanced</p>
                  <div className="aspect-square bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                    {loading ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-indigo-400 animate-spin" />
                        <p className="text-white/60">Enhancing your image...</p>
                      </div>
                    ) : enhancedImage ? (
                      <img
                        src={enhancedImage}
                        alt="Enhanced"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-8">
                        <ImagePlus className="h-16 w-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">Enhanced image will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Tips Section */}
          <Card className="mt-8 p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
            <h3 className="text-lg font-semibold mb-4 text-white">💡 Enhancement Tips</h3>
            <ul className="grid md:grid-cols-2 gap-3 text-white/60 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>Use presets for quick, common enhancements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>Custom prompts give you more control over the result</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>Combine multiple enhancements in one custom prompt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>Higher quality source images produce better results</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
