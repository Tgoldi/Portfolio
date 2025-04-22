import { FC } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO Component Props
 */
interface SEOProps {
    /**
     * Page title to be displayed in browser tab
     */
    title?: string;

    /**
     * Meta description for search engines
     */
    description?: string;

    /**
     * Page canonical URL (optional)
     */
    canonical?: string;

    /**
     * Open Graph image URL (optional)
     */
    ogImage?: string;

    /**
     * Open Graph title (optional, falls back to title)
     */
    ogTitle?: string;

    /**
     * Open Graph description (optional, falls back to description)
     */
    ogDescription?: string;

    /**
     * Open Graph URL (optional, falls back to canonical)
     */
    ogUrl?: string;

    /**
     * Additional keywords (optional)
     */
    keywords?: string | string[];

    /**
     * Type of content (defaults to website)
     */
    type?: 'website' | 'article' | 'profile';

    /**
     * Open Graph type (optional, falls back to type)
     */
    ogType?: 'website' | 'article' | 'profile';

    /**
     * Page language (defaults to en)
     */
    lang?: string;

    /**
     * Author of the page
     */
    author?: string;

    /**
     * Flag to disable indexing by search engines
     */
    noIndex?: boolean;

    /**
     * Explicit robots directives
     */
    robots?: string;

    /**
     * Twitter card type
     */
    twitterCard?: 'summary' | 'summary_large_image';

    /**
     * Twitter title (optional, falls back to title)
     */
    twitterTitle?: string;

    /**
     * Twitter description (optional, falls back to description)
     */
    twitterDescription?: string;

    /**
     * Twitter image (optional, falls back to ogImage)
     */
    twitterImage?: string;
}

/**
 * SEO Component
 * 
 * Handles all meta tags and document head content for better SEO
 * 
 * @example
 * ```tsx
 * <SEO 
 *   title="My Portfolio - Projects"
 *   description="View my latest web development projects"
 *   canonical="https://mysite.com/projects"
 * />
 * ```
 */
export const SEO: FC<SEOProps> = ({
    title = 'Tomer Goldstein | Full-Stack Developer',
    description = 'Portfolio of Tomer Goldstein, a full-stack developer specializing in modern web technologies.',
    canonical,
    ogImage = '/images/profile.jpg',
    keywords = 'full-stack developer, web developer, react, javascript, java, spring boot',
    type = 'website',
    lang = 'en',
    author = 'Tomer Goldstein',
    robots = 'index, follow',
    ogTitle,
    ogDescription,
    ogType = 'website',
    ogUrl,
    twitterCard = 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage,
    noIndex = false,
}: SEOProps) => {
    const siteName = 'Tomer Goldstein';
    const actualTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    const currentUrl = canonical || window.location.href;
    const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

    // Default values for meta properties
    const metaOgTitle = ogTitle || actualTitle;
    const metaOgDescription = ogDescription || description;
    const metaOgType = ogType || type;
    const metaOgUrl = ogUrl || currentUrl;
    const metaTwitterTitle = twitterTitle || actualTitle;
    const metaTwitterDescription = twitterDescription || description;
    const metaTwitterImage = twitterImage || ogImage;
    const metaRobots = robots || (noIndex ? 'noindex, nofollow' : 'index, follow');

    return (
        <Helmet prioritizeSeoTags>
            {/* Primary Meta Tags */}
            <html lang={lang} />
            <title>{actualTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywordsString} />
            <meta name="author" content={author} />
            <meta name="robots" content={metaRobots} />

            {/* Canonical Link */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={metaOgType} />
            <meta property="og:url" content={metaOgUrl} />
            <meta property="og:title" content={metaOgTitle} />
            <meta property="og:description" content={metaOgDescription} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={`${title} - OG Image`} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={metaTwitterTitle} />
            <meta name="twitter:description" content={metaTwitterDescription} />
            <meta name="twitter:image" content={metaTwitterImage} />
            <meta name="twitter:image:alt" content={`${title} - Twitter Image`} />

            {/* Author */}
            <meta name="author" content={author} />

            {/* Preload critical path images from meta tags to ensure LCP improvement */}
            <link rel="preload" as="image" href={ogImage} />
        </Helmet>
    );
};

export default SEO; 