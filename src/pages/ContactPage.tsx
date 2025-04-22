import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { SEO } from "@/components/SEO";
import { Mail, Linkedin, Github, Send, ArrowRight, MessageSquare } from "lucide-react";
import emailjs from 'emailjs-com';
import { z } from "zod";

// Define form schema with Zod for type-safe validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" })
});

// Type for form data based on schema
type FormData = z.infer<typeof formSchema>;

// Form submission state
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

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

const pulseAnimation = {
  scale: [1, 1.03, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as const
  }
};

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [emailjsReady, setEmailjsReady] = useState(false);

  // Initialize EmailJS with your User ID
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      try {
        emailjs.init(import.meta.env.VITE_EMAILJS_USER_ID);
        setEmailjsReady(true);
      } catch (error) {
        console.error('EmailJS initialization error:', error);
        setEmailjsReady(false);
      }
    }
  }, []);

  // Validate form with Zod
  const validateForm = useCallback(() => {
    try {
      formSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  }, [formData]);

  // Rate limiting check
  const isRateLimited = useCallback(() => {
    const lastSubmission = localStorage.getItem('lastFormSubmission');
    if (!lastSubmission) return false;
    
    // Limit to one submission every 60 seconds
    const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission, 10);
    return timeSinceLastSubmission < 60000;
  }, []);

  // Handle form input changes
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user types
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  }, [formErrors]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    // Check rate limiting
    if (isRateLimited()) {
      toast({
        title: "Too many attempts",
        description: "Please wait a moment before submitting again.",
        variant: "destructive",
      });
      return;
    }

    // Abort if EmailJS isn't ready
    if (!emailjsReady) {
      toast({
        title: "Service unavailable",
        description: "Contact form service is not available right now. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setFormStatus('submitting');
    
    // EmailJS parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: "tomerg.work@gmail.com",
    };
    
    try {
      // Send email using EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      // Record submission time for rate limiting
      localStorage.setItem('lastFormSubmission', Date.now().toString());
      
      // Show success message
      toast({
        title: "Message sent successfully!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      setFormStatus('success');
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Message failed to send",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive",
      });
      setFormStatus('error');
    }
  }, [formData, validateForm, isRateLimited, emailjsReady, toast]);

  // Reset status after success/error
  useEffect(() => {
    if (formStatus === 'success' || formStatus === 'error') {
      const timer = setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  // Background particles effect
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 3,
    duration: Math.random() * 30 + 10,
    delay: Math.random() * 2
  }));

  // Form submission in progress, success or error
  const isSubmitting = formStatus === 'submitting';
  const isSuccess = formStatus === 'success';
  const isError = formStatus === 'error';

  return (
    <>
      <SEO
        title="Contact | Tomer Goldstein"
        description="Get in touch with Tomer Goldstein. Connect for project inquiries, collaborations, or general questions about full-stack development services."
        keywords="contact, email, message, get in touch, Tomer Goldstein, full-stack developer, web development"
        ogTitle="Contact | Tomer Goldstein"
        ogDescription="Reach out to discuss project inquiries, collaborations, or ask questions about my full-stack development services."
        ogType="website"
        robots="index, follow"
      />

      {/* Background particles */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        {particles.map((particle) => (
          <motion.div 
            key={particle.id}
            className="absolute rounded-full bg-crimson/20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              filter: 'blur(3px)',
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

      <section className="py-20 relative z-10">
        <div className="container-custom">
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
              Get In <span className="text-crimson relative">
                Touch
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
              >
                Contact
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Have a question or want to work together? Feel free to reach out!
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible" 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Contact Information Card */}
            <motion.div
              variants={fadeInUp}
              className="perspective transform-gpu"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="h-full"
              >
                <Card className="h-full border-border/70 overflow-hidden group hover:shadow-xl transition-all duration-500 hover:border-crimson/30">
                  <CardContent className="p-6 h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-8"
                    >
                      <h2 className="text-2xl font-bold mb-6 relative inline-flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-crimson" />
                        <span>Contact Information</span>
                        <motion.span 
                          className="absolute -bottom-2 left-0 w-full h-[2px] bg-crimson/20"
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                        />
                      </h2>
                    </motion.div>
                    
                    <div className="space-y-8">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="group/item"
                      >
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <Mail className="h-5 w-5 text-crimson" />
                          <span>Email</span>
                        </h3>
                        <a 
                          href="mailto:tomerg.work@gmail.com" 
                          className="text-muted-foreground hover:text-crimson transition-colors flex items-center group-hover/item:translate-x-1 transform transition-transform duration-300"
                          aria-label="Email Tomer at tomerg.work@gmail.com"
                      >
                        tomerg.work@gmail.com
                          <motion.span 
                            initial={{ opacity: 0, x: -5 }}
                            whileHover={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="ml-1 h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                          </motion.span>
                        </a>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="group/item"
                      >
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <Linkedin className="h-5 w-5 text-crimson" />
                          <span>LinkedIn</span>
                        </h3>
                        <a 
                          href="https://www.linkedin.com/in/tomergoldi/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-crimson transition-colors flex items-center group-hover/item:translate-x-1 transform transition-transform duration-300"
                          aria-label="Visit Tomer's LinkedIn profile"
                      >
                        in/tomergoldi
                          <motion.span 
                            initial={{ opacity: 0, x: -5 }}
                            whileHover={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="ml-1 h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                          </motion.span>
                        </a>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="group/item"
                      >
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <Github className="h-5 w-5 text-crimson" />
                          <span>GitHub</span>
                        </h3>
                      <a 
                        href="https://github.com/Tgoldi" 
                        target="_blank" 
                        rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-crimson transition-colors flex items-center group-hover/item:translate-x-1 transform transition-transform duration-300"
                          aria-label="Visit Tomer's GitHub profile"
                        >
                          github.com/Tgoldi
                          <motion.span 
                            initial={{ opacity: 0, x: -5 }}
                            whileHover={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="ml-1 h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                          </motion.span>
                        </a>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="pt-6 mt-6 border-t border-border/50"
                      >
                        <p className="text-muted-foreground text-sm">I strive to respond to all inquiries within 24-48 hours during business days.</p>
                      </motion.div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>

            {/* Contact Form Card */}
            <motion.div
              variants={fadeInUp}
              className="perspective transform-gpu"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="h-full"
              >
                <Card className="border-border/70 overflow-hidden group hover:shadow-xl transition-all duration-500 hover:border-crimson/30 relative">
                <CardContent className="p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-8"
                    >
                      <h2 className="text-2xl font-bold mb-6 relative inline-flex items-center gap-2">
                        <Send className="w-6 h-6 text-crimson" />
                        <span>Send a Message</span>
                        <motion.span 
                          className="absolute -bottom-2 left-0 w-full h-[2px] bg-crimson/20"
                          initial={{ scaleX: 0, originX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                        />
                      </h2>
                    </motion.div>
                    
                    {isSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 200,
                          damping: 20
                        }}
                        className="flex flex-col items-center justify-center h-64 text-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                            delay: 0.2
                          }}
                          className="w-16 h-16 bg-crimson/10 rounded-full flex items-center justify-center mb-4"
                        >
                          <Send className="h-8 w-8 text-crimson" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground">Thanks for reaching out. I'll get back to you as soon as possible.</p>
                        <Button 
                          variant="outline" 
                          className="mt-6 border-crimson/30 hover:bg-crimson/10"
                          onClick={() => setFormStatus('idle')}
                        >
                          Send Another Message
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.form 
                        onSubmit={handleSubmit} 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        aria-label="Contact form"
                      >
                    <div>
                          <div className="relative">
                      <Input
                              id="name"
                        placeholder="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                              aria-label="Your name"
                              aria-required="true"
                              aria-invalid={!!formErrors.name}
                              aria-describedby={formErrors.name ? "name-error" : undefined}
                              disabled={isSubmitting}
                              className={`bg-card/80 backdrop-blur-sm transition-all duration-300 ${
                                formErrors.name ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-crimson/20 border-border/50 hover:border-crimson/30'
                              }`}
                            />
                            {formErrors.name && (
                              <motion.p 
                                id="name-error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1"
                              >
                                {formErrors.name}
                              </motion.p>
                            )}
                          </div>
                    </div>
                    
                    <div>
                          <div className="relative">
                      <Input
                              id="email"
                        type="email"
                        placeholder="Your Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                              aria-label="Your email address"
                              aria-required="true"
                              aria-invalid={!!formErrors.email}
                              aria-describedby={formErrors.email ? "email-error" : undefined}
                              disabled={isSubmitting}
                              className={`bg-card/80 backdrop-blur-sm transition-all duration-300 ${
                                formErrors.email ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-crimson/20 border-border/50 hover:border-crimson/30'
                              }`}
                            />
                            {formErrors.email && (
                              <motion.p 
                                id="email-error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1"
                              >
                                {formErrors.email}
                              </motion.p>
                            )}
                          </div>
                    </div>
                    
                    <div>
                          <div className="relative">
                      <Input
                              id="subject"
                        placeholder="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                              aria-label="Message subject"
                              aria-required="true"
                              aria-invalid={!!formErrors.subject}
                              aria-describedby={formErrors.subject ? "subject-error" : undefined}
                              disabled={isSubmitting}
                              className={`bg-card/80 backdrop-blur-sm transition-all duration-300 ${
                                formErrors.subject ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-crimson/20 border-border/50 hover:border-crimson/30'
                              }`}
                            />
                            {formErrors.subject && (
                              <motion.p 
                                id="subject-error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1"
                              >
                                {formErrors.subject}
                              </motion.p>
                            )}
                          </div>
                    </div>
                    
                    <div>
                          <div className="relative">
                      <Textarea
                              id="message"
                        placeholder="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                              aria-label="Your message"
                              aria-required="true"
                              aria-invalid={!!formErrors.message}
                              aria-describedby={formErrors.message ? "message-error" : undefined}
                              disabled={isSubmitting}
                              className={`bg-card/80 backdrop-blur-sm transition-all duration-300 ${
                                formErrors.message ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-crimson/20 border-border/50 hover:border-crimson/30'
                              }`}
                            />
                            {formErrors.message && (
                              <motion.p 
                                id="message-error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mt-1"
                              >
                                {formErrors.message}
                              </motion.p>
                            )}
                          </div>
                    </div>
                    
                        <motion.div
                          whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                          whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        >
                    <Button 
                      type="submit" 
                            className="w-full bg-crimson hover:bg-crimson/90 mt-2 relative overflow-hidden group"
                            disabled={isSubmitting || !emailjsReady}
                            aria-label={isSubmitting ? "Sending message..." : "Send message"}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center">
                                <motion.div 
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                  animate={{ rotate: 360 }}
                                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                  role="status"
                                  aria-label="Loading"
                                />
                                Sending...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center">
                                <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" /> 
                                Send Message
                              </span>
                            )}
                            <motion.span 
                              className="absolute inset-0 bg-white/10 pointer-events-none"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: '100%' }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                    </Button>
                        </motion.div>

                        {!emailjsReady && (
                          <p className="text-yellow-500 text-xs text-center mt-2">
                            Contact form service is initializing. If this message persists, please email me directly.
                          </p>
                        )}
                      </motion.form>
                    )}
                </CardContent>
                  
                  {/* Decorative diagonal lines */}
                  <motion.div 
                    className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute bottom-0 right-0 bg-crimson h-px" 
                        style={{ 
                          width: `${(i+1) * 20}px`, 
                          bottom: `${(i+1) * 8}px`,
                          opacity: 0.6 - (i * 0.1)
                        }}
                      />
                    ))}
                  </motion.div>
              </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
