import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect } from "react";
import { BriefcaseIcon, GraduationCapIcon, AwardIcon, ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import { useInView } from "framer-motion";
import { SEO } from "@/components/SEO";

const experienceData = [
  {
    position: "Freelancer",
    company: "",
    location: "",
    period: "October 2024 - Present",
    description: [
      "Developed full-stack web applications with React frontend and Java Spring Boot backend.",
      "Designed and consumed RESTful APIs to support interactive user experiences.",
      "Ensured responsive design, accessibility compliance, and cross-browser compatibility.",
      "Used Git for version control and collaborated using Agile methodologies."
    ],
    tags: ["React", "Spring Boot", "RESTful APIs", "Responsive Design", "Git"]
  },
  {
    position: "Head of Development Team",
    company: "IDF",
    location: "Israel",
    period: "March 2020 - August 2022",
    description: [
      "Led the design and development of training systems using modern technologies.",
      "Created interactive training programs and optimized content for user engagement.",
      "Maintained high-quality standards through ongoing updates and feedback."
    ],
    tags: ["Team Leadership", "Training Systems", "Content Optimization", "User Engagement"]
  }
];

const educationData = [
  {
    degree: "Full Stack Developer",
    institution: "Ecom",
    location: "Israel",
    year: "2024",
    description: "Focus on Java, Spring Boot, React, REST APIs, SQL, HTML/CSS, Node.js",
    score: "100"
  }
];

const certificationData = [
  {
    name: "The Complete 2024 Web Development Bootcamp",
    provider: "Udemy",
    year: "2024",
    description: "Built full-stack projects using HTML, CSS, JavaScript, Node.js, Express, PostgreSQL, and React. Strengthened both front-end and back-end development skills."
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const ExperiencePage = () => {
  // Reference to the scrollable container
  const containerRef = useRef(null);
  
  // Get scroll progress for animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform scroll progress to road path drawing
  const roadPathProgress = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  
  // Animated background gradient
  const backgroundX = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.3, 0.3, 0]);

  // Moving particles for enhanced background effect
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 2
  }));

  return (
    <>
      <SEO
        title="Professional Experience | Tomer Goldstein"
        description="Explore Tomer Goldstein's professional journey, work experience, education, and certifications in full-stack development."
        keywords="experience, work history, education, certifications, full-stack developer, Tomer Goldstein, React, Java, Spring Boot"
        ogTitle="Professional Experience | Tomer Goldstein"
        ogDescription="View my professional journey, work experience and qualifications as a Full-Stack Developer."
        ogType="website"
        robots="index, follow"
      />

      {/* Animated background elements */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ 
          opacity: backgroundOpacity,
          x: backgroundX,
          y: backgroundY
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-crimson/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-blue-500/10 blur-[80px]" />
        
        {/* Moving particles */}
        {particles.map((particle) => (
          <motion.div 
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-crimson/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              filter: 'blur(4px)',
            }}
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
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
      </motion.div>

      <section className="py-20 relative">
        <div className="container-custom" ref={containerRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              My <span className="text-crimson relative inline-block group">
                Experience
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-crimson via-crimson/80 to-crimson/20"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                />
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-crimson/40 blur-[2px]"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                />
              </span>
              <motion.span
                className="absolute -z-10 opacity-5 blur-3xl text-crimson"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                Experience
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              My professional journey and qualifications as a Full-Stack Developer.
            </motion.p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Road animation SVG - adjusted positioning for better responsive design */}
            <div className="absolute left-0 top-8 bottom-0 w-12 hidden md:block">
              <svg 
                className="h-full w-full" 
                viewBox="0 0 50 1000" 
                fill="none" 
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Dashed background curved line */}
                <motion.path
                  d="M10 0C25 150 25 180 10 250C-5 320 -5 350 10 420C25 490 25 520 10 590C-5 660 -5 690 10 760C25 830 25 860 10 930C-5 1000 10 1000 10 1000"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  className="opacity-50"
                  fill="none"
                />
                {/* Animated foreground curved line */}
                <motion.path
                  d="M10 0C25 150 25 180 10 250C-5 320 -5 350 10 420C25 490 25 520 10 590C-5 660 -5 690 10 760C25 830 25 860 10 930C-5 1000 10 1000 10 1000"
                  stroke="hsl(var(--crimson))"
                  strokeWidth="3"
                  strokeDasharray="1800"
                  strokeDashoffset="1800"
                  style={{ strokeDashoffset: useTransform(roadPathProgress, (v) => 1800 - v * 1800) }}
                  fill="none"
                />
                {/* Glowing effect on the curved path */}
                <motion.path
                  d="M10 0C25 150 25 180 10 250C-5 320 -5 350 10 420C25 490 25 520 10 590C-5 660 -5 690 10 760C25 830 25 860 10 930C-5 1000 10 1000 10 1000"
                  stroke="hsl(var(--crimson))"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="1800"
                  strokeDashoffset="1800"
                  style={{ 
                    strokeDashoffset: useTransform(roadPathProgress, (v) => 1800 - v * 1800),
                    opacity: 0.2,
                    filter: "blur(4px)"
                  }}
                  fill="none"
                />
                
                {/* Small animated particles along the path */}
                <motion.circle 
                  cx="10" 
                  cy="0" 
                  r="3" 
                  fill="hsl(var(--crimson))"
                  style={{ 
                    pathLength: 1,
                    pathOffset: useTransform(roadPathProgress, [0, 1], [0, 0.97]),
                    opacity: useTransform(roadPathProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]),
                  }}
                >
                  <animateMotion
                    dur="10s"
                    repeatCount="indefinite"
                    path="M10 0C25 150 25 180 10 250C-5 320 -5 350 10 420C25 490 25 520 10 590C-5 660 -5 690 10 760C25 830 25 860 10 930C-5 1000 10 1000 10 1000"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                  />
                </motion.circle>
              </svg>
            </div>

            <motion.h2 
              className="text-2xl font-bold mb-6 flex items-center md:pl-16"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="mr-2 text-crimson flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5" />
                <span className="relative">
                  Work Experience
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-crimson/30"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </span>
              </span>
              <div className="flex-1 h-px bg-border ml-4">
                <motion.div 
                  className="h-full bg-crimson"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.h2>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12 mb-16 relative"
            >
              {experienceData.map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="relative md:pl-16"
                >
                  {/* Road marker dot with pulse effect - adjusted positioning for curved path */}
                  <motion.div 
                    className="hidden md:flex absolute left-6 top-8 w-8 h-8 rounded-full bg-card border-2 border-crimson -translate-x-1/2 -translate-y-1/2 shadow-lg z-10 items-center justify-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                  >
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-crimson flex items-center justify-center text-white"
                      animate={{ 
                        boxShadow: ['0 0 0 0 rgba(var(--crimson), 0.3)', '0 0 0 10px rgba(var(--crimson), 0)'],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      <span className="text-xs font-bold">{index + 1}</span>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="perspective transform-gpu"
                  >
                    <Card className="border-border/70 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-crimson/30 overflow-hidden group">
                      <CardHeader className="pb-4 relative overflow-hidden">
                        {/* Glowing hover effect */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-crimson/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                            <CardTitle className="text-xl font-bold group-hover:text-crimson transition-colors duration-300 flex items-center gap-1">
                              {item.position}
                              <motion.span 
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="text-crimson inline-flex"
                              >
                                <ChevronRightIcon className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </motion.span>
                            </CardTitle>
                          <CardDescription className="text-base">
                            {item.company} {item.company && item.location && '•'} {item.location}
                          </CardDescription>
                        </div>
                          <Badge variant="outline" className="md:text-xs whitespace-nowrap bg-card shadow-sm group-hover:border-crimson/30 transition-colors duration-300">
                          {item.period}
                        </Badge>
                      </div>
                    </CardHeader>
                      <CardContent className="relative">
                        <ul className="space-y-2 mb-4">
                          {item.description.map((desc, idx) => (
                            <motion.li 
                              key={idx} 
                              className="flex items-start gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ delay: 0.1 * idx, duration: 0.5 }}
                            >
                              <span className="text-crimson mt-1.5">•</span>
                              <span>{desc}</span>
                            </motion.li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, i) => (
                            <motion.div
                              key={i}
                              whileHover={{ 
                                y: -5, 
                                scale: 1.05,
                                transition: { type: "spring", stiffness: 300, damping: 10 } 
                              }}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-50px" }}
                              transition={{ delay: 0.3 + (i * 0.05), duration: 0.4 }}
                            >
                              <Badge variant="secondary" className="bg-secondary/50 backdrop-blur-sm hover:bg-crimson hover:text-white transition-colors duration-300 cursor-default">
                            {tag}
                          </Badge>
                            </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            <motion.h2 
              className="text-2xl font-bold mb-6 flex items-center md:pl-16"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="mr-2 text-crimson flex items-center gap-2">
                <GraduationCapIcon className="w-5 h-5" />
                <span className="relative">
                  Education
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-crimson/30"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 0.8 }}
                  />
                </span>
              </span>
              <div className="flex-1 h-px bg-border ml-4">
                <motion.div 
                  className="h-full bg-crimson"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
            </div>
            </motion.h2>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12 mb-16 relative"
            >
              {educationData.map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="relative md:pl-16"
                >
                  {/* Road marker dot with pulse effect */}
                  <motion.div 
                    className="hidden md:flex absolute left-6 top-8 w-8 h-8 rounded-full bg-card border-2 border-crimson -translate-x-1/2 -translate-y-1/2 shadow-lg z-10 items-center justify-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                  >
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-crimson flex items-center justify-center text-white"
                      animate={{ 
                        boxShadow: ['0 0 0 0 rgba(var(--crimson), 0.3)', '0 0 0 10px rgba(var(--crimson), 0)'],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      <span className="text-xs font-bold">{educationData.length - index}</span>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="perspective transform-gpu"
                  >
                    <Card className="border-border/70 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-crimson/30 overflow-hidden group">
                      <CardHeader className="pb-4 relative">
                        {/* Glowing hover effect */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-crimson/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                            <CardTitle className="text-xl font-bold group-hover:text-crimson transition-colors duration-300">
                              {item.degree}
                            </CardTitle>
                          <CardDescription className="text-base">
                            {item.institution} {item.institution && item.location && '•'} {item.location}
                          </CardDescription>
                        </div>
                          <Badge variant="outline" className="md:text-xs whitespace-nowrap bg-card shadow-sm group-hover:border-crimson/30 transition-colors duration-300">
                            {item.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">{item.description}</p>
                        {item.score && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Score:</span>
                            <span className="font-semibold text-crimson">{item.score}</span>
                          </div>
                        )}
                    </CardContent>
                  </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            <motion.h2 
              className="text-2xl font-bold mb-6 flex items-center md:pl-16"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className="mr-2 text-crimson flex items-center gap-2">
                <AwardIcon className="w-5 h-5" />
                <span className="relative">
                  Certifications
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-crimson/30"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  />
                </span>
              </span>
              <div className="flex-1 h-px bg-border ml-4">
                <motion.div 
                  className="h-full bg-crimson"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.9 }}
                />
            </div>
            </motion.h2>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12 relative"
            >
              {certificationData.map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="relative md:pl-16"
                >
                  {/* Road marker dot with pulse effect */}
                  <motion.div 
                    className="hidden md:flex absolute left-6 top-8 w-8 h-8 rounded-full bg-card border-2 border-crimson -translate-x-1/2 -translate-y-1/2 shadow-lg z-10 items-center justify-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                  >
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-crimson flex items-center justify-center text-white"
                      animate={{ 
                        boxShadow: ['0 0 0 0 rgba(var(--crimson), 0.3)', '0 0 0 10px rgba(var(--crimson), 0)'],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    >
                      <span className="text-xs font-bold">{certificationData.length - index}</span>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="perspective transform-gpu"
                  >
                    <Card className="border-border/70 shadow-sm hover:shadow-xl transition-all duration-500 hover:border-crimson/30 overflow-hidden group">
                      <CardHeader className="pb-4 relative">
                        {/* Glowing hover effect */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-crimson/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                            <CardTitle className="text-xl font-bold group-hover:text-crimson transition-colors duration-300">
                              {item.name}
                            </CardTitle>
                            <CardDescription className="text-base">
                              {item.provider}
                            </CardDescription>
                        </div>
                          <Badge variant="outline" className="md:text-xs whitespace-nowrap bg-card shadow-sm group-hover:border-crimson/30 transition-colors duration-300">
                          {item.year}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                        <p>{item.description}</p>
                    </CardContent>
                  </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExperiencePage;
