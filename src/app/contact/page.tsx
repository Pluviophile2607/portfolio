"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, X } from "lucide-react";
import { submitContactForm } from "./actions";

export default function ContactPage() {
  const [interest, setInterest] = useState("DESIGN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Fetch video and create a blob URL to "hide" the direct link
    fetch("https://ik.imagekit.io/pluviophile/New%20Folder/Contact-page.mp4")
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      })
      .catch(err => console.error("Video load failed:", err));

    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      interest: interest
    };
    
    try {
      const result = await submitContactForm(data);
      if (result.success) {
        setIsSuccess(true);
        form.reset();
      } else {
        alert("Something went wrong on our server. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-screen bg-black text-white p-6 md:p-12 lg:p-20 relative font-sans overflow-hidden flex flex-col justify-center">
      {/* Close Button */}
      <div className="absolute top-8 right-8 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors tracking-widest text-xs uppercase"
        >
          <span>CLOSE</span>
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto w-full">
        {!isSuccess ? (
          <>
            {/* Title Section */}
            <div className="flex flex-col mb-6">
              <motion.h1 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[10vw] md:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase italic"
              >
                Let&apos;s Work
              </motion.h1>
              <div className="flex items-center gap-4 -mt-2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="w-[12vw] h-[8vw] md:w-[10vw] md:h-[6.5vw] rounded-2xl overflow-hidden bg-zinc-800 shrink-0 mt-2"
                >
                  {videoUrl && (
                    <video 
                      src={videoUrl} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                  )}
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  className="text-[10vw] md:text-[8vw] font-black leading-[0.8] tracking-tighter uppercase italic"
                >
                  Together
                </motion.h1>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-end">
            <div className="space-y-4">
              {/* Name Field */}
              <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] items-center gap-4 group">
                <span className="text-zinc-500 text-xs md:text-sm font-bold tracking-widest uppercase">Name</span>
                <input 
                  name="name"
                  type="text" 
                  placeholder="Prithvi Singh" 
                  required
                  suppressHydrationWarning
                  className="bg-transparent border-none outline-none text-zinc-700 text-[5vw] md:text-[3.2vw] font-black tracking-tighter uppercase italic placeholder:text-zinc-800 focus:text-white transition-colors w-full"
                />
              </div>

              {/* Email Field */}
              <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] items-center gap-4 group">
                <span className="text-zinc-500 text-xs md:text-sm font-bold tracking-widest uppercase">Email</span>
                <input 
                  name="email"
                  type="email" 
                  placeholder="prithvisingh1521@gmail.com" 
                  required
                  suppressHydrationWarning
                  className="bg-transparent border-none outline-none text-zinc-700 text-[5vw] md:text-[3.2vw] font-black tracking-tighter uppercase italic placeholder:text-zinc-800 focus:text-white transition-colors w-full"
                />
              </div>

              {/* Phone Field */}
              <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] items-center gap-4 group">
                <span className="text-zinc-500 text-xs md:text-sm font-bold tracking-widest uppercase">Phone</span>
                <input 
                  name="phone"
                  type="text" 
                  placeholder="XX XX XX XX XX" 
                  required
                  suppressHydrationWarning
                  className="bg-transparent border-none outline-none text-zinc-700 text-[5vw] md:text-[3.2vw] font-black tracking-tighter uppercase italic placeholder:text-zinc-800 focus:text-white transition-colors w-full"
                />
              </div>

              {/* Message Field */}
              <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] items-center gap-4 group">
                <span className="text-zinc-500 text-xs md:text-sm font-bold tracking-widest uppercase">Message</span>
                <input 
                  name="message"
                  type="text" 
                  placeholder="I HAVE A COOL PROJECT FOR YOU..." 
                  suppressHydrationWarning
                  className="bg-transparent border-none outline-none text-zinc-700 text-[5vw] md:text-[3.2vw] font-black tracking-tighter uppercase italic placeholder:text-zinc-800 focus:text-white transition-colors w-full"
                />
              </div>

              {/* Interest Field */}
              <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] items-start gap-4">
                <span className="text-zinc-500 text-xs md:text-sm font-bold tracking-widest uppercase pt-3">Interest</span>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  {["DESIGN", "WEBFLOW DEVELOPMENT", "FULL PACKAGE"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setInterest(option)}
                      className={`px-4 py-2 md:px-6 md:py-3 rounded-xl border transition-all duration-300 text-xs md:text-sm font-bold tracking-wider uppercase ${
                        interest === option 
                          ? "bg-white text-black border-white" 
                          : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Send Button */}
            <div className="mt-8 flex justify-end">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 md:px-12 md:py-4 bg-white text-black text-lg md:text-xl font-black italic tracking-tighter uppercase rounded-xl transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#18D2B0]"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </motion.button>
            </div>
          </form>
        </>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="flex items-center gap-4 md:gap-8 flex-wrap justify-center">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-[10vw] md:text-[7vw] font-black leading-[0.8] tracking-tighter uppercase italic"
              >
                Thank
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="w-[16vw] h-[10vw] md:w-[10vw] md:h-[6.5vw] rounded-2xl md:rounded-[1.2rem] overflow-hidden bg-zinc-800 shrink-0"
              >
                {videoUrl && (
                  <video 
                    src={videoUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-cover pointer-events-none select-none"
                  />
                )}
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="text-[10vw] md:text-[7vw] font-black leading-[0.8] tracking-tighter uppercase italic"
              >
                You
              </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-zinc-500 text-sm md:text-base font-bold tracking-widest uppercase mt-12 text-center"
            >
              Your message has been received.
            </motion.p>

            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => setIsSuccess(false)}
              className="mt-8 px-8 py-3 bg-zinc-900 hover:bg-white hover:text-black text-zinc-500 rounded-xl border border-white/5 transition-all uppercase tracking-widest text-xs font-bold"
            >
              Send Another
            </motion.button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
