import { Link } from "react-router-dom";
import { memo } from "react";
import { Linkedin, Github, Mail } from "lucide-react";
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
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
          
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <FooterSocialLink key={link.label} link={link} />
            ))}
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
    <span className="hidden sm:inline-block">{link.label}</span>
  </motion.a>
);

export default memo(Footer);
