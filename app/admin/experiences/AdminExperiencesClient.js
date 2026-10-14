"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

const initialForm = {
  role: "",
  company: "",
  start_date: "",
  end_date: "",
  description: "",
  display_order: "0",
  is_published: false,
};

export default function AdminExperiencesClient() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  async function fetchExperiences() {
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("display_order", { ascending: true })
        .order("start_date", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setExperiences(data ?? []);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExperiences();
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

  function handleEdit(experience) {
    setFormData({
      role: experience.role ?? "",
      company: experience.company ?? "",
      start_date: experience.start_date ?? "",
      end_date: experience.end_date ?? "",
      description: experience.description ?? "",
      display_order: String(experience.display_order ?? 0),
      is_published: experience.is_published ?? false,
    });

    setEditingId(experience.id);
    setFormError("");
    setSuccessMessage("");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const role = formData.role.trim();
    const company = formData.company.trim();

    if (!role || !company) {
      setFormError("Posisi dan nama perusahaan wajib diisi.");
      return;
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

    if (
      formData.start_date &&
      formData.end_date &&
      formData.end_date < formData.start_date
    ) {
      setFormError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }

    const experienceData = {
      role,
      company,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      description: formData.description.trim() || null,
      display_order: displayOrder,
      is_published: formData.is_published,
    };

    setSaving(true);

    try {
      const supabase = createClient();

      const { error } =
        editingId !== null
          ? await supabase
              .from("experiences")
              .update(experienceData)
              .eq("id", editingId)
          : await supabase.from("experiences").insert(experienceData);

      if (error) {
        setFormError(error.message);
        return;
      }

      const wasEditing = editingId !== null;

      resetForm();

      setSuccessMessage(
        wasEditing
          ? "Pengalaman kerja berhasil diperbarui."
          : "Pengalaman kerja berhasil ditambahkan.",
      );

      await fetchExperiences();
    } catch (error) {
      setFormError(`Terjadi kesalahan saat menyimpan: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(experience) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus pengalaman "${experience.role} - ${experience.company}"?`,
    );

    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");
    setDeletingId(experience.id);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", experience.id);

      if (error) {
        setErrorMessage(`Gagal menghapus pengalaman: ${error.message}`);
        return;
      }

      if (editingId === experience.id) {
        resetForm();
      }

      setSuccessMessage(`Pengalaman "${experience.role}" berhasil dihapus.`);

      await fetchExperiences();
    } catch (error) {
      setErrorMessage(`Terjadi kesalahan saat menghapus: ${error.message}`);
    } finally {
      setDeletingId(null);
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

            <h1 className="text-3xl font-bold">Manage Experiences</h1>

            <p className="mt-2 text-gray-600">
              Kelola pengalaman kerja yang ditampilkan di portfolio kamu.
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
            {showForm ? "Tutup Form" : "+ Tambah Experience"}
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
              {editingId !== null
                ? "Edit Experience"
                : "Tambah Experience Baru"}
            </h2>

            <div>
              <label htmlFor="role" className="mb-1 block text-sm font-medium">
                Posisi / Role *
              </label>

              <input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Contoh: QA Engineer"
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="mb-1 block text-sm font-medium"
              >
                Perusahaan *
              </label>

              <input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                maxLength={150}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Contoh: PT Contoh Indonesia"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="start_date"
                  className="mb-1 block text-sm font-medium"
                >
                  Tanggal Mulai
                </label>

                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="end_date"
                  className="mb-1 block text-sm font-medium"
                >
                  Tanggal Selesai
                </label>

                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  min={formData.start_date || undefined}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Kosongkan jika masih bekerja.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium"
              >
                Deskripsi Pengalaman
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                maxLength={5000}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Jelaskan tanggung jawab, aktivitas testing, tools, dan pencapaian..."
              />
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
                Publish experience ke portfolio publik
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
                    ? "Update Experience"
                    : "Simpan Experience"}
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

        {loading && <p>Memuat data experiences...</p>}

        {!loading && errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-semibold">Terjadi kesalahan.</p>
            <p className="mt-1 text-sm">{errorMessage}</p>

            <button
              type="button"
              onClick={fetchExperiences}
              className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold hover:bg-red-100"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !errorMessage && experiences.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            Belum ada pengalaman kerja.
          </div>
        )}

        {!loading && !errorMessage && experiences.length > 0 && (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Posisi</th>
                  <th className="px-5 py-4">Perusahaan</th>
                  <th className="px-5 py-4">Periode</th>
                  <th className="px-5 py-4">Urutan</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {experiences.map((experience) => (
                  <tr key={experience.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold">
                      {experience.role}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {experience.company}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {experience.start_date || "—"}
                      {" – "}
                      {experience.end_date || "Sekarang"}
                    </td>

                    <td className="px-5 py-4">{experience.display_order}</td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          experience.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {experience.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(experience)}
                          disabled={deletingId !== null}
                          className="rounded-lg border border-blue-200 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(experience)}
                          disabled={deletingId !== null}
                          className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === experience.id
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
