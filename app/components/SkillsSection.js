"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase
        .from("skills")
        .select("id, name, category, display_order")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Gagal mengambil skills:", error.message);
        setError("Skills could not be loaded. Please try again later.");
      } else {
        setSkills(data ?? []);
      }

      setLoading(false);
    }

    fetchSkills();
  }, []);

  const groupedSkills = skills.reduce((groups, skill) => {
    const category = skill.category || "Other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(skill);
    return groups;
  }, {});

  return (
    <section id="skills" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Skills
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Tools and skills I work with.
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Technologies and testing practices I use to help deliver reliable
            software.
          </p>
        </div>

        {loading ? (
          <p className="mt-12 text-slate-500" role="status">
            Loading skills...
          </p>
        ) : error ? (
          <p className="mt-12 text-red-600" role="alert">
            {error}
          </p>
        ) : skills.length === 0 ? (
          <p className="mt-12 text-slate-500">No published skills yet.</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedSkills).map(([category, items]) => (
              <article
                key={category}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-lg font-bold">{category}</h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
