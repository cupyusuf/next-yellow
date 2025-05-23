"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Label {
  id: number;
  name: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

export default function LabelPage() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [labelName, setLabelName] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [editLabelId, setEditLabelId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [labelsRes, categoriesRes] = await Promise.all([
          fetch("http://yellowfit.test/api/labels"),
          fetch("http://yellowfit.test/api/categories"),
        ]);
        const labelsData = await labelsRes.json();
        const categoriesData = await categoriesRes.json();
        setLabels(labelsData);
        setCategories(categoriesData);
      } catch {
        // error ignored
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleAddLabel(e: React.FormEvent) {
    e.preventDefault();
    if (!labelName || !categoryId) return;
    const res = await fetch("http://yellowfit.test/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: labelName, category_id: categoryId }),
    });
    if (res.ok) {
      const newLabel = await res.json();
      setLabels((prev) => [...prev, newLabel]);
      setLabelName("");
      setCategoryId("");
    }
  }

  function handleEditLabel(label: Label) {
    setEditLabelId(label.id);
    setLabelName(label.name);
    setCategoryId(label.category_id || "");
  }

  async function handleUpdateLabel(e: React.FormEvent) {
    e.preventDefault();
    if (!labelName || editLabelId === null || !categoryId) return;
    const res = await fetch(`http://yellowfit.test/api/labels/${editLabelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: labelName, category_id: categoryId }),
    });
    if (res.ok) {
      setLabels((prev) => prev.map(l => l.id === editLabelId ? { ...l, name: labelName, category_id: categoryId } : l));
      setEditLabelId(null);
      setLabelName("");
      setCategoryId("");
    }
  }

  async function handleDeleteLabel(id: number) {
    const res = await fetch(`http://yellowfit.test/api/labels/${id}`, { method: "DELETE" });
    if (res.ok) setLabels((prev) => prev.filter(l => l.id !== id));
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Labels</h2>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors"
          onClick={() => {
            setEditLabelId(null);
            setLabelName("");
            setCategoryId("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          + Add Label
        </button>
      </div>
      <form
        onSubmit={editLabelId === null ? handleAddLabel : handleUpdateLabel}
        className="bg-foreground/5 border border-foreground/10 rounded-lg shadow-sm p-4 mb-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="labelName">Nama Label</label>
          <input
            id="labelName"
            className="border border-foreground/20 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 bg-background text-foreground"
            placeholder="Nama label"
            value={labelName}
            onChange={e => setLabelName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="categoryId">Kategori</label>
          <select
            id="categoryId"
            className="border border-foreground/20 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 bg-background text-foreground"
            value={categoryId}
            onChange={e => setCategoryId(Number(e.target.value))}
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            {editLabelId === null ? "Tambah" : "Update"}
          </button>
          {editLabelId !== null && (
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold transition-colors"
              onClick={() => { setEditLabelId(null); setLabelName(""); setCategoryId(""); }}
            >
              Batal
            </button>
          )}
        </div>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg overflow-hidden text-sm bg-background shadow-sm text-foreground">
          <thead>
            <tr className="bg-foreground/10">
              <th className="border border-foreground/10 px-4 py-2 text-left">#</th>
              <th className="border border-foreground/10 px-4 py-2 text-left">Nama Label</th>
              <th className="border border-foreground/10 px-4 py-2 text-left">Kategori</th>
              <th className="border border-foreground/10 px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {labels.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">Belum ada label</td>
              </tr>
            ) : (
              labels.map((label, idx) => (
                <tr key={label.id} className="odd:bg-background even:bg-foreground/5">
                  <td className="border border-foreground/10 px-4 py-2">{idx + 1}</td>
                  <td
                    className="border border-foreground/10 px-4 py-2 cursor-pointer hover:underline text-blue-700"
                    onClick={() => router.push(`/label/${label.id}`)}
                  >
                    {label.name}
                  </td>
                  <td className="border border-foreground/10 px-4 py-2">
                    {categories.find(c => c.id === label.category_id)?.name || '-'}
                  </td>
                  <td className="border border-foreground/10 px-4 py-2">
                    <button
                      className="inline-flex items-center gap-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300 px-2 py-1 rounded mr-2 transition-colors"
                      onClick={() => handleEditLabel(label)}
                      type="button"
                      aria-label="Edit label"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" /></svg>
                      Edit
                    </button>
                    <button
                      className="inline-flex items-center gap-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 px-2 py-1 rounded transition-colors"
                      onClick={() => handleDeleteLabel(label.id)}
                      type="button"
                      aria-label="Hapus label"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
