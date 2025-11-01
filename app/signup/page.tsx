'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Mail, Lock, Sparkles, AlertCircle, CheckCircle, Eye, EyeOff, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
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

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        setSuccess(true)
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#030303] text-white relative overflow-hidden flex items-center justify-center p-4">
        {/* Elegant Floating Shapes Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ElegantShape
            delay={0.2}
            width={500}
            height={120}
            rotate={15}
            gradient="from-green-500/[0.12]"
            className="left-[-10%] top-[10%]"
          />
          <ElegantShape
            delay={0.4}
            width={400}
            height={100}
            rotate={-20}
            gradient="from-emerald-500/[0.12]"
            className="right-[-5%] top-[60%]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="p-10 md:p-12 bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-2xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6"
            >
              <Mail className="h-10 w-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
              Check Your Email!
            </h2>

            <p className="text-white/60 mb-6 leading-relaxed">
              We've sent a verification link to <span className="text-white font-medium">{email}</span>
            </p>
            
            <div className="space-y-3 text-sm text-white/40 text-left bg-white/[0.02] p-5 rounded-xl border border-white/[0.05] mb-6">
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Click the verification link in your email</span>
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>You'll be redirected to your dashboard</span>
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Check spam folder if you don't see it</span>
              </p>
            </div>

            <Link href="/login">
              <Button className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg">
                Back to Login
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    )
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
          gradient="from-indigo-500/[0.12]"
          className="left-[-10%] top-[10%]"
        />
        <ElegantShape
          delay={0.4}
          width={400}
          height={100}
          rotate={-20}
          gradient="from-rose-500/[0.12]"
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
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-black/50 backdrop-blur-xl border-neutral-800">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="h-8 w-8 text-cyan-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Luminafy AI
              </h1>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-neutral-400">Join thousands of creators using AI to transform images</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-500">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-neutral-900 border-neutral-800 focus:border-purple-500"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="pl-10 pr-10 bg-neutral-900 border-neutral-800 focus:border-purple-500"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500">Must be at least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 bg-neutral-900 border-neutral-800 focus:border-purple-500"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords don't match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || password !== confirmPassword}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    <>Create Account</>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/50 text-neutral-400">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Link href="/login">
                <Button variant="outline" className="w-full border-neutral-800 hover:bg-neutral-900">
                  Sign In
                </Button>
              </Link>

              <p className="text-xs text-white/30 text-center leading-relaxed">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">
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
            Join thousands of creators worldwide
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
    </div>
  )
}
