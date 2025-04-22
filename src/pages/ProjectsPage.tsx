import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, X, Github, ExternalLink, Search, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useCallback, useMemo } from "react";
import { projectsData, Project } from "@/data/projectsData";
import { SEO } from "@/components/SEO";

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Constants
const PARTICLE_COUNT = 15;

/**
 * ProjectsPage Component
 * Displays a responsive grid of projects with animations and interactive elements
 */
const ProjectsPage = () => {
  const [viewImage, setViewImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle opening the full-screen image viewer
  const handleImageClick = useCallback((imagePath: string) => {
    setViewImage(imagePath);
  }, []);

  // Handle closing the full-screen image viewer
  const handleCloseViewer = useCallback(() => {
    setViewImage(null);
  }, []);

  // Generate background particles with memoization to avoid recalculation
  const particles = useMemo(() => 
    Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 2
    })), 
  []);

  return (
    <>
      <SEO
        title="Projects Portfolio | Tomer Goldstein"
        description="Explore Tomer Goldstein's portfolio of full-stack development projects showcasing expertise in React, Java, Spring Boot, and modern web technologies."
        keywords="portfolio, projects, web development, full-stack, React, Java, Spring Boot, JavaScript, TypeScript, Tomer Goldstein"
        ogTitle="Projects Portfolio | Tomer Goldstein"
        ogDescription="Browse my collection of full-stack development projects showcasing my skills and experience."
        ogType="website"
        robots="index, follow"
      />

      {/* Background particles animation */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        aria-hidden="true"
      >
        {particles.map((particle) => (
          <motion.div 
            key={particle.id}
            className="absolute rounded-full bg-crimson/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              filter: 'blur(2px)',
            }}
            animate={{
              x: [0, Math.random() * 30 - 15, 0],
              y: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content section */}
      <section className="py-20 relative">
        <div className="container-custom" ref={containerRef}>
          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 relative inline-block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              My <span className="text-crimson relative">
                Projects
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-crimson via-crimson/80 to-crimson/20"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                />
              </span>
              <motion.span
                className="absolute -z-10 -inset-x-10 inset-y-0 opacity-5 blur-xl text-crimson"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                aria-hidden="true"
              >
                Projects
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              A showcase of my technical expertise and development experience across various platforms.
            </motion.p>
          </motion.div>

          {/* Projects grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8"
          >
            {projectsData.map((project, index) => (
              <ProjectCard 
                key={`project-${index}`}
                project={project}
                index={index}
                onImageClick={handleImageClick}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="section bg-muted/30 py-20">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 relative inline-block">
              Want to See More?
              <motion.span 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-crimson/80 via-crimson/50 to-crimson/5"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </h2>
            <p className="text-muted-foreground mb-8">
              Check out my GitHub for more projects and code samples.
            </p>
            <Button
              asChild
              className="bg-crimson hover:bg-crimson/90 group/github relative overflow-hidden"
            >
              <a
                href="https://github.com/Tgoldi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
                aria-label="View my GitHub profile"
              >
                <Github className="w-5 h-5 transition-transform group-hover/github:scale-110" />
                View My GitHub
                <ArrowRight className="h-4 w-4 transition-transform group-hover/github:translate-x-1" />
                <motion.span 
                  className="absolute inset-0 bg-white/10 pointer-events-none"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  aria-hidden="true"
                />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Full-screen image viewer with enhanced animations */}
      <FullScreenImageViewer 
        image={viewImage} 
        onClose={handleCloseViewer} 
      />
    </>
  );
};

/**
 * ProjectCard Component
 * Displays a single project card with hover effects and interactive elements
 */
interface ProjectCardProps {
  project: Project;
  index: number;
  onImageClick: (imagePath: string) => void;
}

const ProjectCard = ({ project, index, onImageClick }: ProjectCardProps) => {
  return (
    <motion.div
      variants={fadeInUp}
      custom={index}
      whileHover={{ 
        y: -10,
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 10 
        } 
      }}
      className="group bg-card border rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col relative transform perspective-1000"
    >
      {/* Project image with hover effect */}
      <div className="absolute inset-x-0 top-0 h-[75%] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 overflow-hidden">
        {project.image && (
          <div 
            className="w-full h-full relative cursor-pointer group/image" 
            onClick={() => onImageClick(project.image)}
            onKeyDown={(e) => e.key === 'Enter' && onImageClick(project.image)}
            tabIndex={0}
            role="button"
            aria-label={`View ${project.title} image fullscreen`}
          >
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className="w-full h-full object-cover rounded-t-md transform group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent"></div>
            
            {/* View fullscreen indicator */}
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-crimson/20 backdrop-blur-md rounded-full p-2 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="w-6 h-6 text-white" aria-hidden="true" />
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Project details */}
      <div className="p-4 md:p-6 flex flex-col flex-grow relative z-0">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4 group-hover:opacity-30 transition-opacity duration-300">
          <motion.h3 
            className="text-xl md:text-2xl font-bold"
            whileHover={{ color: "rgba(var(--crimson), 1)" }}
          >
            {project.title}
          </motion.h3>
          <Badge variant="outline" className="text-xs whitespace-nowrap bg-card/80 backdrop-blur-sm border-border/50">
            {project.period}
          </Badge>
        </div>
        <p className="text-muted-foreground mb-6 flex-grow group-hover:opacity-30 transition-opacity duration-300">
          {project.description}
        </p>
        
        {/* Project links */}
        <div className="flex flex-wrap gap-3 relative z-20">
          {project.github && (
            <ProjectLink 
              href={project.github}
              variant="outline"
              icon={<Github className="h-4 w-4 group-hover/btn:text-crimson transition-colors" />}
              label="Code"
            />
          )}
          {project.link && (
            <ProjectLink 
              href={project.link}
              variant="default"
              icon={<ExternalLink className="h-4 w-4" />}
              label="Demo"
              isPrimary
            />
          )}
        </div>
      </div>

      {/* Enhanced hover state effects */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tr from-crimson/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        aria-hidden="true"
      />

      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson/0 via-crimson/50 to-crimson/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />
    </motion.div>
  );
};

/**
 * ProjectLink Component
 * Renders a button link for project GitHub or demo links
 */
interface ProjectLinkProps {
  href: string;
  variant: "outline" | "default";
  icon: React.ReactNode;
  label: string;
  isPrimary?: boolean;
}

const ProjectLink = ({ href, variant, icon, label, isPrimary }: ProjectLinkProps) => {
  return (
    <Button
      asChild
      variant={variant}
      size="sm"
      className={`gap-1 relative z-20 backdrop-blur-sm group/btn
        ${isPrimary 
          ? 'bg-crimson hover:bg-crimson/90'
          : 'bg-card/90 border-card/50 hover:border-crimson/30 hover:bg-card/95'
        }`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
        aria-label={`${label} for ${label === 'Code' ? 'source code' : 'live demo'}`}
      >
        {icon}
        {label}
        <motion.span
          initial={{ width: 0, opacity: 0 }}
          whileHover={{ width: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden flex"
        >
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </motion.span>
      </a>
    </Button>
  );
};

/**
 * FullScreenImageViewer Component
 * Displays a full-screen image viewer with animations and close functionality
 */
interface FullScreenImageViewerProps {
  image: string | null;
  onClose: () => void;
}

const FullScreenImageViewer = ({ image, onClose }: FullScreenImageViewerProps) => {
  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative max-w-6xl max-h-screen"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative rounded-lg overflow-hidden shadow-2xl"
          >
            <img
              src={image}
              alt="Project preview"
              className="max-h-[90vh] max-w-full object-contain rounded-md"
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              aria-hidden="true"
            />
          </motion.div>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-black/40 text-white hover:bg-black/60 z-10"
            onClick={onClose}
            aria-label="Close image viewer"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-sm backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full border border-white/10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link2 className="w-3 h-3 inline mr-1 opacity-70" aria-hidden="true" /> Click anywhere to close
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectsPage;
