import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

interface LoadingScreenProps {
    isLoading: boolean;
}

const LoadingScreen = ({ isLoading }: LoadingScreenProps) => {
    const [isAnimating, setIsAnimating] = useState(true);
    const [progress, setProgress] = useState(0);

    // Simulate loading progress
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (isLoading) {
            // Start at current progress and move to 90% (save 10% for actual content load)
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev < 90) {
                        // Gradually slow down as we approach 90%
                        const increment = Math.max(0.5, 10 * (1 - prev / 100));
                        return Math.min(90, prev + increment);
                    }
                    return prev;
                });
            }, 100);
        } else {
            // Jump to 100% when actual loading is complete
            setProgress(100);
        }
        
        return () => clearInterval(interval);
    }, [isLoading]);

    // Handle exit animation
    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    // Code symbol animation variants
    const containerVariants = {
        loading: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.1,
                staggerDirection: -1,
                when: "afterChildren",
            },
        },
    };

    // Left bracket animation (comes from left)
    const leftBracketVariants = {
        initial: { 
            opacity: 0, 
            x: -100,
            scale: 0.5
        },
        loading: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
            }
        },
        exit: {
            opacity: 0,
            x: -50,
            transition: {
                duration: 0.4,
            },
        },
    };

    // Right bracket animation (comes from right)
    const rightBracketVariants = {
        initial: { 
            opacity: 0, 
            x: 100,
            scale: 0.5
        },
        loading: { 
            opacity: 1, 
            x: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
            }
        },
        exit: {
            opacity: 0,
            x: 50,
            transition: {
                duration: 0.4,
            },
        },
    };

    // Slash animation (appears after brackets and slashes through)
    const slashVariants = {
        initial: { 
            opacity: 0, 
            y: -50,
            scale: 0,
            rotate: -45
        },
        loading: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            rotate: 0,
            transition: {
                delay: 0.8, // Reduce delay for faster appearance
                duration: 0.5,
                type: "spring",
                stiffness: 200,
                damping: 15
            }
        },
        exit: {
            opacity: 0,
            y: 30,
            transition: {
                duration: 0.3,
            },
        },
    };

    const pulseVariants = {
        initial: { scale: 1, opacity: 0.7 },
        pulse: {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    // If not loading and animation finished, don't render anything
    if (!isLoading && !isAnimating) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            animate={{ opacity: isLoading ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div
                className="relative flex items-center"
                variants={containerVariants}
                initial="initial"
                animate={isLoading ? "loading" : "exit"}
            >
                {/* Background pulse effect */}
                <motion.div
                    className="absolute -inset-20 rounded-full bg-crimson/10 blur-3xl"
                    variants={pulseVariants}
                    initial="initial"
                    animate="pulse"
                />

                {/* Code symbols */}
                <motion.div
                    variants={leftBracketVariants}
                    className="text-7xl md:text-8xl font-bold text-crimson"
                >
                    &lt;
                </motion.div>

                <motion.div
                    variants={slashVariants}
                    className="text-7xl md:text-8xl font-bold text-foreground mx-1"
                >
                    /
                </motion.div>

                <motion.div
                    variants={rightBracketVariants}
                    className="text-7xl md:text-8xl font-bold text-crimson"
                >
                    &gt;
                </motion.div>
            </motion.div>

            {/* Progress bar */}
            <motion.div 
                className="w-64 h-1 bg-muted mt-10 rounded-full overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <motion.div 
                    className="h-full bg-gradient-to-r from-crimson to-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>

            {/* Code effect particles */}
            <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute text-xs font-mono text-crimson"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        initial={{ opacity: 0, y: 0, scale: 0.8 }}
                        animate={{ 
                            opacity: [0, 0.8, 0],
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
                        {[
                            '{ }', '</>', '()', '[]', '&&', '||', '=>', '++', '==', '!=', 
                            'const', '.then()', '.map()', 'import', 'React'
                        ][Math.floor(Math.random() * 15)]}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default LoadingScreen; 