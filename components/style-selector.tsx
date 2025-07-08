"use client"

import { useState } from "react"
import { User, Package, Palette } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StyleSelectorProps {
  onStyleSelect: (style: string) => void
  selectedStyle: string
  isDark: boolean
}

const styleCategories = {
  personal: {
    icon: User,
    title: "🧑‍💼 Personal Photo Styles",
    styles: [
      {
        value: "professional-headshot",
        label: "👨‍💼 Professional Headshot",
        description: "Neutral background, formal outfit, studio lighting",
      },
      {
        value: "casual-lifestyle",
        label: "🏖️ Casual Lifestyle",
        description: "Natural light, relaxed outfit, home/park setting",
      },
      {
        value: "social-media-vibe",
        label: "📸 Social Media Vibe",
        description: "Trendy filters, soft bokeh backgrounds",
      },
      {
        value: "business-profile",
        label: "💼 Business Profile",
        description: "Subtle background blur, suit, office environment",
      },
      { value: "artistic-portrait", label: "🎨 Artistic Portrait", description: "Sketch, oil paint, cartoon style" },
      { value: "ai-fantasy", label: "💡 AI Fantasy", description: "Cyberpunk, Vaporwave, Anime or Ghibli-inspired" },
      { value: "dating-profile", label: "📱 Dating Profile", description: "Warm tones, smile enhanced, cozy settings" },
      { value: "travel-explorer", label: "🧳 Travel Explorer", description: "Scenic background (mountain/beach/city)" },
      {
        value: "influencer-lookbook",
        label: "🕶️ Influencer Lookbook",
        description: "Trendy outfit, sharp lighting (Instagram/TikTok ready)",
      },
    ],
  },
  product: {
    icon: Package,
    title: "📦 Product Photo Styles",
    styles: [
      {
        value: "studio-white-bg",
        label: "🧱 Studio White Background",
        description: "Amazon-ready clean white background",
      },
      { value: "gradient-banner", label: "🌈 Gradient Banner", description: "Stylish gradient backgrounds for ads" },
      {
        value: "lifestyle-placement",
        label: "🖼️ Lifestyle Placement",
        description: "Product in real-world context (desk, kitchen)",
      },
      {
        value: "minimalist-display",
        label: "🌟 Minimalist Display",
        description: "Centered product with pastel or soft background",
      },
      {
        value: "hero-product-shot",
        label: "⚡ Hero Product Shot",
        description: "Large image, glow, shadows for ad banners",
      },
      { value: "flat-lay-design", label: "📐 Flat Lay Design", description: "Top-down fashion/tech/food shot" },
      { value: "mockup-ready", label: "🖋️ Mockup Ready", description: "On phone, poster, packaging" },
      {
        value: "360-3d-angle",
        label: "🎥 360/3D Angle",
        description: "Multiple perspectives (simulate product rotation)",
      },
      { value: "black-studio", label: "🔲 Black Studio", description: "Glossy luxury look with black background" },
      { value: "food-plating", label: "🍽️ Food Plating", description: "Styled warm photos with dishes and table setup" },
    ],
  },
  creative: {
    icon: Palette,
    title: "🎨 Creative Styles (Both Users)",
    styles: [
      {
        value: "anime-cartoon",
        label: "🎭 Anime / Cartoon",
        description: "Turn real image into anime/cartoon version",
      },
      { value: "cyberpunk-neon", label: "💥 Cyberpunk / Neon", description: "Futuristic lighting and colors" },
      {
        value: "fantasy-mythical",
        label: "🐉 Fantasy / Mythical",
        description: "Magical themes with castles and creatures",
      },
      {
        value: "winter-summer-theme",
        label: "🧊 Winter / Summer Theme",
        description: "Add seasonal effects and backgrounds",
      },
      { value: "aesthetic-moody", label: "🧘 Aesthetic / Moody", description: "Minimalist dark/light tones" },
      {
        value: "ad-mockup-format",
        label: "💡 Ad Mockup Format",
        description: "Banner-ready layout with branding text overlay",
      },
      { value: "poster-output", label: "🔳 Poster Output", description: "A3/A4 printable format with layout framing" },
    ],
  },
}

export default function StyleSelector({ onStyleSelect, selectedStyle, isDark }: StyleSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const handleStyleSelect = (value: string) => {
    onStyleSelect(value)
  }

  const handleCategorySelect = (categoryKey: string) => {
    setSelectedCategory(categoryKey)
    setActiveCategory(categoryKey)
  }

  const getSelectedStyleInfo = () => {
    for (const category of Object.values(styleCategories)) {
      const style = category.styles.find((s) => s.value === selectedStyle)
      if (style) return style
    }
    return null
  }

  const selectedStyleInfo = getSelectedStyleInfo()

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="grid grid-cols-1 gap-3">
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          First, choose your photo type:
        </h3>
        {Object.entries(styleCategories).map(([key, category]) => {
          const IconComponent = category.icon
          return (
            <button
              key={key}
              onClick={() => handleCategorySelect(key)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                selectedCategory === key
                  ? isDark
                    ? "bg-purple-400/20 border-purple-400 text-white"
                    : "bg-purple-50 border-purple-500 text-purple-700"
                  : isDark
                  ? "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30"
                  : "bg-white/50 border-gray-200 text-gray-600 hover:bg-white/70 hover:border-gray-300"
              }`}
            >
              <IconComponent className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">{category.title}</div>
                <div className="text-sm opacity-75">
                  {key === "personal" && "Profile photos, headshots, lifestyle shots"}
                  {key === "product" && "E-commerce, Amazon listings, marketing materials"}
                  {key === "creative" && "Artistic styles, anime, fantasy themes"}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Style Selection - only show after category is selected */}
      {selectedCategory && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            Now, pick your style:
          </h3>
          <Select onValueChange={handleStyleSelect} value={selectedStyle}>
            <SelectTrigger
              className={`w-full h-14 text-left rounded-xl border-2 ${
                isDark ? "bg-white/5 border-white/20 text-white" : "bg-white/50 border-gray-200 text-gray-900"
              }`}
            >
              <SelectValue placeholder="Choose your photoshoot style..." />
            </SelectTrigger>
            <SelectContent
              className={`rounded-xl border-2 ${
                isDark ? "bg-gray-900/95 border-white/20 text-white" : "bg-white/95 border-gray-200 text-gray-900"
              }`}
            >
              {styleCategories[selectedCategory as keyof typeof styleCategories].styles.map((style) => (
                <SelectItem
                  key={style.value}
                  value={style.value}
                  className={`px-4 py-3 cursor-pointer ${
                    isDark ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-gray-100 focus:bg-gray-100"
                  }`}
                >
                  <div>
                    <div className="font-medium">{style.label}</div>
                    <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {style.description}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedStyleInfo && (
        <div
          className={`p-4 rounded-xl border ${
            isDark ? "bg-purple-400/10 border-purple-400/20" : "bg-purple-50 border-purple-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${isDark ? "bg-purple-400" : "bg-purple-600"}`} />
            <div>
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{selectedStyleInfo.label}</h3>
              <p className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {selectedStyleInfo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
