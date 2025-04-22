import { Link } from "react-router-dom";
import { memo } from "react";
import { Linkedin, Github, Mail, Accessibility } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Footer Link Interface
 */
interface FooterLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}

/**
 * Footer Component
 * 
 * Displays site footer with copyright information and social links
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social links configuration
  const socialLinks: FooterLink[] = [
    {
      href: "mailto:tomerg.work@gmail.com",
      label: "Email",
      icon: <Mail className="h-4 w-4" />,
    },
    {
      href: "https://github.com/Tgoldi",
      label: "GitHub",
      icon: <Github className="h-4 w-4" />,
      external: true,
    },
    {
      href: "https://www.linkedin.com/in/tomergoldi",
      label: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      external: true,
    },
  ];

  return (
    <footer className="border-t py-8 md:py-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-medium mb-3">About</h3>
            <p className="text-sm text-muted-foreground">
              Portfolio of Tomer Goldstein, a full-stack developer specializing in modern web technologies.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/experience" className="text-muted-foreground hover:text-foreground transition-colors">
                  Experience
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="flex items-center gap-1">
                    <Accessibility className="h-3 w-3" />
                    Accessibility
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Connect</h3>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <FooterSocialLink key={link.label} link={link} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link 
              to="/" 
              className="font-medium hover:text-crimson transition-colors"
              aria-label="Tomer's homepage"
            >
              <span className="text-crimson">T</span>omer<span className="text-crimson">.</span>
            </Link>
            <span className="hidden md:inline-block" aria-hidden="true">•</span>
            <span>&copy; {currentYear} Tomer Goldstein. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

/**
 * Footer Social Link Component
 */
interface FooterSocialLinkProps {
  link: FooterLink;
}

const FooterSocialLink = ({ link }: FooterSocialLinkProps) => (
  <motion.a
    href={link.href}
    aria-label={link.label}
    target={link.external ? "_blank" : undefined}
    rel={link.external ? "noopener noreferrer" : undefined}
    className="text-muted-foreground hover:text-crimson transition-colors flex items-center gap-2"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {link.icon}
    <span>{link.label}</span>
  </motion.a>
);

export default memo(Footer);
