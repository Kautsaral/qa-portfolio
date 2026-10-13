"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function formatDate(dateString) {
  if (!dateString) return "Present";

  return new Date(`${dateString.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      year: "numeric",
    }
  );
}

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchExperiences() {
      const { data, error } = await supabase
        .from("experiences")
        .select(
          "id, role, company, start_date, end_date, description, display_order"
        )
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Gagal mengambil experience:", error.message);
        setError("Experience could not be loaded. Please try again later.");
      } else {
        setExperiences(data ?? []);
      }

      setLoading(false);
    }

    fetchExperiences();
  }, []);

  return (
    <section
      id="experience"
      className="border-t border-slate-200 bg-slate-50"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Experience
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            My professional journey.
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            My experience in software quality assurance, testing, and
            automation.
          </p>
        </div>

        {loading ? (
          <p className="mt-12 text-slate-500" role="status">
            Loading experience...
          </p>
        ) : error ? (
          <p className="mt-12 text-red-600" role="alert">
            {error}
          </p>
        ) : experiences.length === 0 ? (
          <p className="mt-12 text-slate-500">
            No published experience yet.
          </p>
        ) : (
          <div className="mt-12 space-y-6">
            {experiences.map((experience) => (
              <article
                key={experience.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {experience.role}
                    </h3>

                    <p className="mt-1 font-medium text-blue-700">
                      {experience.company}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-medium text-slate-500">
                    {formatDate(experience.start_date)} –{" "}
                    {formatDate(experience.end_date)}
                  </p>
                </div>

                {experience.description && (
                  <p className="mt-5 whitespace-pre-line leading-7 text-slate-600">
                    {experience.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}