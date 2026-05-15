export interface Project {
  id: number;
  slug: string;
  title: string;
  image: string;
  category: string;
  description: string;
  client?: string;
  year?: string;
  role?: string;
  tags?: string[];
  services?: string;
  tools?: string;
  value?: string;
  timeline?: string;
  fullDescription?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "tera-mera",
    title: "Tera Mera",
    image: "https://cdn.designfast.io/image/2026-05-12/68fe2048-7a5e-4d55-93f0-afa87ac6cac8.jpeg",
    category: "Web Site",
    description: "A comprehensive digital solution for local neighborhood sharing and community engagement.",
    fullDescription: "The primary goal of **Tera Mera** is to create a community-driven platform for sharing, lending, giving away, and selling items at affordable prices—promoting sustainability, reuse, and the circular economy.\n\nAs a ZED Foundation initiative, **Tera Mera** enables individuals to discover nearby items easily, connect safely within their community, and make resource sharing more accessible through a simple and user-friendly experience.",
    services: "Web Design, Development, Community Platform,",
    tools: "React.Js,MongoDB",
    value: "Scalable community architecture, Real-time interactions",
    timeline: "2 Weeks",
    client: "Tera Mera Community",
    year: "2026",
    role: "Full Stack Development & UI/UX Design",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Supabase"],
    liveUrl: "https://teramera.space/"
  },
  {
    id: 2,
    slug: "zed-ngo",
    title: "Zed Aid",
    image: "https://cdn.designfast.io/image/2026-05-12/65c81e50-890b-493e-87e0-9e30235ebd8b.jpeg",
    category: "Web Site",
    description: "Digital presence for Zero Effect Development, an NGO focused on sustainable growth.",
    services: "Non-profit Web Presence, Sustainable Design",
    tools: "React, GSAP, Three.js",
    value: "High impact visual storytelling, Eco-friendly hosting",
    timeline: "8 Weeks",
    client: "ZED Organization",
    year: "2025",
    role: "Web Design & Development",
    tags: ["React", "GSAP", "Three.js", "Sustainable Design"],
    liveUrl: "https://blue-gull-275507.hostingersite.com/"
  },
  {
    id: 3,
    slug: "swastik-power",
    title: "Swastik Power Pro",
    image: "https://cdn.designfast.io/image/2026-05-12/b3422204-bfdf-4e52-a78c-1c2a0c30dfdb.jpeg",
    category: "Web Site",
    description: "Industrial power solutions showcase with interactive product catalogs and technical specs.",
    services: "E-commerce, Catalog Management, Industrial UI",
    tools: "Next.js, TypeScript, Headless CMS",
    value: "Optimized lead generation, Precise technical filters",
    timeline: "10 Weeks",
    client: "Swastik Power Systems",
    year: "2025",
    role: "Frontend Development",
    tags: ["Next.js", "TypeScript", "Motion", "Industrial Design"],
    liveUrl: "https://swastikpowerpro.com/"
  },
  {
    id: 4,
    slug: "aiz-boostr",
    title: "Aizboostr",
    image: "https://cdn.designfast.io/image/2026-05-12/c82e986e-a9a9-4479-a8d4-e682a8373f9e.jpeg",
    category: "SaaS Platform",
    description: "AI-powered marketing automation platform helping small businesses scale their reach.",
    services: "Product Strategy, Dashboard UI, AI Integration",
    tools: "Figma, React, Python",
    value: "Automated workflow efficiency, Data-driven insights",
    timeline: "16 Weeks",
    client: "Aiz-Boostr AI",
    year: "2026",
    role: "Product Design",
    tags: ["AI Integration", "React", "Dashboard", "SaaS"],
    liveUrl: "https://aizboostr.com/"
  },
  {
    id: 5,
    slug: "adhyan-academy",
    title: "Adhyan Academy",
    image: "https://cdn.designfast.io/image/2026-05-12/6e0fd967-264b-42f0-a290-ae688a332895.jpeg",
    category: "E-Learning",
    description: "E-learning platform with comprehensive course management and interactive learning modules.",
    services: "Educational UX, LMS Development, Video Streaming",
    tools: "Next.js, Node.js, Mux",
    value: "Seamless student onboarding, Interactive quizzes",
    timeline: "14 Weeks",
    client: "Adhyan Education",
    year: "2024",
    role: "Full Stack Development",
    tags: ["LMS", "Next.js", "Node.js", "Database Design"],
    liveUrl: "https://adhyanacademy.in/"
  }
];
