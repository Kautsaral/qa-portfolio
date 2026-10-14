
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

const initialForm = {
  name: "",
  category: "",
  display_order: "0",
  is_published: false,
};

export default function AdminSkillsClient() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  async function fetchSkills() {
    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSkills(data ?? []);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSkills();
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

  function handleEdit(skill) {
    setFormData({
      name: skill.name ?? "",
      category: skill.category ?? "",
      display_order: String(skill.display_order ?? 0),
      is_published: skill.is_published ?? false,
    });

    setEditingId(skill.id);
    setFormError("");
    setSuccessMessage("");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const name = formData.name.trim();

    if (!name) {
      setFormError("Nama skill wajib diisi.");
      return;
    }

    const displayOrder = Number(formData.display_order);

    if (
      formData.display_order.trim() === "" ||
      !Number.isInteger(displayOrder) ||
      displayOrder < 0
    ) {
      setFormError(
        "Display order harus berupa bilangan bulat minimal 0."
      );
      return;
    }

    const skillData = {
      name,
      category: formData.category.trim() || null,
      display_order: displayOrder,
      is_published: formData.is_published,
    };

    setSaving(true);

    try {
      const supabase = createClient();

      const { error } =
        editingId !== null
          ? await supabase
              .from("skills")
              .update(skillData)
              .eq("id", editingId)
          : await supabase
              .from("skills")
              .insert(skillData);

      if (error) {
        setFormError(error.message);
        return;
      }

      const wasEditing = editingId !== null;

      resetForm();

      setSuccessMessage(
        wasEditing
          ? "Skill berhasil diperbarui."
          : "Skill berhasil ditambahkan."
      );

      await fetchSkills();
    } catch (error) {
      setFormError(
        `Terjadi kesalahan saat menyimpan skill: ${error.message}`
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(skill) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus skill "${skill.name}"?`
    );

    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");
    setDeletingId(skill.id);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", skill.id);

      if (error) {
        setErrorMessage(
          `Gagal menghapus skill: ${error.message}`
        );
        return;
      }

      if (editingId === skill.id) {
        resetForm();
      }

      setSuccessMessage(
        `Skill "${skill.name}" berhasil dihapus.`
      );

      await fetchSkills();
    } catch (error) {
      setErrorMessage(
        `Terjadi kesalahan saat menghapus skill: ${error.message}`
      );
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

            <h1 className="text-3xl font-bold">Manage Skills</h1>

            <p className="mt-2 text-gray-600">
              Kelola skill yang ditampilkan di portfolio kamu.
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
            {showForm ? "Tutup Form" : "+ Tambah Skill"}
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
              {editingId !== null ? "Edit Skill" : "Tambah Skill Baru"}
            </h2>

            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium"
              >
                Nama Skill *
              </label>

              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Contoh: Cypress"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium"
              >
                Kategori
              </label>

              <input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                maxLength={100}
                className="w-full rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Contoh: Automation Testing"
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
                Publish skill ke portfolio publik
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
                    ? "Update Skill"
                    : "Simpan Skill"}
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

        {loading && <p>Memuat data skills...</p>}

        {!loading && errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-semibold">Terjadi kesalahan.</p>
            <p className="mt-1 text-sm">{errorMessage}</p>

            <button
              type="button"
              onClick={fetchSkills}
              className="mt-3 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold hover:bg-red-100"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !errorMessage && skills.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            Belum ada skill.
          </div>
        )}

        {!loading && !errorMessage && skills.length > 0 && (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Nama Skill</th>
                  <th className="px-5 py-4">Kategori</th>
                  <th className="px-5 py-4">Display Order</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold">
                      {skill.name}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {skill.category || "-"}
                    </td>

                    <td className="px-5 py-4">
                      {skill.display_order}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          skill.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {skill.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(skill)}
                          disabled={deletingId !== null}
                          className="rounded-lg border border-blue-200 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(skill)}
                          disabled={deletingId !== null}
                          className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === skill.id
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
