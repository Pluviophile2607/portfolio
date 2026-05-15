"use client"

import { useParams, useRouter } from "next/navigation";
import { projects, Project } from "@/lib/projects";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import NotFoundAnimation from "./ui/not-found-animation";

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
        <div className="w-full max-w-4xl">
          <NotFoundAnimation />
        </div>
        <Link href="/" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 mt-8">
          <ArrowLeft size={20} /> Back to home
        </Link>
      </div>
    );
  }

  // Find next project
  const currentIndex = allProjects.findIndex(p => p.slug === project.slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-40 pb-20 text-black p-4">
      <div className="w-full max-w-7xl">
        <NotFoundAnimation />
      </div>
      <div className="text-center mt-4 px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 uppercase tracking-tighter">
          Site is under construction
        </h2>
        <p className="text-zinc-500 text-lg md:text-xl mb-10 max-w-xl mx-auto">
          Meanwhile, you can visit the live project site:
        </p>
        
        {project.liveUrl && (
          <a 
            href={project.liveUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-5 rounded-full font-bold hover:bg-zinc-800 transition-all mb-12 shadow-xl shadow-zinc-200"
          >
            Visit {project.title} <ArrowUpRight size={24} />
          </a>
        )}

        <div className="flex justify-center">
          <Link href="/" className="text-zinc-400 hover:text-black transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to portfolio
          </Link>
        </div>
      </div>
    </div>
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
