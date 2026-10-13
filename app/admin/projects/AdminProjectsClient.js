"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

const initialForm = {
  title: "",
  description: "",
  tech_stack: "",
  github_url: "",
  live_url: "",
  display_order: "0",
  is_published: false,
};

export default function AdminProjectsClient() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  async function fetchProjects() {
    setLoading(true);
    setErrorMessage("");

    const supabase = createClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setProjects(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setFormData(initialForm);
    setEditingId(null);
    setShowForm(false);
    setFormError("");
  }

  function handleEdit(project) {
    setFormData({
      title: project.title ?? "",
      description: project.description ?? "",
      tech_stack: (project.tech_stack ?? []).join(", "),
      github_url: project.github_url ?? "",
      live_url: project.live_url ?? "",
      display_order: String(project.display_order ?? 0),
      is_published: project.is_published ?? false,
    });

    setEditingId(project.id);
    setFormError("");
    setSuccessMessage("");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(project) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus project "${project.title}"?`,
    );

    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");
    setDeletingId(project.id);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (error) {
        setErrorMessage(`Gagal menghapus project: ${error.message}`);
        return;
      }

      if (editingId === project.id) {
        resetForm();
      }

      setSuccessMessage(`Project "${project.title}" berhasil dihapus.`);

      await fetchProjects();
    } catch (error) {
      setErrorMessage(
        `Terjadi kesalahan saat menghapus project: ${error.message}`,
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const title = formData.title.trim();

    if (!title) {
      setFormError("Title wajib diisi.");
      return;
    }

    const urlFields = [
      ["GitHub URL", formData.github_url],
      ["Live URL", formData.live_url],
    ];

    for (const [label, value] of urlFields) {
      if (!value.trim()) continue;

      try {
        const url = new URL(value.trim());

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        setFormError(`${label} harus berupa URL yang valid (http/https).`);
        return;
      }
    }

    const displayOrder = Number(formData.display_order);

    if (
      formData.display_order.trim() === "" ||
      !Number.isInteger(displayOrder) ||
      displayOrder < 0
    ) {
      setFormError("Display order harus berupa bilangan bulat minimal 0.");
      return;
    }

    const techStack = formData.tech_stack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const projectData = {
      title,
      description: formData.description.trim() || null,
      tech_stack: techStack,
      github_url: formData.github_url.trim() || null,
      live_url: formData.live_url.trim() || null,
      display_order: displayOrder,
      is_published: formData.is_published,
      updated_at: new Date().toISOString(),
    };

    setSaving(true);

    try {
      const supabase = createClient();

      const { error } =
        editingId !== null
          ? await supabase
              .from("projects")
              .update(projectData)
              .eq("id", editingId)
          : await supabase.from("projects").insert(projectData);

      if (error) {
        setFormError(error.message);
        return;
      }

      const wasEditing = editingId !== null;

      resetForm();

      setSuccessMessage(
        wasEditing
          ? "Project berhasil diperbarui."
          : "Project berhasil ditambahkan.",
      );

      await fetchProjects();
    } catch (error) {
      setFormError(
        `Terjadi kesalahan saat menyimpan project: ${error.message}`,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-block text-sm text-blue-600 hover:underline"
            >
              ← Kembali ke Dashboard
            </Link>

            <h1 className="text-3xl font-bold">Manage Projects</h1>

            <p className="mt-2 text-gray-600">
              Kelola project yang ditampilkan di portfolio kamu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setFormData(initialForm);
                setEditingId(null);
                setFormError("");
                setSuccessMessage("");
                setShowForm(true);
              }
            }}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {showForm ? "Tutup Form" : "+ Tambah Project"}
          </button>
        </div>

        {successMessage && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700"
          >
            {successMessage}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 space-y-5 rounded-xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              {editingId !== null ? "Edit Project" : "Tambah Project Baru"}
            </h2>

            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium">
                Title *
              </label>

              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Contoh: Cypress API Testing"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Jelaskan project kamu..."
              />
            </div>

            <div>
              <label
                htmlFor="tech_stack"
                className="mb-1 block text-sm font-medium"
              >
                Tech Stack
              </label>

              <input
                id="tech_stack"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="JavaScript, Cypress, Postman"
              />

              <p className="mt-1 text-xs text-gray-500">
                Pisahkan setiap teknologi dengan koma.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="github_url"
                  className="mb-1 block text-sm font-medium"
                >
                  GitHub URL
                </label>

                <input
                  id="github_url"
                  name="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <label
                  htmlFor="live_url"
                  className="mb-1 block text-sm font-medium"
                >
                  Live URL
                </label>

                <input
                  id="live_url"
                  name="live_url"
                  type="url"
                  value={formData.live_url}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="display_order"
                className="mb-1 block text-sm font-medium"
              >
                Display Order
              </label>

              <input
                id="display_order"
                name="display_order"
                type="number"
                min="0"
                step="1"
                value={formData.display_order}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
              />

              <p className="mt-1 text-xs text-gray-500">
                Angka lebih kecil akan ditampilkan lebih dahulu.
              </p>
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="h-4 w-4"
              />

              <span className="text-sm font-medium">
                Publish project ke portfolio publik
              </span>
            </label>

            {formError && (
              <p role="alert" className="text-sm text-red-600">
                {formError}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Menyimpan..."
                  : editingId !== null
                    ? "Update Project"
                    : "Simpan Project"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-5 py-3 font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        {loading && <p>Memuat data projects...</p>}

        {!loading && errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-semibold">Terjadi kesalahan.</p>
            <p className="mt-1 text-sm">{errorMessage}</p>

            <button
              type="button"
              onClick={fetchProjects}
              className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold hover:bg-red-100"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !errorMessage && projects.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            Belum ada project.
          </div>
        )}

        {!loading && !errorMessage && projects.length > 0 && (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Project</th>
                  <th className="px-5 py-4">Tech Stack</th>
                  <th className="px-5 py-4">Display Order</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{project.title}</p>

                      <p className="mt-1 max-w-md text-gray-500">
                        {project.description || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {project.tech_stack?.join(", ") || "-"}
                    </td>

                    <td className="px-5 py-4">{project.display_order}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          project.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {project.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(project)}
                          disabled={deletingId !== null}
                          className="rounded-lg border border-blue-200 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(project)}
                          disabled={deletingId !== null}
                          className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === project.id
                            ? "Menghapus..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
