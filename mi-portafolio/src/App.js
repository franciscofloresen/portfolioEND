import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// --- ICONS (Lucide React) ---
// To keep everything in one file, we define the icon components here.
// In a real project, you would import these from 'lucide-react'.

const Briefcase = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const Code = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

const Database = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
);

const Cloud = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
);

const HardDrive = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="12" x2="2" y2="12"></line>
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
        <line x1="6" y1="16" x2="6.01" y2="16"></line>
        <line x1="10" y1="16" x2="10.01" y2="16"></line>
    </svg>
);


const Award = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
    </svg>
);

const Github = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const Linkedin = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const Instagram = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
);

const Mail = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const Menu = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
);

const X = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

const Sun = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const Moon = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const MessageCircle = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const Send = ({ size = 24, color = 'currentColor', strokeWidth = 2 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);


// --- PORTFOLIO DATA (From your CV) ---

const portfolioData = {
    name: "Francisco Flores Enríquez",
    title: "Computer Systems Engineering",
    profile: "Results-driven Software Developer with hands-on experience across the full development lifecycle. Proven ability to architect and deploy cloud-native applications, featuring robust Python and Java (Spring Boot) backends and responsive React frontends. Adept at implementing automated CI/CD pipelines on AWS, showcasing a strong command of modern DevOps practices.",
    contact: {
        email: "franciscofloresenriquez2001@gmail.com",
        linkedin: "https://www.linkedin.com/in/francisco-flores-89230b25b/",
        github: "https://github.com/Franss-Flores",
        instagram: "#",
    },
    skills: [
        { name: 'Languages', items: ['Python', 'Java', 'C', 'JavaScript', 'HTML/CSS'], icon: <Code className="w-8 h-8 text-cyan-400" /> },
        { name: 'Frontend', items: ['React', 'TailwindCSS'], icon: <Code className="w-8 h-8 text-cyan-400" /> },
        { name: 'Backend', items: ['Flask', 'Node.js', 'Spring Boot'], icon: <Code className="w-8 h-8 text-cyan-400" /> },
        { name: 'Databases', items: ['MongoDB', 'Neo4j'], icon: <Database className="w-8 h-8 text-cyan-400" /> },
        { name: 'Cloud & DevOps', items: ['AWS', 'Azure', 'Oracle Cloud', 'CI/CD'], icon: <Cloud className="w-8 h-8 text-cyan-400" /> },
        { name: 'Systems & Tools', items: ['Linux', 'Windows Server', 'Git', 'VMware'], icon: <HardDrive className="w-8 h-8 text-cyan-400" /> },
    ],
    projects: [
        {
            title: "Dynamic Personal Portfolio",
            description: "This very portfolio. A serverless web application built with React and deployed on AWS Amplify, with backend features like a contact form using API Gateway, Lambda, and SES.",
            tags: ["React", "AWS Amplify", "Lambda", "API Gateway", "Python"],
            link: "#"
        },
        {
            title: "Snake Game in C and Ripes",
            description: "A classic Snake game implementation in C, designed to run on the Ripes RISC-V simulator. This project demonstrates an understanding of low-level programming.",
            tags: ["C", "RISC-V", "Emulation"],
            link: "https://github.com/Franss-Flores/Snake-en-C-y-Ripes"
        },
        {
            title: "Next Awesome Project",
            description: "Currently developing a new application. More details coming soon. Stay tuned!",
            tags: ["Coming Soon"],
            link: "#"
        }
    ],
    certifications: [
        { name: "AWS Academy Graduate - Cloud Web Application Builder", issuer: "Amazon Web Services", date:"Apr 2025" },
        { name: "Cypher Fundamentals", issuer: "Neo4j", date:"Mar 2025" },
        { name: "Neo4j Fundamentals", issuer: "Neo4j", date:"Mar 2025" },
        { name: "Cisco Python Essentials 1", issuer: "Cisco Networking Academy", date:"Dec 2022" },
    ]
};

// --- THEME MANAGEMENT (LIGHT/DARK MODE) ---
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            // Default to user's system preference
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'dark'; // Fallback for SSR
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const useTheme = () => useContext(ThemeContext);


// --- CUSTOM HOOK FOR SCROLL ANIMATIONS ---
const useIntersectionObserver = (options) => {
    const [elements, setElements] = useState([]);
    const [entries, setEntries] = useState([]);
    const observer = useRef(null);

    useEffect(() => {
        if (elements.length > 0) {
            observer.current = new IntersectionObserver(observedEntries => {
                setEntries(observedEntries);
            }, options);

            elements.forEach(element => observer.current.observe(element));

            return () => {
                if (observer.current) {
                    elements.forEach(element => observer.current.unobserve(element));
                }
            };
        }
    }, [elements, options]);

    return [
        (element) => {
            if (element && !elements.includes(element)) {
                setElements(prev => [...prev, element]);
            }
        },
        entries
    ];
};


// --- SECTION COMPONENTS ---

const AnimatedSection = ({ children }) => {
    const [ref, entries] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
    const isVisible = entries.some(entry => entry.isIntersecting);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {children}
        </div>
    );
};

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const navLinks = [
        { href: '#skills', label: 'Skills' },
        { href: '#projects', label: 'Projects' },
        { href: '#certifications', label: 'Certifications' },
        { href: '#contact', label: 'Contact' },
    ];

    const scrollTo = (e, selector) => {
        e.preventDefault();
        document.querySelector(selector).scrollIntoView({
            behavior: 'smooth'
        });
        setIsOpen(false);
    };

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <a href="#" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                    FF
                </a>
                <div className="hidden md:flex space-x-6 items-center">
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)} className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">{link.label}</a>
                    ))}
                    <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 focus:outline-none">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
                <div className="md:flex items-center space-x-4 md:hidden">
                    <button onClick={toggleTheme} className="text-gray-800 dark:text-white focus:outline-none mr-4">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-white focus:outline-none">
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>
            {/* Mobile Menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800`}>
                <div className="flex flex-col items-center py-4">
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} onClick={(e) => scrollTo(e, link.href)} className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors py-2">{link.label}</a>
                    ))}
                </div>
            </div>
        </header>
    );
};


const Hero = () => (
    <section className="container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {portfolioData.name}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-cyan-500 dark:text-cyan-400 font-semibold">
            {portfolioData.title}
        </p>
        <p className="mt-6 max-w-3xl text-gray-600 dark:text-gray-300">
            {portfolioData.profile}
        </p>
        <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }); }}
            className="mt-8 px-8 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-transform transform hover:scale-105"
        >
            Contact Me
        </a>
    </section>
);

const Skills = () => (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
            <AnimatedSection>
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Technical Skills</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioData.skills.map((skillCategory) => (
                        <div key={skillCategory.name} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20 transition-shadow">
                            <div className="flex items-center mb-4">
                                {skillCategory.icon}
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-4">{skillCategory.name}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skillCategory.items.map(item => (
                                    <span key={item} className="bg-gray-200 dark:bg-gray-700 text-cyan-700 dark:text-cyan-300 text-sm font-medium px-3 py-1 rounded-full">{item}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </AnimatedSection>
        </div>
    </section>
);

const Projects = () => (
    <section id="projects" className="py-20">
        <div className="container mx-auto px-6">
            <AnimatedSection>
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Featured Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioData.projects.map(project => (
                        <div key={project.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 mt-auto">
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-cyan-500 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 font-semibold transition-colors">
                                    View More &rarr;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </AnimatedSection>
        </div>
    </section>
);

const Certifications = () => (
    <section id="certifications" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
            <AnimatedSection>
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Certifications</h2>
                <div className="max-w-3xl mx-auto">
                    {portfolioData.certifications.map((cert, index) => (
                        <div key={cert.name} className={`relative pl-8 py-4 border-l-2 border-cyan-500 ${index === portfolioData.certifications.length - 1 ? '' : 'pb-10'}`}>
                            <div className="absolute -left-3 top-4 w-5 h-5 bg-cyan-500 rounded-full border-4 border-white dark:border-gray-900"></div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cert.name}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                            <p className="text-gray-500 dark:text-gray-500 text-sm">{cert.date}</p>
                        </div>
                    ))}
                </div>
            </AnimatedSection>
        </div>
    </section>
);

const Contact = () => (
    <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
            <AnimatedSection>
                <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Let's Talk</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        I'm open to new opportunities and collaborations. If you have a project in mind or just want to say hello, feel free to reach out.
                    </p>
                    <a href={`mailto:${portfolioData.contact.email}`} className="inline-block px-8 py-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-transform transform hover:scale-105">
                        Send an Email
                    </a>
                    <p className="text-gray-600 dark:text-gray-400 mt-6 text-sm">
                        Or find me on my social networks.
                    </p>
                </div>
            </AnimatedSection>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-100 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">&copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Github /></a>
                <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Linkedin /></a>
                <a href={portfolioData.contact.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Instagram /></a>
                <a href={`mailto:${portfolioData.contact.email}`} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><Mail /></a>
            </div>
        </div>
    </footer>
);


// --- CHATBOT COMPONENTS ---

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hello! I'm Francisco's AI assistant. Feel free to ask me about his skills, projects, or how this site was built." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const botResponse = { sender: 'bot', text: `This is a simulated response to: "${userMessage.text}". The real AI is not connected yet.` };
            setMessages(prev => [...prev, botResponse]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <>
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
                >
                    {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
                </button>
            </div>

            <div className={`fixed bottom-28 right-8 w-96 h-[60vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                {/* Header */}
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-t-lg border-b border-gray-200 dark:border-gray-600">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">AI Assistant</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-cyan-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-b-lg border-t border-gray-200 dark:border-gray-600">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="w-full px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};


// --- LAYOUT CONTAINER COMPONENT ---
const PortfolioLayout = () => (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans leading-relaxed transition-colors duration-300">
        <Header />
        <main>
            <Hero />
            <Skills />
            <Projects />
            <Certifications />
            <Contact />
        </main>
        <Footer />
        <Chatbot />
    </div>
);


// --- MAIN APP COMPONENT ---
export default function App() {
    return (
        <ThemeProvider>
            <PortfolioLayout />
        </ThemeProvider>
    );
}