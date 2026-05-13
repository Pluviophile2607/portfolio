"use client"

import { useParams, useRouter } from "next/navigation";
import { projects, Project } from "@/lib/projects";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Play, Mail, Globe, Clock, Briefcase, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectDetailViewProps {
  initialProject: Project | undefined;
  allProjects: Project[];
}

export default function ProjectDetailView({ initialProject, allProjects }: ProjectDetailViewProps) {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.slug]);

  // Use the slug from params to find the current project, fallback to initialProject
  const project = allProjects.find(p => p.slug === params.slug) || initialProject;

  if (!mounted) return null;
  if (!project) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
          <ArrowLeft size={20} /> Back to home
        </Link>
      </div>
    );
  }

  // Find next project
  const currentIndex = allProjects.findIndex(p => p.slug === project.slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-[#2e3c51] selection:text-white font-sans">
      {/* Main Hero Content */}
      <div className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-slate-900 mb-8">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl mb-12">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="mailto:prithvisingh1521@gmail.com"
                className="bg-[#2e3c51] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-1"
              >
                <ArrowUpRight size={20} className="rotate-45" />
                Contact Me
              </Link>
              <button 
                className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-sm hover:bg-slate-50 transition-all hover:-translate-y-1"
              >
                <Play size={20} className="fill-slate-900" />
                Site Preview
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-8"
          >
            <DetailItem 
              label="Services" 
              content={project.services || "Web Design, Development"} 
              icon={<Briefcase size={16} className="text-slate-400" />}
            />
            <DetailItem 
              label="Tools" 
              content={project.tools || "Framer, Figma"} 
              icon={<Zap size={16} className="text-slate-400" />}
            />
            <DetailItem 
              label="Value" 
              content={project.value || "Highly customizable, high performance"} 
              icon={<Globe size={16} className="text-slate-400" />}
            />
            <DetailItem 
              label="Timeline" 
              content={project.timeline || "2 weeks"} 
              icon={<Clock size={16} className="text-slate-400" />}
            />
          </motion.div>
        </div>
      </div>

      {/* Featured Project Image */}
      <section className="px-6 md:px-12 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* Full Description Section */}
      {project.fullDescription && (
        <section className="px-6 md:px-12 pb-32 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {project.fullDescription.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-5xl">
                {paragraph.split('**').map((part, j) => (
                  j % 2 === 1 ? <strong key={j} className="text-slate-900 font-bold">{part}</strong> : part
                ))}
              </p>
            ))}
          </motion.div>
        </section>
      )}

      {/* Next Project Footer */}
      <section className="bg-white border-t border-slate-100 py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">Next Project</p>
          <Link 
            href={`/projects/${nextProject.slug}`}
            className="group"
          >
            <h2 className="text-4xl md:text-7xl font-medium tracking-tight text-slate-300 group-hover:text-slate-900 transition-colors duration-500">
              {nextProject.title}
            </h2>
            <div className="mt-4 flex justify-center">
               <ArrowLeft size={32} className="rotate-180 text-slate-300 group-hover:text-slate-900 transition-all duration-500 group-hover:translate-x-2" />
            </div>
          </Link>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm font-medium">
            &copy; 2026 Prithvi Singh — Portfolio
          </p>
          <div className="flex gap-8">
            {["Twitter", "LinkedIn", "Instagram"].map(social => (
              <a key={social} href="#" className="text-sm font-medium text-slate-400 hover:text-slate-900 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

function DetailItem({ label, content, icon }: { label: string; content: string; icon?: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 italic">{label}</span>
      </div>
      <p className="text-lg md:text-xl font-medium text-slate-700 leading-snug">
        {content}
      </p>
    </div>
  );
}
