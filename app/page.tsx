'use client'

import { SplineScene } from "@/components/ui/spline"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { Button } from "@/components/ui/button"
import { Sparkles, Wand2, ImagePlus } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with 3D Scene */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        
        <div className="container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-block">
                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold">
                  AI-Powered Image Platform
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight">
                Transform Your
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Visual Ideas
                </span>
              </h1>
              
              <p className="text-xl text-neutral-300 max-w-lg leading-relaxed">
                Unleash creativity with our AI-powered platform. Generate stunning images from text, 
                transform existing photos, or enhance image quality with cutting-edge technology.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/login">
                  <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg">
                    Get Started
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="border-neutral-700 hover:bg-neutral-900 px-8 py-6 text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-neutral-800">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    50K+
                  </div>
                  <div className="text-sm text-neutral-400">Images Generated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    10K+
                  </div>
                  <div className="text-sm text-neutral-400">Happy Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-blue-600 bg-clip-text text-transparent">
                    99.9%
                  </div>
                  <div className="text-sm text-neutral-400">Uptime</div>
                </div>
              </div>
            </motion.div>

            {/* Right Content - 3D Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[600px] hidden lg:block"
            >
              <Card className="h-full bg-black/50 backdrop-blur-xl border-neutral-800 overflow-hidden">
                <SplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Three Powerful AI Services
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Choose the perfect tool for your creative needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Text to Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-gradient-to-br from-cyan-900/20 to-blue-600/10 border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 h-full group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Text to Image</h3>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  Transform your words into stunning visual masterpieces. Simply describe what you envision, 
                  and watch AI bring it to life with photorealistic quality.
                </p>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li className="flex items-center"><span className="text-cyan-400 mr-2">✓</span> Multiple art styles</li>
                  <li className="flex items-center"><span className="text-cyan-400 mr-2">✓</span> High resolution output</li>
                  <li className="flex items-center"><span className="text-cyan-400 mr-2">✓</span> Fast generation</li>
                </ul>
              </Card>
            </motion.div>

            {/* Image to Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-gradient-to-br from-blue-900/20 to-indigo-600/10 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 h-full group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wand2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Image Transformation</h3>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  Upload any image and transform it with AI. Change styles, add effects, or completely 
                  reimagine your photos with intelligent modifications.
                </p>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Style transfer</li>
                  <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Smart editing</li>
                  <li className="flex items-center"><span className="text-blue-400 mr-2">✓</span> Preserve quality</li>
                </ul>
              </Card>
            </motion.div>

            {/* Image Enhancement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 bg-gradient-to-br from-indigo-900/20 to-blue-600/10 border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 h-full group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ImagePlus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Image Enhancement</h3>
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  Restore clarity to blurry or low-quality images. Our AI removes noise, sharpens details, 
                  and enhances colors to make every photo crystal clear.
                </p>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li className="flex items-center"><span className="text-indigo-400 mr-2">✓</span> Remove blur</li>
                  <li className="flex items-center"><span className="text-indigo-400 mr-2">✓</span> Upscale resolution</li>
                  <li className="flex items-center"><span className="text-indigo-400 mr-2">✓</span> Noise reduction</li>
                </ul>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-700 text-white px-12 py-6 text-lg">
                Start Creating Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-neutral-400">
            <p className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Luminafy AI
            </p>
            <p className="text-sm">© 2025 Luminafy AI. Transform your visual ideas with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
