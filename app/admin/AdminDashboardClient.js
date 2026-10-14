"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const sections = [
  {
    title: "Projects",
    description: "Manage portfolio projects and repository links.",
    href: "/admin/projects",
    table: "projects",
  },
  {
    title: "Skills",
    description: "Manage technical skills and categories.",
    href: "/admin/skills",
    table: "skills",
  },
  {
    title: "Experiences",
    description: "Manage work history and descriptions.",
    href: "/admin/experiences",
    table: "experiences",
  },
];

export default function AdminDashboardClient() {
  const router = useRouter();

  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setError("Logout gagal. Silakan coba lagi.");
        setLoggingOut(false);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat logout.");
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    async function fetchCounts() {
      try {
        const supabase = createClient();

        const results = await Promise.all(
          sections.map(async (section) => {
            const { count, error } = await supabase
              .from(section.table)
              .select("*", { count: "exact", head: true });

            return {
              table: section.table,
              count,
              error,
            };
          }),
        );

        const failed = results.find((result) => result.error);

        if (failed) {
          console.error(
            "Gagal mengambil ringkasan admin:",
            failed.error.message,
          );

          setError(
            "Could not load dashboard statistics. Check your Supabase permissions.",
          );
        } else {
          const nextCounts = {};

          results.forEach((result) => {
            nextCounts[result.table] = result.count ?? 0;
          });

          setCounts(nextCounts);
        }
      } catch (error) {
        console.error("Gagal mengambil statistik:", error);
        setError("Terjadi kesalahan saat memuat statistik dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 sm:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Portfolio CMS
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              View Portfolio
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Overview</h2>

          <p className="mt-2 text-slate-600">
            Manage the content displayed on your public portfolio.
          </p>
        </div>

        {error && (
          <p
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {sections.map((section) => (
              <article
                key={section.table}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">
                  Total {section.title}
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {loading ? "—" : (counts[section.table] ?? 0)}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Total records in database
                </p>
              </article>
            ))}
          </div>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">
            Content Management
          </h2>

          <p className="mt-2 text-slate-600">
            Select a section below to manage your portfolio content.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group block rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-blue-700">
                    {section.title}
                  </h3>

                  <span
                    aria-hidden="true"
                    className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700"
                  >
                    →
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {section.description}
                </p>

                <span className="mt-5 inline-flex rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition group-hover:bg-blue-100">
                  Manage {section.title}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-8 text-sm text-slate-500">
          Portfolio content management dashboard.
        </p>
      </div>
    </main>
  );
}
