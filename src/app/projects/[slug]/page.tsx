import { projects } from "@/lib/projects";
import ProjectDetailView from "@/components/project-detail-view";
import { Metadata } from "next";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Optional: Dynamic Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  
  return {
    title: project ? `${project.title} | Prithvi Singh` : "Project | Prithvi Singh",
    description: project?.description || "Project details",
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  return <ProjectDetailView initialProject={project} allProjects={projects} />;
}
