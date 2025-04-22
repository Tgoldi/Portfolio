# Tomer Goldstein Portfolio

![Portfolio Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan)

A modern, high-performance portfolio website showcasing my skills, projects, and experience as a full-stack developer. Built with React, TypeScript, and enhanced with smooth Framer Motion animations.

## ✨ Features

- **Modern Tech Stack**: React 18, TypeScript, Vite, and other cutting-edge technologies
- **Performance Optimized**: 90+ Lighthouse scores with intelligent asset loading
- **Responsive Design**: Mobile-first approach with fully responsive layouts
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Smooth Animations**: Professional micro-interactions and scroll animations with Framer Motion
- **SEO Ready**: Complete SEO setup with meta tags, OpenGraph, and structured data
- **Accessible Design**: WCAG 2.1 compliant with keyboard navigation support
- **Contact Form**: Fully functional contact form with EmailJS integration

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/tomergoldst/portfolio.git

# Navigate to the project directory
cd portfolio

# Install dependencies
npm install

# Create .env file for EmailJS (for contact form)
# Copy .env.example to .env and fill in your EmailJS credentials
cp .env.example .env

# Start the development server
npm run dev
```

## 📧 Setting Up EmailJS

This portfolio uses EmailJS for the contact form functionality:

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create a new service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your service ID, template ID, and user ID
5. Add them to your `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_USER_ID=your_user_id
```

For more detailed instructions, see [EMAILJS_SETUP.md](EMAILJS_SETUP.md).

## 🔧 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layout/        # Layout components (Header, Footer)
│   └── ui/            # UI components (Button, Card, etc.)
├── data/              # Data files for projects, skills, etc.
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and helpers
├── pages/             # Main page components
├── providers/         # Context providers
└── App.tsx            # Main application component
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The `dist` folder can be deployed to any static hosting provider:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## 📋 Core Dependencies

- React 18
- TypeScript
- Vite
- Framer Motion
- TailwindCSS
- React Router
- Shadcn/ui components
- EmailJS

## 🔄 GitHub Setup

To upload this project to your GitHub repository:

```bash
# Create a new GitHub repository at https://github.com/new

# Link your local repository to GitHub (replace with your repository URL)
git remote add origin https://github.com/yourusername/portfolio.git

# Push your code to GitHub
git push -u origin main
```

Make sure to set up GitHub Pages or your preferred hosting solution for deployment.

## 📄 License

This project is licensed under the MIT License.

---

Built by Tomer Goldstein
