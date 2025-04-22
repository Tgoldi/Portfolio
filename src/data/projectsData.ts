/**
 * Project Data Type Definitions and Project List
 * This file contains the primary data model for projects displayed in the portfolio
 */

/**
 * Project Interface
 * Defines the data structure for each project entry
 */
export interface Project {
    /** Project title */
    title: string;
    
    /** Short description of the project */
    description: string;
    
    /** Timeframe when project was built */
    period: string;
    
    /** Array of technologies or skills used */
    tags: string[];
    
    /** Optional link to live demo */
    link?: string;
    
    /** Optional link to GitHub repository */
    github?: string;
    
    /** Path to project screenshot/image */
    image: string;
}

/**
 * Projects Data Array
 * Contains all portfolio projects to be displayed
 */
export const projectsData: Project[] = [
    {
        title: "Startup Dashboard",
        description: "Built real-time UI and API integrations for an open-source analytics dashboard tracking 100+ voice logs/session. Integrated API calls and handled frequent data updates for voice request logs.",
        period: "January 2025 - February 2025",
        tags: ["React", "Tailwind CSS", "API Integration", "Analytics"],
        github: "https://github.com/Tgoldi/dashboard-latest",
        image: "/prod-img/dashboard-stratup.png"
    },
    {
        title: "Yeshdigital Website",
        description: "Designed and deployed a responsive marketing website for a digital agency. Developed and launched client site with 25% faster load time and 45% traffic increase using SEO and responsive design.",
        period: "December 2024 - January 2025",
        tags: ["Responsive Web Design", "SEO", "Digital Marketing"],
        github: "https://github.com/Tgoldi/YeshDig.co.il",
        image: "/prod-img/YESHDIGITAL.co.il.png"
    },
    {
        title: "Shopping Website",
        description: "Built full-stack e-commerce app with React and Spring Boot featuring authentication, cart, orders, and favorites. Implemented user authentication, item management, cart, favorites, and orders.",
        period: "June 2024 - September 2024",
        tags: ["React", "Spring Boot", "E-commerce", "Full-stack"],
        github: "https://github.com/Tgoldi/shoppingwebsite-frontend",
        image: "/prod-img/shopping-web.png"
    },
    {
        title: "Full CRUD Web App",
        description: "Built a CRUD app with React and Spring Boot, handling 500+ records with full API and validation. Designed backend services to support all CRUD operations and applied best practices for secure API development.",
        period: "April 2024",
        tags: ["React", "Spring Boot", "CRUD", "API Development"],
        github: "https://github.com/Tgoldi/fullstack-front",
        image: "/prod-img/CRUD.png"
    },
]; 