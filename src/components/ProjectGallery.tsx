"use client";
import { useState } from "react";

type Project = {
  id: string;
  title: string;
  category: string;
  tech: string[];
  summary: string;
  image: string;
};

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((p) => (
        <div key={p.id} className="p-6 border border-gray-800 bg-[#111]">
          <h3 className="text-xl font-bold text-white">{p.title}</h3>
          <p className="text-gray-400 text-sm mt-2">{p.summary}</p>
        </div>
      ))}
    </div>
  );
}