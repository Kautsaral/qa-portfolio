"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, tech_stack, github_url, display_order")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Gagal mengambil proyek:", error.message);
        setError("Projects could not be loaded. Please try again later.");
      } else {
        setProjects(data ?? []);
      }

      setLoading(false);
    }

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Projects
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Practical testing. Measurable confidence.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Hands-on projects demonstrating API testing, browser automation, and
            behavior-driven development.
          </p>
        </div>

        {loading ? (
          <p className="mt-12 text-slate-500" role="status">
            Loading projects...
          </p>
        ) : error ? (
          <p className="mt-12 text-red-600" role="alert">
            {error}
          </p>
        ) : projects.length === 0 ? (
          <p className="mt-12 text-slate-500">No published projects yet.</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project, index) => (
              <article
                key={project.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg sm:p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-blue-600">
                    PROJECT {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
                    {(project.tech_stack ?? []).some((tool) =>
                      ["Cypress", "Playwright"].includes(tool),
                    )
                      ? "TEST AUTOMATION"
                      : "QA PROJECT"}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold">{project.title}</h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(project.tech_stack ?? []).map((tool) => (
                    <span
                      key={tool}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                    >
                      View Repository <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
