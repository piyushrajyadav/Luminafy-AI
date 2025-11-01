'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, Wand2, ImagePlus, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { DottedSurface } from '@/components/ui/dotted-surface'
import { GlowCard } from '@/components/ui/spotlight-card'

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }

    getUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 relative flex items-center justify-center">
        <DottedSurface />
        <div className="relative z-10 animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      {/* Dotted Surface Background */}
      <DottedSurface />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-xl sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Luminafy AI
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <User className="h-4 w-4 text-white/60" />
              <span className="text-sm text-white/80">{user?.email}</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Choose Your AI Tool
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Select the perfect service for your creative needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Text to Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/text-to-image">
              <GlowCard
                glowColor="purple"
                customSize
                className="w-full h-full min-h-[400px] cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Text to Image</h3>
                  <p className="text-white/60 mb-6 leading-relaxed flex-grow">
                    Transform your words into stunning visuals. Describe what you want and watch AI create it.
                  </p>
                  <ul className="space-y-3 text-sm text-white/50 mb-6">
                    <li className="flex items-center"><span className="text-cyan-400 mr-2 text-lg">✓</span> Multiple art styles</li>
                    <li className="flex items-center"><span className="text-cyan-400 mr-2 text-lg">✓</span> High resolution</li>
                    <li className="flex items-center"><span className="text-cyan-400 mr-2 text-lg">✓</span> Fast generation</li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0">
                    Get Started
                  </Button>
                </div>
              </GlowCard>
            </Link>
          </motion.div>

          {/* Image to Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/img2img">
              <GlowCard
                glowColor="blue"
                customSize
                className="w-full h-full min-h-[400px] cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6">
                    <Wand2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Image Transform</h3>
                  <p className="text-white/60 mb-6 leading-relaxed flex-grow">
                    Upload and transform your images with AI. Change styles and reimagine photos.
                  </p>
                  <ul className="space-y-3 text-sm text-white/50 mb-6">
                    <li className="flex items-center"><span className="text-blue-400 mr-2 text-lg">✓</span> Style transfer</li>
                    <li className="flex items-center"><span className="text-blue-400 mr-2 text-lg">✓</span> Smart editing</li>
                    <li className="flex items-center"><span className="text-blue-400 mr-2 text-lg">✓</span> Quality preserved</li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 border-0">
                    Get Started
                  </Button>
                </div>
              </GlowCard>
            </Link>
          </motion.div>

          {/* Image Enhancement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/enhancement">
              <GlowCard
                glowColor="green"
                customSize
                className="w-full h-full min-h-[400px] cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-6">
                    <ImagePlus className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Enhance Image</h3>
                  <p className="text-white/60 mb-6 leading-relaxed flex-grow">
                    Fix blurry photos and restore clarity. AI removes noise and sharpens details.
                  </p>
                  <ul className="space-y-3 text-sm text-white/50 mb-6">
                    <li className="flex items-center"><span className="text-indigo-400 mr-2 text-lg">✓</span> Remove blur</li>
                    <li className="flex items-center"><span className="text-indigo-400 mr-2 text-lg">✓</span> Upscale quality</li>
                    <li className="flex items-center"><span className="text-indigo-400 mr-2 text-lg">✓</span> Noise reduction</li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 border-0">
                    Get Started
                  </Button>
                </div>
              </GlowCard>
            </Link>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
              50K+
            </div>
            <div className="text-sm text-white/40">Images Created</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className="text-sm text-white/40">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-500 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-sm text-white/40">Satisfaction</div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
