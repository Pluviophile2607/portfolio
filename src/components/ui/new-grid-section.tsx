"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaInstagram, FaGithub, FaFigma, FaPinterest } from "react-icons/fa";
import { SiN8N } from "react-icons/si";

export function NewGridSection() {
  return (
    <section className="bg-black px-6 mt-0 md:mt-20 pt-0 pb-20 relative z-40">
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 grid-rows-1 md:grid-rows-4 gap-2 h-auto md:h-[500px]">
          {/* div1 */}
          <div className="md:col-span-2 md:row-span-4 rounded-3xl bg-zinc-900/50 border border-white/5 p-8 flex flex-col min-h-[500px] md:min-h-0">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Let’s Stay <span className="text-[#ffc300]">Connected!</span></h3>
              <p className="text-zinc-400 text-[1.2rem] leading-relaxed">
                Follow me on social media for design inspiration, behind-the-scenes updates, and the latest projects. Let’s create and grow together!
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-auto">
              {[
                { name: "Gmail", icon: <Mail className="w-4 h-4" />, href: "mailto:prithvisingh1521@gmail.com" },
                { name: "Github", icon: <FaGithub className="w-4 h-4" />, href: "https://github.com/pluviophile2607" },
              ].map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  className="bg-zinc-100 rounded-xl p-3 flex flex-col justify-between aspect-[1.2/1] group/card transition-all hover:bg-white"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <div className="text-zinc-900">{social.icon}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-zinc-900 font-serif italic font-bold text-base">{social.name}</span>
                    <div className="w-6 h-6 rounded-full border border-zinc-200 flex items-center justify-center group-hover/card:bg-zinc-900 group-hover/card:text-white transition-colors">
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* div2 */}
          <div className="md:col-span-3 md:row-span-4 md:col-start-3 rounded-3xl bg-zinc-900/50 border border-white/5 p-4 md:p-8 flex flex-col min-h-[500px] md:min-h-0">
            <div className="grid grid-cols-6 gap-2 md:gap-3 mb-8">
              {[
                { name: "VS Code", icon: <img src="https://cdn.designfast.io/image/2026-05-06/a3a8a651-12fd-4f07-9996-9714018c907f.png" alt="VS Code" className="w-5 h-5 object-contain" />, href: "https://code.visualstudio.com/", className: "col-span-2" },
                { name: "n8n", icon: <SiN8N className="w-4 h-4 text-[#FF6D5B]" />, href: "https://n8n.io/", className: "col-span-2" },
                { name: "Pinterest", icon: <FaPinterest className="w-4 h-4 text-[#E60023]" />, href: "https://in.pinterest.com/", className: "col-span-2" },
                { name: "Figma", icon: <FaFigma className="w-4 h-4" />, href: "https://www.figma.com/", className: "col-span-3" },
                { 
                  name: "Canva", 
                  icon: <img src="https://cdn.designfast.io/image/2026-05-06/fad99217-9d91-4861-b517-8cecb7d717d8.png" alt="Canva" className="w-5 h-5 object-contain" />, 
                  href: "https://www.canva.com/",
                  className: "col-span-3"
                },

              ].map((tool) => (
                <a 
                  key={tool.name}
                  href={tool.href}
                  className={cn(
                    "bg-zinc-100 rounded-xl p-3 flex flex-col justify-between h-24 sm:h-28 md:h-32 group/card transition-all hover:bg-white",
                    tool.className
                  )}
                >
                  <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    {tool.icon}
                  </div>
                  <div className="flex items-center justify-between mt-2 overflow-hidden">
                    <span className="text-zinc-900 font-serif italic font-bold text-[10px] sm:text-xs md:text-base truncate">{tool.name}</span>
                    <div className="w-5 h-5 md:w-7 md:h-7 rounded-full border border-zinc-200 flex items-center justify-center group-hover/card:bg-zinc-900 group-hover/card:text-white transition-colors shrink-0">
                      <ArrowUpRight className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="mt-auto">
              <h3 className="text-2xl font-bold text-white mb-2">My Creative Toolkit</h3>
              <p className="text-zinc-400 text-[1.2rem] leading-relaxed">
                Explore the powerful tools and technologies I use to bring ideas to life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
