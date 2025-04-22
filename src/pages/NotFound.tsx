import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Animated code particles
  const codeParticles = [
    '404', 'Page', 'Not', 'Found', '{ }', '</>', 'undefined', 'null',
    'error', 'missing', 'route', 'broken', 'link', '(╯°□°)╯︵ ┻━┻', '?!', '???'
  ];

  return (
    <>
      <SEO
        title="Page Not Found | Tomer Goldstein"
        description="The page you are looking for doesn't exist. Navigate back to Tomer Goldstein's portfolio."
        noIndex={true}
      />

      <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        {/* Background particles animation */}
        <div className="fixed inset-0 opacity-10 pointer-events-none">
          {codeParticles.map((text, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute text-sm md:text-base font-mono text-crimson"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                y: [-20, -120 - Math.random() * 50],
                scale: [0.8, 1.2, 0.9],
                rotate: [0, Math.random() * 20 - 10],
              }}
              transition={{ 
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "easeOut",
              }}
            >
              {text}
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center max-w-xl p-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 flex justify-center"
          >
            <motion.div 
              className="w-16 h-16 md:w-20 md:h-20 bg-crimson/10 rounded-full flex items-center justify-center"
              animate={{ 
                boxShadow: ['0 0 0 0 rgba(var(--crimson), 0.2)', '0 0 0 20px rgba(var(--crimson), 0)'],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                repeatType: "loop" as const
              }}
            >
              <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-crimson" />
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-4 text-foreground relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="text-crimson">4</span>
            <motion.span
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              className="inline-block"
            >
              0
            </motion.span>
            <span className="text-crimson">4</span>
          </motion.h1>

          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Oops! The page you're looking for doesn't exist or has been moved.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button 
              asChild 
              className="bg-crimson hover:bg-crimson/90 group"
              variant="default"
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Return to Home
              </Link>
            </Button>

            <Button 
              asChild 
              variant="outline"
              className="group"
            >
              <Link 
                to="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Go Back
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 text-muted-foreground/60 text-sm font-mono"
          >
            <code>{location.pathname}</code>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
