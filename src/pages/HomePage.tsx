/**
 * HomePage Component
 * 
 * This file renders the main homepage of the portfolio.
 * 
 * RECOMMENDED FILE STRUCTURE FOR PRODUCTION/INTERVIEW-READY CODE:
 * 
 * /src
 *   /components
 *     /home
 *       /animations
 *         - variants.ts (all animation variants)
 *       - TypedText.tsx
 *       - SkillCard.tsx
 *       - TechPill.tsx
 *       - HeroSection.tsx
 *       - AboutSection.tsx
 *       - TechStackSection.tsx
 *       - ProjectsSection.tsx
 *       - ScrollNavigationDots.tsx
 *     /ui
 *       - ScrollToTopButton.tsx
 *       - ScrollProgressBar.tsx
 *   /data
 *     - skills.ts (tech stack data)
 *   /types
 *     - skill.types.ts (skill-related types)
 *   /hooks
 *     - useScrollPosition.ts (custom scroll hooks)
 *   /utils
 *     - animation.utils.ts (animation helper functions)
 * 
 * This improves:
 * 1. Code maintainability
 * 2. Testing isolation
 * 3. Component reusability
 * 4. Bundle size optimization via code splitting
 * 5. Parallel development workflow
 */

import { motion, useAnimation, useScroll, useTransform, Variants } from "framer-motion";
import { useEffect, useRef, useState, useCallback, memo, useMemo } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ArrowUpIcon } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { projectsData } from "@/data/projectsData";
import { SEO } from "@/components/SEO";

// ===== Animation Variants =====
/**
 * Container animation variants for staggered children
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

/**
 * Item animation variants for children in container
 */
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 120,
      damping: 10
    }
  }
};

/**
 * Simple floating animation for UI elements
 */
const floatingAnimation = {
  y: [-5, 5],
  transition: {
    y: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

/**
 * Enhanced floating animation for tech icons with glow effect
 */
const techIconAnimation = {
  y: [-5, 5],
  filter: ["drop-shadow(0 0 8px rgba(var(--crimson), 0.3))", "drop-shadow(0 0 2px rgba(var(--crimson), 0.1))"],
  transition: {
    y: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    },
    filter: {
      duration: 1.2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

/**
 * Generates animation properties for code particles
 * @param i - Index of the particle for position calculation
 */
const codeParticleAnimation = (i: number) => ({
  initial: { 
    opacity: 0, 
    y: 0, 
    x: Math.random() * 100 - 50 
  },
  animate: { 
    opacity: [0, 0.7, 0],
    y: -100 - Math.random() * 100,
    x: Math.random() * 50 - 25 + i * 10
  },
  transition: { 
    duration: 3 + Math.random() * 2,
    repeat: Infinity,
    delay: Math.random() * 5,
    ease: "easeOut"
  }
});

/**
 * Animation for profile image with floating and subtle rotation
 */
const profileImageAnimation = {
  y: [-5, 5],
  rotate: [-0.5, 0.5],
  transition: {
    y: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    },
    rotate: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

/**
 * Fade-in-up animation variant for content sections
 */
const fadeInUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};

/**
 * Staggered container animation for groups of items
 */
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// ===== Type Definitions =====
/**
 * Represents a single skill item with its properties
 */
export interface SkillItem {
  name: string;
  icon: string;
  darkModeInvert?: boolean;
}

/**
 * Props for the SkillCard component
 */
export interface SkillCardProps {
  skill: SkillItem;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

/**
 * Props for the TypedText component
 */
interface TypedTextProps {
  text: string;
  delay?: number;
  className?: string;
  startDelay?: number;
  speed?: number;
}

/**
 * Props for the TechPill component
 */
interface TechPillProps {
  tech: string;
  variants: Variants;
  custom: number;
}

// ===== Data Definitions =====
/**
 * Skills data organized by category
 */
const techStackSkills: Record<string, SkillItem[]> = {
  frontend: [
    { name: "React", icon: "/tech/react.svg" },
    { name: "JavaScript", icon: "/tech/javascript.svg" },
    { name: "TypeScript", icon: "/tech/typescript.svg" },
    { name: "HTML", icon: "/tech/html.svg" },
    { name: "CSS", icon: "/tech/css.svg" },
    { name: "Material-UI", icon: "/tech/material-ui.svg" },
    { name: "Tailwind CSS", icon: "/public/tech/tailwind.svg" },
    { name: "Bootstrap", icon: "/tech/bootstrap.svg" },
    { name: "Shadcn", icon: "/tech/shadcn.svg", darkModeInvert: false },
    { name: "Responsive Design", icon: "/tech/responsive.svg" },
  ],
  backend: [
    { name: "Java", icon: "/tech/java.svg", darkModeInvert: true },
    { name: "Spring Boot", icon: "/tech/spring-boot.svg" },
    { name: "RESTful APIs", icon: "/tech/api.svg", darkModeInvert: true },
    { name: "PostgreSQL", icon: "/tech/postgresql.svg" },
    { name: "Node.js", icon: "/tech/node.svg" },
    { name: "Express.js", icon: "/tech/express.svg", darkModeInvert: true },
    { name: "H2 Database", icon: "/tech/database.svg", darkModeInvert: false },
    { name: "MVC Architecture", icon: "/tech/mvc.svg" },
    { name: "Supabase", icon: "/tech/supabase.svg" },
    { name: "Django", icon: "/tech/django.svg", darkModeInvert: true },
  ],
  tools: [
    { name: "Git", icon: "/tech/git.svg" },
    { name: "GitHub", icon: "/tech/github.svg", darkModeInvert: true },
    { name: "Postman", icon: "/tech/postman.svg" },
    { name: "IntelliJ", icon: "/tech/intellij.svg" },
    { name: "VS Code", icon: "/tech/vscode.svg" },
    { name: "Docker", icon: "/tech/docker.svg" },
  ],
};

// ===== Component Definitions =====
/**
 * TypedText Component
 * 
 * Renders text with a typing animation effect, character by character
 * 
 * @param text - The text to be displayed
 * @param delay - Delay between typing each character
 * @param className - Additional CSS classes
 * @param startDelay - Initial delay before typing starts
 * @param speed - Speed of typing animation
 */
const TypedText: React.FC<TypedTextProps> = memo(({ 
  text, 
  delay = 0, 
  className = "", 
  startDelay = 0, 
  speed = 0.02 
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startTyping = async () => {
      if (startDelay > 0) {
        await new Promise(resolve => {
          timeoutId = setTimeout(resolve, startDelay);
        });
      }
      
      const type = () => {
        setDisplayedText(prev => {
          if (prev.length < text.length) {
            const next = text.slice(0, prev.length + 1);
            timeout.current = setTimeout(type, speed * 1000 + Math.random() * 100);
            return next;
        } else {
          setIsTyping(false);
            return prev;
        }
        });
      };
      
      type();
    };
    
    startTyping().catch(err => {
      console.error("Error in typing animation:", err);
      setIsTyping(false);
    });
    
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, startDelay, speed]);
  
  return (
    <span className={className}>
      {displayedText}
      {isTyping && <span className="inline-block w-1 h-5 ml-1 bg-crimson animate-pulse">|</span>}
    </span>
  );
});

TypedText.displayName = 'TypedText';

/**
 * SkillCard Component
 * 
 * Displays a single skill with its icon in a card format
 * 
 * @param skill - The skill item to display
 * @param size - Size of the card (sm, md, lg)
 * @param glow - Whether to apply a glow effect
 */
const SkillCard: React.FC<SkillCardProps> = memo(({ 
  skill, 
  size = 'sm', 
  glow = false 
}) => {
  // Memoize class configurations for better performance
  const sizeClasses = useMemo(() => ({
    sm: "p-2 h-20 w-20",
    md: "p-3 h-24 w-24",
    lg: "p-4 h-28 w-28"
  }), []);
  
  const iconSizeClasses = useMemo(() => ({
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14"
  }), []);
  
  const textSizeClasses = useMemo(() => ({
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }), []);
  
  // Determine if image needs dark mode inversion based on filename or darkModeInvert prop
  const shouldInvert = useMemo(() => 
    skill.darkModeInvert || 
    (/github|express|shadcn|django/i.test(skill.icon) && skill.darkModeInvert !== false)
  , [skill.darkModeInvert, skill.icon]);
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-crimson/30 transition-all duration-300 hover:shadow-lg",
        sizeClasses[size],
        glow && "hover:shadow-crimson/20"
      )}
    >
      <img 
        src={skill.icon} 
        alt={`${skill.name} icon`}
        loading="lazy"
        decoding="async"
        className={cn(
          iconSizeClasses[size],
          "object-contain transition-all duration-300",
          "dark:brightness-110 dark:contrast-125",
          shouldInvert && "dark:invert"
        )}
      />
      <span className={cn("text-center font-medium", textSizeClasses[size])}>
        {skill.name}
      </span>
    </motion.div>
  );
});

SkillCard.displayName = 'SkillCard';

/**
 * TechPill Component
 * 
 * Displays a technology name in a pill format with icon
 * 
 * @param tech - Technology name
 * @param variants - Animation variants
 * @param custom - Custom animation delay index
 */
const TechPill: React.FC<TechPillProps> = memo(({ tech, variants, custom }) => {
  // Map for special case filenames that don't follow the standard naming convention
  const specialCaseMap = useMemo(() => ({
    'Responsive Design': 'responsive',
    'RESTful APIs': 'api',
    'H2 Database': 'database',
    'MVC Architecture': 'mvc',
    'Material-UI': 'material-ui',
    'Spring Boot': 'spring-boot',
    'Tailwind CSS': 'tailwind',
    'VS Code': 'vscode',
    'Node.js': 'node',
    'Express.js': 'express',
    'Shadcn': 'shadcn',
  }), []);
  
  // Special handling for SVGs in dark/light mode
  const getSvgClassName = useMemo(() => {
    const techLower = tech.toLowerCase();
    
    // Special cases for specific SVGs
    if (techLower.includes('spring-boot') || techLower.includes('spring boot')) {
      // For Spring Boot, we want to preserve the green color
      return "dark:brightness-125 dark:contrast-150";
    }
    
    if (techLower.includes('shadcn')) {
      // For Shadcn, invert in light mode and adjust in dark mode
      return "dark:brightness-200 dark:contrast-200 dark:invert-0 invert-[0.8] brightness-0";
    }
    
    // For other SVGs that need inversion in dark mode
    const needsInversion = [
      'github', 'express', 'django', 'java', 'api', 
      'restful', 'database', 'h2'
    ];
    
    if (needsInversion.some(keyword => techLower.includes(keyword))) {
      return "dark:brightness-110 dark:contrast-125 dark:invert";
    }
    
    // Default case for other SVGs
    return "dark:brightness-110 dark:contrast-125";
  }, [tech]);
  
  // Handle potential errors with SVG path construction
  const iconSrc = useMemo(() => {
    try {
      // Check if we have a special case mapping for this tech
      let filename = specialCaseMap[tech];
      
      // If no special mapping is found, create the filename
      if (!filename) {
        // Handle .js suffix - remove it
        if (tech.endsWith('.js')) {
          filename = tech.slice(0, -3).toLowerCase().replace(/\s+/g, '-');
        } else {
          filename = tech.toLowerCase().replace(/\s+/g, '-');
        }
      }
      
      return `/tech/${filename}.svg`;
    } catch (error) {
      console.error(`Error creating icon path for ${tech}:`, error);
      return '/tech/default.svg'; // Fallback icon
    }
  }, [tech, specialCaseMap]);
  
  return (
    <motion.span
      variants={variants}
      custom={custom}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-card/80 backdrop-blur-sm border border-border/50 hover:border-crimson/30 transition-all",
        "hover:bg-card/90 hover:shadow-md"
      )}
    >
      <img 
        src={iconSrc}
        alt={`${tech} icon`} 
        loading="lazy"
        decoding="async"
        className={cn(
          "w-4 h-4 object-contain",
          getSvgClassName
        )}
        onError={(e) => {
          // Log error to console to help debugging
          console.warn(`Failed to load SVG for "${tech}" from path: ${iconSrc}`);
          
          // Try a simpler fallback approach
          const simpleFileName = tech.split(' ')[0].toLowerCase();
          const fallbackPath = `/tech/${simpleFileName}.svg`;
          
          // Only try the fallback if it's different from the original
          if (fallbackPath !== iconSrc) {
            console.info(`Trying fallback path: ${fallbackPath}`);
            e.currentTarget.src = fallbackPath;
          } else {
            // If all else fails, use a default icon
            e.currentTarget.src = '/tech/default.svg';
          }
        }}
      />
      {tech}
    </motion.span>
  );
});

TechPill.displayName = 'TechPill';

/**
 * HomePage Component
 * 
 * The main page component rendering the entire portfolio homepage
 * Includes hero section, about me, tech stack, and projects sections
 */
const HomePage: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Refs for scroll animations
  const aboutRef = useRef<HTMLElement>(null);
  const techStackRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  
  // Track section visibility for nav indicators
  const aboutInView = useInView(aboutRef, { once: false, amount: 0.3 });
  const techStackInView = useInView(techStackRef, { once: false, amount: 0.2 });
  const projectsInView = useInView(projectsRef, { once: false, amount: 0.2 });
  
  // Scroll progress for progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  // Show/hide scroll to top button
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Memoize animation variants to prevent unnecessary recalculations
  const fadeInUpVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }
    })
  }), []);
  
  const staggerContainerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  }), []);
  
  const techIconVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  }), []);
  
  // Handle scroll events and initial setup
  useEffect(() => {
    // Scroll to top when component mounts
    try {
    window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error scrolling to top on mount:", error);
    }
    
    // Handle scroll events for showing/hiding scroll-to-top button
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  /**
   * Scrolls to the specified section smoothly
   * @param elementRef - Reference to the target element
   */
  const scrollToSection = useCallback((elementRef: React.RefObject<HTMLElement>) => {
    if (!elementRef.current) {
      console.warn("Target element reference is not available");
      return;
    }
    
    try {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error scrolling to section:", error);
      // Fallback to traditional scroll if scrollIntoView fails
      const targetPosition = elementRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  }, []);
  
  /**
   * Scrolls to the top of the page smoothly
   */
  const scrollToTop = useCallback(() => {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      console.error("Error scrolling to top:", error);
      // Fallback to instant scroll if smooth scroll fails
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <SEO
        title="Tomer Goldstein | Full-Stack Developer Portfolio"
        description="Portfolio of Tomer Goldstein, a full-stack developer specializing in React, JavaScript, Java, Spring Boot and modern web technologies."
        keywords="web developer, full-stack developer, frontend, backend, React, JavaScript, TypeScript, Java, Spring Boot, portfolio, Tomer Goldstein"
        author="Tomer Goldstein"
        robots="index, follow"
        ogTitle="Tomer Goldstein | Full-Stack Developer Portfolio"
        ogDescription="Explore my projects and skills as a full-stack developer specializing in modern web technologies."
        ogType="website"
        ogImage="/images/profile.jpg"
        ogUrl="https://tomergoldstein.com"
        twitterCard="summary_large_image"
        twitterTitle="Tomer Goldstein | Developer Portfolio"
        twitterDescription="Full-stack developer building responsive applications with modern technologies"
        twitterImage="/images/profile.jpg"
        canonical="https://tomergoldstein.com"
      />
      
      {/* Scroll Progress Indicator */}
            <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson via-blue-500 to-crimson z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />
      
      {/* Navigation Dots */}
      <nav className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden md:block">
        <ul className="flex flex-col gap-4">
          <li>
            <button 
              onClick={scrollToTop}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                !aboutInView && !techStackInView && !projectsInView 
                  ? "bg-crimson scale-110" 
                  : "bg-muted hover:bg-crimson/50"
              )}
              aria-label="Scroll to top"
            />
          </li>
          <li>
            <button 
              onClick={() => scrollToSection(aboutRef)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                aboutInView ? 'bg-crimson scale-125' : 'bg-muted-foreground/50 hover:scale-125'
              )}
              aria-label="Scroll to About section"
            />
          </li>
          <li>
            <button 
              onClick={() => scrollToSection(techStackRef)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                techStackInView ? 'bg-crimson scale-125' : 'bg-muted-foreground/50 hover:scale-125'
              )}
              aria-label="Scroll to Tech Stack section"
            />
          </li>
          <li>
            <button 
              onClick={() => scrollToSection(projectsRef)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                projectsInView ? 'bg-crimson scale-125' : 'bg-muted-foreground/50 hover:scale-125'
              )}
              aria-label="Scroll to Projects section"
            />
          </li>
        </ul>
      </nav>
      
      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 bg-card shadow-lg border border-border p-3 rounded-full z-50 hover:bg-accent transition-all duration-300"
        onClick={scrollToTop}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: showScrollToTop ? 1 : 0,
          scale: showScrollToTop ? 1 : 0.8,
          pointerEvents: showScrollToTop ? "auto" : "none"
        }}
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="w-5 h-5" />
      </motion.button>
      
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-5rem)] flex flex-col justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating circles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`circle-${i}`}
              className={`absolute rounded-full bg-gradient-to-br ${
                i % 2 === 0 
                  ? 'from-crimson/10 to-transparent' 
                  : 'from-blue-500/10 to-transparent'
              }`}
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                filter: 'blur(40px)',
                opacity: 0.5,
              }}
              animate={{
                x: [0, Math.random() * 40 - 20],
                y: [0, Math.random() * 40 - 20],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: Math.random() * 3 + 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
          
          {/* Animated code particles */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(15)].map((_, i) => (
            <motion.div
                key={`particle-${i}`}
                className="absolute text-xs font-mono text-crimson/80"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, y: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  y: [-20, -120 - Math.random() * 50],
                  scale: [0.8, 1.2, 0.9],
                }}
              transition={{ 
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                  ease: "easeOut",
                }}
              >
                {[
                  '{ }', '</>', '()', '[]', '&&', '||', '=>', '++', '==', '!=', 
                  'function()', 'import', 'export'
                ][Math.floor(Math.random() * 13)]}
            </motion.div>
            ))}
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono"
              >
                <div className="flex items-start mb-4">
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-crimson mr-2"
                  >
                    $
                      </motion.span>
                  <TypedText 
                    text="cat developer.json" 
                    speed={0.04} 
                    className="text-sm"
                  />
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="relative bg-card/80 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-lg shadow-md"
                >
                  <div className="font-mono text-sm sm:text-base md:text-lg lg:text-xl space-y-1 sm:space-y-2">
                    <TypedText 
                      text="{" 
                      startDelay={2.5}
                      speed={0.05} 
                      className="text-crimson block"
                    />
                    
                    <div className="ml-3 sm:ml-4 md:ml-6">
                      <TypedText 
                        text='"name": ' 
                        startDelay={2.8}
                        speed={0.05} 
                        className="text-foreground/70"
                      />
                      <TypedText 
                        text='"Tomer Goldstein",' 
                        startDelay={3.4}
                        speed={0.05} 
                        className="text-crimson"
                      />
                    </div>
                    
                    <div className="ml-3 sm:ml-4 md:ml-6">
                      <TypedText 
                        text='"title": ' 
                        startDelay={4.0}
                        speed={0.05} 
                        className="text-foreground/70"
                      />
                      <TypedText 
                        text='"Full-Stack Developer",' 
                        startDelay={4.6}
                        speed={0.05} 
                        className="text-crimson"
                      />
                    </div>
                    
                    <div className="ml-3 sm:ml-4 md:ml-6">
                      <TypedText 
                        text='"passions": ' 
                        startDelay={5.3}
                        speed={0.05} 
                        className="text-foreground/70"
                      />
                      <span className="block sm:inline">
                        <TypedText 
                          text='["Building responsive apps",' 
                          startDelay={5.9}
                          speed={0.04} 
                          className="text-crimson"
                        />
                      </span>
                      <span className="block ml-4 sm:ml-0 sm:inline">
                        <TypedText 
                          text='"Modern tech", "Clean code"]' 
                          startDelay={6.8}
                          speed={0.04} 
                          className="text-crimson"
                        />
                      </span>
                    </div>
                    
                    <TypedText 
                      text="}" 
                      startDelay={7.8}
                      speed={0.05} 
                      className="text-crimson block"
                    />
                  </div>
                  
                  <div className="absolute -z-10 inset-0 rounded-lg opacity-15 bg-gradient-to-r from-crimson/30 via-crimson/10 to-crimson/30 blur-sm"></div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 8.2, duration: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    asChild 
                    className="group relative overflow-hidden"
                    onClick={() => scrollToSection(aboutRef)}
                  >
                    <RouterLink to="#about">
                      <span className="relative z-10">About Me</span>
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-crimson via-crimson/80 to-crimson pointer-events-none z-0"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </RouterLink>
                </Button>
              </motion.div>
                
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    asChild
                    className="group relative overflow-hidden"
                    onClick={() => scrollToSection(projectsRef)}
                  >
                    <RouterLink to="#projects" className="inline-flex items-center gap-2">
                      <span className="relative z-10">View Projects</span>
                      <motion.span
                        className="absolute inset-0 bg-crimson/10 pointer-events-none z-0 opacity-0"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </RouterLink>
                </Button>
              </motion.div>
            </motion.div>
              
              <motion.div 
                className="flex items-center gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 10, duration: 0.5 }}
              >
                <motion.a 
                  href="https://github.com/Tgoldi" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent"
                  aria-label="GitHub Profile"
                  whileHover={{ y: -5, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <GithubIcon className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  href="https://www.linkedin.com/in/tomergoldi" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-accent"
                  aria-label="LinkedIn Profile"
                  whileHover={{ y: -5, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LinkedinIcon className="h-5 w-5" />
                </motion.a>
            </motion.div>
          </div>

          <motion.div
              className="lg:col-span-2 flex justify-center lg:justify-end order-first lg:order-last"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
              {/* Profile image with spinning border */}
              <div className="relative">
                {/* Spinning blurry border */}
            <motion.div
                  className="absolute -inset-2 rounded-full bg-gradient-to-r from-crimson via-blue-500/50 to-crimson blur-md"
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 10, 
                    repeat: Infinity, 
                    ease: "linear"
                  }}
                />
                
                {/* Second spinning border layer for depth */}
                <motion.div
                  className="absolute -inset-4 rounded-full bg-gradient-to-r from-crimson/40 via-transparent to-crimson/40 blur-lg opacity-60"
                  animate={{ rotate: -360 }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity, 
                    ease: "linear"
                  }}
                />
                
                {/* Profile image */}
                <motion.div 
                  className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-card shadow-xl z-10"
                  animate={{
                    y: [-10, 10],
                    transition: {
                      y: {
                        duration: 3.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }
                    }
                  }}
                >
                  <img 
                    src="/images/profile.jpg" 
                    alt="Tomer Goldstein" 
                    loading="eager" 
                    width="320"
                    height="320"
                    className="w-full h-full object-cover object-[center_20%]"
                  />
                  
                  {/* Animated gradient overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-crimson/30 to-transparent mix-blend-overlay"
                    animate={{ 
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                  />
            </motion.div>
              </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="section py-28 relative">
        {/* Animated background elements */}
          <motion.div
          className="absolute top-20 right-10 w-72 h-72 rounded-full bg-crimson/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
            rotate: 15,
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-blue-500/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.1, 0.2],
            rotate: 45,
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: aboutInView ? 1 : 0, scale: aboutInView ? 1 : 0.95 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16 text-center"
            >
              <h2 className="heading-gradient inline-block mb-2 text-4xl md:text-5xl font-bold relative">
                About Me
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-crimson via-crimson/80 to-crimson/20"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: aboutInView ? 1 : 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </h2>
              <motion.p 
                className="text-muted-foreground max-w-2xl mx-auto mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: aboutInView ? 1 : 0, y: aboutInView ? 0 : 10 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Full-stack developer building responsive applications with modern technologies
              </motion.p>
            </motion.div>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.7,
                    ease: "easeOut"
                  }
                }
              }}
              className="bg-card backdrop-blur-sm bg-opacity-90 border border-border rounded-xl overflow-hidden shadow-xl relative group perspective"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 40px -15px rgba(var(--crimson), 0.3)",
                transition: { duration: 0.3 } 
              }}
              whileInView={{
                y: [20, 0],
                opacity: [0, 1],
                transition: { duration: 0.7 }
              }}
              viewport={{ once: false, amount: 0.3 }}
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-br from-crimson/40 via-transparent to-blue-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Terminal-like header */}
              <div className="bg-muted/80 py-3 px-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
              <motion.div 
                    className="w-3 h-3 rounded-full bg-red-500" 
                    whileHover={{ scale: 1.2 }}
                  />
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-yellow-500" 
                    whileHover={{ scale: 1.2 }}
                  />
                  <motion.div 
                    className="w-3 h-3 rounded-full bg-green-500" 
                    whileHover={{ scale: 1.2 }}
                  />
                    </div>
                <span className="text-xs text-muted-foreground font-mono">tomer-goldstein ~ profile</span>
                <div className="w-16"></div> {/* Spacer for alignment */}
              </div>
              
              <div className="p-8 relative backdrop-blur-sm" style={{ backdropFilter: 'blur(8px)' }}>
                <motion.div 
                  className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-crimson/5 filter blur-3xl group-hover:opacity-70"
                  initial={{ opacity: 0.3 }}
                  whileHover={{ opacity: 0.7 }}
                  transition={{ duration: 1 }}
                />
                
                <div className="relative">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="font-mono text-muted-foreground mb-4 flex items-start"
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-crimson mr-2"
                    >
                      $
                    </motion.span>
                    <TypedText 
                      text="cat profile.json" 
                      speed={0.05} 
                      className="text-sm"
                    />
            </motion.div>

            <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="border border-border/50 rounded-lg bg-background/50 p-6 shadow-inner hover:shadow-lg transition-all duration-300"
              whileHover={{ 
                      scale: 1.01,
                      boxShadow: "0 0 20px rgba(var(--card-shadow), 0.3)"
                    }}
                  >
                    <div className="prose prose-lg dark:prose-invert prose-code:text-crimson prose-headings:text-crimson">
                      <TypedText 
                        text="Junior Full-stack developer with hands-on experience in Java, JavaScript, React, Spring Boot, and SQL." 
                        startDelay={1.8}
                        className="block mb-4 leading-relaxed"
                      />
                      
                      <TypedText 
                        text="Skilled in building responsive web applications and working with modern development tools." 
                        startDelay={5}
                        className="block mb-4 leading-relaxed"
                      />
                      
                      <TypedText 
                        text="Driven to grow, create meaningful products, and contribute as a dedicated, collaborative team member." 
                        startDelay={8}
                        className="block mb-4 leading-relaxed"
                      />
                    </div>
                  </motion.div>
                  
              <motion.div 
                    className="mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 11, duration: 0.7 }}
                  >
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 11.2, duration: 0.5 }}
                      className="font-mono text-muted-foreground mb-4 flex items-start"
                    >
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-crimson mr-2"
                      >
                        $
                      </motion.span>
                      <TypedText 
                        text="ls skills/" 
                        speed={0.05} 
                        startDelay={11.5}
                        className="text-sm"
                />
              </motion.div>
                    
                    <div className="flex flex-wrap gap-3">
                      {['Java', 'JavaScript', 'React', 'Spring Boot', 'SQL', 'Responsive Design'].map((skill, i) => (
                        <motion.span 
                          key={skill}
                          className="bg-muted/80 text-muted-foreground px-3 py-1 rounded-md text-sm font-mono border border-border/50 hover:border-crimson/40 relative group/skill"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 12 + (i * 0.3), duration: 0.4 }}
                          whileHover={{ 
                            scale: 1.05, 
                            backgroundColor: 'var(--crimson)',
                            color: 'var(--crimson-foreground)',
                            boxShadow: '0 0 15px rgba(var(--crimson), 0.3)'
                          }}
                        >
                          {skill}
                          <motion.span 
                            className="absolute inset-0 bg-crimson/10 rounded-md"
                            initial={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" ref={techStackRef} className="section bg-card py-28 relative overflow-hidden">
        {/* Abstract 3D elements - visible in both light/dark themes */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60 z-0">
          <motion.div 
            className="w-full max-w-4xl h-64 rounded-full bg-gradient-to-tr from-crimson/10 via-transparent to-blue-500/10 blur-3xl transform scale-150"
            animate={{
              rotate: 360,
              scale: [1.5, 1.7, 1.5],
              opacity: [0.6, 0.7, 0.6]
            }}
            transition={{
              rotate: {
                duration: 40,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              },
              opacity: {
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
          />
        </div>
        
        <div className="container-custom relative z-10">
            <motion.div
            initial="hidden"
            animate={techStackInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
            className="text-center mb-16"
          >
            <motion.p 
              className="text-muted-foreground text-sm uppercase tracking-widest mb-2 opacity-0"
              initial={{ opacity: 0, y: 20 }}
              animate={techStackInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <TypedText 
                text="I CONSTANTLY TRY TO IMPROVE"
                startDelay={0.3}
                speed={0.02}
                className="inline-block"
              />
            </motion.p>
            <motion.h2 
              className="heading-gradient text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={techStackInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              My Tech Stack
            </motion.h2>
              <motion.div
                className="h-1 w-20 bg-gradient-to-r from-crimson to-blue-500/50 rounded-full mx-auto mt-6"
                initial={{ scale: 0 }}
                animate={techStackInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              />
              </motion.div>
          
                  <motion.div 
            variants={staggerContainerVariants}
            initial="hidden"
            animate={techStackInView ? "visible" : "hidden"}
            className="flex flex-col items-center justify-center gap-12"
          >
            {/* FRONTEND SECTION */}
            <div className="w-full max-w-4xl">
              <h3 className="text-xl font-semibold mb-4 text-center">
                <span className="text-crimson">Front-End</span> Technologies
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { name: "React", icon: "/tech/react.svg" },
                  { name: "JavaScript", icon: "/tech/javascript.svg" },
                  { name: "HTML", icon: "/tech/html.svg" },
                  { name: "CSS", icon: "/tech/css.svg" },
                  { name: "Material-UI", icon: "/tech/material-ui.svg" },
                  { name: "TypeScript", icon: "/tech/typescript.svg" },
                  { name: "Tailwind CSS", icon: "/tech/tailwind.svg" },
                  { name: "Bootstrap", icon: "/tech/bootstrap.svg" },
                  { name: "Shadcn", icon: "/tech/shadcn.svg" },
                  { name: "Responsive Design", icon: "/tech/responsive.svg" },
                ].map((tech, idx) => (
                  <TechPill 
                    key={tech.name} 
                    tech={tech.name} 
                    custom={idx} 
                    variants={techIconVariants} 
                  />
                ))}
                    </div>
            </div>
            
            {/* BACKEND SECTION */}
            <div className="w-full max-w-4xl">
              <h3 className="text-xl font-semibold mb-4 text-center">
                <span className="text-crimson">Back-End</span> Technologies
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { name: "Java", icon: "/tech/java.svg" },
                  { name: "Spring Boot", icon: "/tech/spring-boot.svg" },
                  { name: "RESTful APIs", icon: "/tech/api.svg" },
                  { name: "PostgreSQL", icon: "/tech/postgresql.svg" },
                  { name: "Node.js", icon: "/tech/node.svg" },
                  { name: "Express.js", icon: "/tech/express.svg" },
                  { name: "H2 Database", icon: "/tech/database.svg" },
                  { name: "MVC Architecture", icon: "/tech/mvc.svg" },
                  { name: "Supabase", icon: "/tech/supabase.svg" },
                  { name: "Django", icon: "/tech/django.svg" },
                ].map((tech, idx) => (
                  <TechPill 
                    key={tech.name} 
                    tech={tech.name} 
                    custom={idx + 8} 
                    variants={techIconVariants} 
                  />
                ))}
              </div>
            </div>
            
            {/* TOOLS SECTION */}
            <div className="w-full max-w-4xl">
              <h3 className="text-xl font-semibold mb-4 text-center">
                <span className="text-crimson">Tools</span> & Utilities
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { name: "Git", icon: "/tech/git.svg" },
                  { name: "GitHub", icon: "/tech/github.svg", darkModeInvert: true },
                  { name: "Postman", icon: "/tech/postman.svg" },
                  { name: "IntelliJ", icon: "/tech/intellij.svg" },
                  { name: "VS Code", icon: "/tech/vscode.svg" },
                  { name: "Docker", icon: "/tech/docker.svg" },
                ].map((tech, idx) => (
                  <TechPill 
                    key={tech.name} 
                    tech={tech.name} 
                    custom={idx + 16} 
                    variants={techIconVariants} 
                  />
                ))}
              </div>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section id="projects" ref={projectsRef} className="section">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
            variants={fadeInUpVariants}
            className="text-center mb-12"
          >
            <h2 className="heading-gradient mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              <TypedText 
                text="Some of my recent work showcasing my skills and expertise"
                startDelay={0.3}
                speed={0.02}
                className="inline-block"
              />
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={projectsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="bg-card backdrop-blur-sm bg-opacity-90 border border-border rounded-xl overflow-hidden shadow-md relative group mb-10"
            whileHover={{ 
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(var(--card-shadow), 0.3)"
            }}
          >
            {/* Terminal-like header */}
            <div className="bg-muted/80 py-2 px-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">projects/featured</span>
              <div className="w-12"></div> {/* Spacer for alignment */}
            </div>
            
            <div className="p-4">
              <div className="font-mono text-muted-foreground mb-3 flex items-start">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-crimson mr-2"
                >
                  $
                </motion.span>
                <TypedText 
                  text="find . -name 'projects' -type d | xargs ls -la"
                  speed={0.03} 
                  startDelay={1.2}
                  className="text-sm"
                />
              </div>
            </div>
          </motion.div>
          
            <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate={projectsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {projectsData.slice(0, 3).map((project, idx) => (
              <motion.div 
                key={project.title}
                variants={fadeInUpVariants}
                custom={idx + 1}
                className="group/project perspective"
                whileHover={{ 
                  rotateY: 5,
                  rotateX: -5,
                  z: 10,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="card-gradient rounded-xl overflow-hidden border border-border bg-card transition-all duration-300 group-hover/project:shadow-xl group-hover/project:border-crimson/30 transform-gpu relative">
                  <div 
                    className="h-48 bg-accent relative overflow-hidden"
                  >
                    {/* Project Image */}
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/project:scale-110"
                      />
                    )}
                    
                    {/* Overlay gradient */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
                      initial={{ opacity: 0.5 }}
                      whileHover={{ 
                        opacity: 0.3,
                        transition: { duration: 0.7 }
                      }}
                    />
                    
                    {/* Terminal mini-header */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 opacity-60 group-hover/project:opacity-90 transition-opacity duration-300">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    
                    {/* Project period */}
                    <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono border border-border/50 group-hover/project:border-crimson/30 transition-all duration-300 group-hover/project:shadow-lg">
                      {project.period}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover/project:text-crimson transition-colors font-mono flex items-center">
                      <span className="text-crimson/70 mr-2 group-hover/project:text-crimson">$</span>
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3 group-hover/project:text-foreground transition-colors duration-300">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, i) => (
                      <motion.span
                          key={i} 
                          className="px-2 py-1 bg-accent rounded-md text-xs font-mono relative overflow-hidden group/tag"
                          whileHover={{
                            y: -3,
                            x: 3,
                            backgroundColor: 'var(--crimson)',
                            color: 'var(--crimson-foreground)',
                            transition: { type: "spring", stiffness: 300, damping: 10 }
                          }}
                        >
                          {tag}
                          <motion.span 
                            className="absolute inset-0 bg-gradient-to-r from-crimson/20 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.5 }}
                          />
                      </motion.span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {project.github && (
                        <Button variant="outline" size="sm" asChild className="p-0 h-auto text-foreground font-mono group/button relative overflow-hidden">
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1">
                            <span className="text-crimson">git</span> clone
                            <ArrowRightIcon className="w-3 h-3 transition-transform group-hover/button:translate-x-1" />
                            <motion.span 
                              className="absolute inset-0 bg-crimson/10"
                              initial={{ scale: 0, opacity: 0 }}
                              whileHover={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          </a>
                </Button>
                      )}
                      <Button variant="link" asChild className="p-0 h-auto text-crimson font-mono group/button">
                        <RouterLink to="/projects" className="flex items-center gap-1">
                          <span>cd</span> ./details
                          <ArrowRightIcon className="w-3 h-3 transition-transform group-hover/button:translate-x-1" />
                        </RouterLink>
                      </Button>
                    </div>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-crimson/5 to-transparent opacity-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
            </motion.div>
          
          <motion.div 
            variants={fadeInUpVariants}
            custom={4}
            className="mt-12 text-center"
          >
            <Button asChild size="lg" className="group font-mono relative overflow-hidden">
              <RouterLink to="/projects" className="inline-flex items-center gap-2">
                <span className="text-muted-foreground mr-1">$</span> 
                cd ./all-projects
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <motion.span 
                  className="absolute inset-0 bg-crimson/10 pointer-events-none"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.5, opacity: 0.2 }}
                  transition={{ duration: 0.5 }}
                />
              </RouterLink>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default memo(HomePage);
