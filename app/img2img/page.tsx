'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Wand2, Download, Loader2, Upload, X, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { DottedSurface } from '@/components/ui/dotted-surface'
import { ShootingStars } from '@/components/ui/shooting-stars'
import Image from 'next/image'

const PREDEFINED_PROMPTS = {
  personal: [
    { label: 'Professional Headshot', prompt: 'Transform into a professional business headshot with studio lighting and neutral background' },
    { label: 'Business Profile', prompt: 'Convert to a polished business profile photo with professional attire and corporate background' },
    { label: 'Dating Profile', prompt: 'Enhance into an attractive dating profile photo with warm lighting and friendly atmosphere' },
    { label: 'Casual Lifestyle', prompt: 'Transform into a casual lifestyle photo with natural lighting and relaxed vibe' },
    { label: 'Social Media Ready', prompt: 'Optimize for social media with vibrant colors and eye-catching composition' },
    { label: 'Artistic Portrait', prompt: 'Convert to an artistic portrait with dramatic lighting and creative styling' },
    { label: 'Influencer Style', prompt: 'Transform into influencer-style photo with trendy aesthetics and perfect lighting' },
    { label: 'Travel Explorer', prompt: 'Convert to adventurous travel photo with scenic background and dynamic composition' },
    { label: 'Fitness Photo', prompt: 'Transform into motivational fitness photo with energetic vibe and athletic look' },
    { label: 'Graduation Photo', prompt: 'Convert to formal graduation portrait with academic setting and professional quality' },
    { label: 'Family Portrait', prompt: 'Transform into warm family portrait with soft lighting and harmonious composition' },
    { label: 'Corporate Headshot', prompt: 'Convert to high-end corporate headshot with executive presence and studio quality' },
    { label: 'LinkedIn Profile', prompt: 'Optimize for LinkedIn with professional appearance and trustworthy presentation' },
    { label: 'Modeling Portfolio', prompt: 'Transform into fashion modeling shot with high-fashion lighting and editorial quality' },
    { label: 'Passport Photo', prompt: 'Convert to official passport-style photo with neutral background and proper lighting' },
  ],
  product: [
    { label: 'Studio White Background', prompt: 'Place product on pure white studio background with professional lighting and shadows' },
    { label: '360 Product View', prompt: 'Transform into dynamic product showcase with multiple angle perspective' },
    { label: 'Table Display', prompt: 'Place product on elegant table display with lifestyle context and natural lighting' },
    { label: 'Professional Packaging', prompt: 'Present product with premium packaging design and retail-ready appearance' },
    { label: 'E-commerce Listing', prompt: 'Optimize for e-commerce with clear product focus and attractive presentation' },
    { label: 'Gradient Backdrop', prompt: 'Place product against modern gradient backdrop with studio lighting' },
    { label: 'Lifestyle Context', prompt: 'Show product in real-life usage context with natural environment' },
    { label: 'Minimalist Display', prompt: 'Present product with minimalist aesthetic and clean composition' },
    { label: 'Hero Product Shot', prompt: 'Transform into hero product shot with dramatic lighting and premium look' },
    { label: 'Flat Lay Style', prompt: 'Arrange product in flat lay composition with complementary items' },
    { label: 'Black Studio Background', prompt: 'Place product on dramatic black studio background with accent lighting' },
    { label: 'Advertising Ready', prompt: 'Create advertisement-ready product shot with commercial quality and appeal' },
    { label: 'Mockup Format', prompt: 'Convert to professional mockup format with realistic presentation' },
    { label: 'Amazon Listing Style', prompt: 'Optimize for Amazon marketplace with multiple product views and infographics' },
    { label: 'Premium Luxury Shot', prompt: 'Transform into luxury product photography with high-end presentation' },
  ],
  creative: [
    { label: 'Anime Style', prompt: 'Transform into anime art style with vibrant colors and characteristic features' },
    { label: 'Cartoon Character', prompt: 'Convert to playful cartoon character with exaggerated features and bold colors' },
    { label: 'Marvel Superhero', prompt: 'Transform into Marvel superhero with epic costume and heroic pose' },
    { label: 'Disney Pixar Style', prompt: 'Convert to Disney Pixar 3D animation style with charming character design' },
    { label: 'Watercolor Painting', prompt: 'Transform into beautiful watercolor painting with soft edges and flowing colors' },
    { label: 'Oil Painting', prompt: 'Convert to classical oil painting with rich textures and artistic brushstrokes' },
    { label: 'Pencil Sketch', prompt: 'Transform into detailed pencil sketch with artistic shading and line work' },
    { label: 'Cyberpunk Aesthetic', prompt: 'Convert to cyberpunk style with neon lights and futuristic atmosphere' },
    { label: 'Fantasy Art', prompt: 'Transform into epic fantasy art with magical elements and dramatic composition' },
    { label: 'Vintage Photo', prompt: 'Convert to vintage photograph with retro colors and nostalgic feel' },
    { label: 'Retro 80s Style', prompt: 'Transform into 1980s retro aesthetic with neon colors and geometric patterns' },
    { label: 'Vaporwave', prompt: 'Convert to vaporwave aesthetic with surreal colors and glitch effects' },
    { label: 'Gothic Art', prompt: 'Transform into dark gothic art style with dramatic atmosphere and moody tones' },
    { label: 'Steampunk Style', prompt: 'Convert to steampunk aesthetic with Victorian elements and mechanical details' },
    { label: 'Pop Art Style', prompt: 'Transform into pop art with bold colors, high contrast, and comic book style' },
  ],
}

export default function Img2ImgPage() {
  const [prompt, setPrompt] = useState('')
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [transformedImage, setTransformedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'personal' | 'product' | 'creative'>('personal')
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setOriginalImage(reader.result as string)
        setTransformedImage(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTransform = async () => {
    if (!originalImage) {
      setError('Please upload an image first')
      return
    }
    if (!prompt.trim()) {
      setError('Please enter a transformation prompt')
      return
    }

    setLoading(true)
    setError(null)
    setTransformedImage(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          image: originalImage,
          mode: 'img2img'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transform image')
      }

      setTransformedImage(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (transformedImage) {
      const link = document.createElement('a')
      link.href = transformedImage
      link.download = `luminafy-transformed-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const clearImage = () => {
    setOriginalImage(null)
    setTransformedImage(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <DottedSurface />
      <ShootingStars
        starColor="#0099FF"
        trailColor="#0066CC"
        minSpeed={15}
        maxSpeed={35}
        minDelay={1000}
        maxDelay={3000}
      />
      <ShootingStars
        starColor="#00CCFF"
        trailColor="#0088DD"
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
            <Wand2 className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Image Transformation
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Transform Your Images with AI
            </h2>
            <p className="text-white/60 text-lg">
              Upload an image and describe how you want to transform it
            </p>
          </div>

          {/* Upload and Prompt Section */}
          <Card className="p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload Section */}
              <div>
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
                    className="w-full aspect-square bg-white/5 rounded-lg border-2 border-dashed border-white/20 hover:border-blue-400/50 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer"
                  >
                    <Upload className="h-16 w-16 text-white/40" />
                    <div className="text-center">
                      <p className="text-white/60 font-medium">Click to upload image</p>
                      <p className="text-white/40 text-sm mt-1">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                  </button>
                ) : (
                  <div className="relative aspect-square bg-white/5 rounded-lg border border-white/10 overflow-hidden">
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
              </div>

              {/* Prompt Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">Transformation Style</h3>
                
                {/* Category Tabs */}
                <div className="flex gap-2 mb-4">
                  <Button
                    onClick={() => { setSelectedCategory('personal'); setUseCustomPrompt(false); }}
                    variant={selectedCategory === 'personal' ? 'default' : 'outline'}
                    className={selectedCategory === 'personal' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                      : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'}
                  >
                    Personal Photos
                  </Button>
                  <Button
                    onClick={() => { setSelectedCategory('product'); setUseCustomPrompt(false); }}
                    variant={selectedCategory === 'product' ? 'default' : 'outline'}
                    className={selectedCategory === 'product' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                      : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'}
                  >
                    Product Photos
                  </Button>
                  <Button
                    onClick={() => { setSelectedCategory('creative'); setUseCustomPrompt(false); }}
                    variant={selectedCategory === 'creative' ? 'default' : 'outline'}
                    className={selectedCategory === 'creative' 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                      : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'}
                  >
                    Creative Styles
                  </Button>
                </div>

                {/* Custom Prompt Toggle */}
                <div className="mb-4">
                  <Button
                    onClick={() => setUseCustomPrompt(!useCustomPrompt)}
                    variant="outline"
                    className="w-full bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {useCustomPrompt ? 'Use Predefined Prompts' : 'Write Custom Prompt'}
                  </Button>
                </div>

                {useCustomPrompt ? (
                  <Textarea
                    placeholder="Describe how you want to transform the image... (e.g., 'turn this into a watercolor painting', 'make it look like a vintage photo', 'add autumn colors and falling leaves')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[280px] bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none"
                  />
                ) : (
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                    {PREDEFINED_PROMPTS[selectedCategory].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setPrompt(item.prompt)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          prompt === item.prompt
                            ? 'bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border-blue-400/50 text-white'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="font-medium text-sm">{item.label}</div>
                      </button>
                    ))}
                  </div>
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
                  onClick={handleTransform}
                  disabled={loading || !originalImage || !prompt.trim()}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white h-12"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Transforming...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5 mr-2" />
                      Transform Image
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Comparison Section */}
          {(loading || transformedImage) && (
            <Card className="p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Before & After</h3>
                {transformedImage && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Result
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

                {/* Transformed */}
                <div>
                  <p className="text-white/60 text-sm mb-2 font-medium">Transformed</p>
                  <div className="aspect-square bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                    {loading ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
                        <p className="text-white/60">Applying transformations...</p>
                      </div>
                    ) : transformedImage ? (
                      <img
                        src={transformedImage}
                        alt="Transformed"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-8">
                        <Wand2 className="h-16 w-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">Transformed image will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Tips Section */}
          <Card className="mt-8 p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
            <h3 className="text-lg font-semibold mb-4 text-white">💡 Transformation Tips</h3>
            <ul className="grid md:grid-cols-2 gap-3 text-white/60 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Be clear about the style you want (painting, sketch, photo, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Mention specific colors, moods, or artistic styles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Use reference artists or art movements for better results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Keep your original image well-lit and clear for best results</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
