"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("http://yellowfit.test/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch {
        // error ignored
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryName) return;
    const res = await fetch("http://yellowfit.test/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName }),
    });
    if (res.ok) {
      const newCategory = await res.json();
      setCategories((prev) => [...prev, newCategory]);
      setCategoryName("");
    }
  }

  function handleEditCategory(category: Category) {
    setEditCategoryId(category.id);
    setCategoryName(category.name);
  }

  async function handleUpdateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryName || editCategoryId === null) return;
    const res = await fetch(`http://yellowfit.test/api/categories/${editCategoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName }),
    });
    if (res.ok) {
      setCategories((prev) => prev.map(c => c.id === editCategoryId ? { ...c, name: categoryName } : c));
      setEditCategoryId(null);
      setCategoryName("");
    }
  }

  async function handleDeleteCategory(id: number) {
    const res = await fetch(`http://yellowfit.test/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) setCategories((prev) => prev.filter(c => c.id !== id));
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors"
          onClick={() => {
            setEditCategoryId(null);
            setCategoryName("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          + Add Category
        </button>
      </div>
      <form
        onSubmit={editCategoryId === null ? handleAddCategory : handleUpdateCategory}
        className="bg-foreground/5 border border-foreground/10 rounded-lg shadow-sm p-4 mb-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground" htmlFor="categoryName">Nama Kategori</label>
          <input
            id="categoryName"
            className="border border-foreground/20 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200 bg-background text-foreground"
            placeholder="Nama kategori"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            {editCategoryId === null ? "Tambah" : "Update"}
          </button>
          {editCategoryId !== null && (
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold transition-colors"
              onClick={() => { setEditCategoryId(null); setCategoryName(""); }}
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
              <th className="border border-foreground/10 px-4 py-2 text-left">Nama Kategori</th>
              <th className="border border-foreground/10 px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400">Belum ada kategori</td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr key={cat.id} className="odd:bg-background even:bg-foreground/5">
                  <td className="border border-foreground/10 px-4 py-2">{idx + 1}</td>
                  <td
                    className="border border-foreground/10 px-4 py-2 cursor-pointer hover:underline text-blue-700"
                    onClick={() => router.push(`/category/${cat.id}`)}
                  >
                    {cat.name}
                  </td>
                  <td className="border border-foreground/10 px-4 py-2">
                    <button
                      className="inline-flex items-center gap-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300 px-2 py-1 rounded mr-2 transition-colors"
                      onClick={() => handleEditCategory(cat)}
                      type="button"
                      aria-label="Edit category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414 1.414-4.243a4 4 0 01.828-1.414z" /></svg>
                      Edit
                    </button>
                    <button
                      className="inline-flex items-center gap-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 px-2 py-1 rounded transition-colors"
                      onClick={() => handleDeleteCategory(cat.id)}
                      type="button"
                      aria-label="Hapus category"
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
