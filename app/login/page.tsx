'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Mail, Lock, Sparkles, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

// Elegant Shape Component
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute pointer-events-none", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border border-white/[0.1]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (data.user) {
        setMessage('Login successful! Redirecting...')
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to login. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden">
      {/* Elegant Floating Shapes Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.2}
          width={500}
          height={120}
          rotate={15}
          gradient="from-cyan-500/[0.12]"
          className="left-[-10%] top-[10%]"
        />
        <ElegantShape
          delay={0.4}
          width={400}
          height={100}
          rotate={-20}
          gradient="from-blue-500/[0.12]"
          className="right-[-5%] top-[60%]"
        />
        <ElegantShape
          delay={0.3}
          width={300}
          height={80}
          rotate={10}
          gradient="from-indigo-500/[0.12]"
          className="left-[5%] bottom-[15%]"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-blue-500/[0.03]" />

      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="absolute top-6 left-6 z-20 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm">
          <ArrowLeft className='size-4 me-2' />
          Back
        </Button>
      </Link>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-full max-w-md"
        >
          <Card className="p-8 md:p-10 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-2xl">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="h-7 w-7 text-cyan-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Luminafy AI
              </h1>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-white/40 text-sm">Sign in to continue your creative journey</p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Success Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                >
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-400">{message}</p>
                </motion.div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white/80">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-11 h-12 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/30"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-white/80">
                    Password
                  </label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-11 pr-11 h-12 bg-white/[0.03] border-white/[0.08] focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/30"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-cyan-500/25 transition-all"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-[#030303] text-white/40">
                    New to Luminafy?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <Link href="/signup" className="block">
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full h-12 border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.15] text-white transition-all"
                >
                  Create Account
                </Button>
              </Link>

              {/* Terms */}
              <p className="text-xs text-white/30 text-center leading-relaxed">
                By continuing, you agree to our{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </Card>

          {/* Additional Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center text-white/30 text-sm mt-6"
          >
            Secured with enterprise-grade encryption
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
    </div>
  )
}
