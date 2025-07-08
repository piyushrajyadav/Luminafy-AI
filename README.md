# Luminafy-AI

An AI-powered photo transformation tool built with Next.js, TypeScript, and Tailwind CSS.

---

## 🚀 Overview

Luminafy-AI lets you effortlessly transform your photos using state-of-the-art AI models from Replicate, including SDXL and DreamBooth. Upload your images, select a style, and watch as your photos are reimagined in real time. Perfect for personal, product, and creative use cases.

---

## ✨ Features

- **AI-Powered Image Transformation**: Leverage Replicate's SDXL and DreamBooth models for stunning results.
- **Drag & Drop Upload**: Easily upload images with a modern drag-and-drop interface.
- **Style Categorization**: Choose from Personal, Product, and Creative styles.
- **Real-Time Generation**: See your transformed images instantly.
- **Before/After Comparison**: Compare original and generated images side by side.
- **Download Functionality**: Save your creations with a single click.
- **Dark/Light Mode**: Seamlessly switch between themes.
- **Responsive Design**: Optimized for all devices.

---

## 🛠️ Tech Stack

- [Next.js 14+ (App Router)](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📦 Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/luminafy-ai.git
   cd luminafy-ai
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   ```

3. **Set up environment variables:**
   - setup .env

4. **Run the development server:**
   ```sh
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory and add:

```env
CF_API_TOKEN=
CF_ACCOUNT_ID=
DEMO_MODE=false
```

---

## 🖼️ Usage

1. Upload your photo using drag & drop or file picker.
2. Select a style category.
3. Click "Generate" to transform your image.
4. Compare before/after and download the result.

---

## ⚙️ Project Structure

- `app/` – Next.js app directory (App Router)
- `components/` – UI and functional components
- `hooks/` – Custom React hooks
- `lib/` – Utility functions
- `public/` – Static assets
- `styles/` – Global styles

---

## 🧑‍💻 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and new features.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [cloudflare] for their powerful AI models
- [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and the open-source community
