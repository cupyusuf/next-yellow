"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Label {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

export default function LabelCategory() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [labelName, setLabelName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [editLabelId, setEditLabelId] = useState<number | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
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
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // CRUD Label
  async function handleAddLabel(e: React.FormEvent) {
    e.preventDefault();
    if (!labelName) return;
    const res = await fetch("http://yellowfit.test/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: labelName }),
    });
    if (res.ok) {
      const newLabel = await res.json();
      setLabels((prev) => [...prev, newLabel]);
      setLabelName("");
    }
  }

  async function handleEditLabel(label: Label) {
    setEditLabelId(label.id);
    setLabelName(label.name);
  }

  async function handleUpdateLabel(e: React.FormEvent) {
    e.preventDefault();
    if (!labelName || editLabelId === null) return;
    const res = await fetch(`http://yellowfit.test/api/labels/${editLabelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: labelName }),
    });
    if (res.ok) {
      setLabels((prev) => prev.map(l => l.id === editLabelId ? { ...l, name: labelName } : l));
      setEditLabelId(null);
      setLabelName("");
    }
  }

  async function handleDeleteLabel(id: number) {
    const res = await fetch(`http://yellowfit.test/api/labels/${id}`, { method: "DELETE" });
    if (res.ok) setLabels((prev) => prev.filter(l => l.id !== id));
  }

  // CRUD Category
  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryName) return;
    const res = await fetch("http://yellowfit.test/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: categoryName }),
    });
    if (res.ok) {
      const newCat = await res.json();
      setCategories((prev) => [...prev, newCat]);
      setCategoryName("");
    }
  }

  async function handleEditCategory(cat: Category) {
    setEditCategoryId(cat.id);
    setCategoryName(cat.name);
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
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Labels</h2>
      <form
        onSubmit={editLabelId === null ? handleAddLabel : handleUpdateLabel}
        className="flex gap-2 mb-4"
      >
        <input
          className="border px-2 py-1 rounded w-full"
          placeholder="Nama label"
          value={labelName}
          onChange={e => setLabelName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          {editLabelId === null ? "Tambah" : "Update"}
        </button>
        {editLabelId !== null && (
          <button
            type="button"
            className="bg-gray-400 text-white px-3 py-1 rounded"
            onClick={() => { setEditLabelId(null); setLabelName(""); }}
          >
            Batal
          </button>
        )}
      </form>
      <ul className="mb-8">
        {labels.map((label) => (
          <li
            key={label.id}
            className="flex items-center gap-2 mb-1"
          >
            <span
              className="cursor-pointer hover:underline flex-1"
              onClick={() => router.push(`/label/${label.id}`)}
            >
              {label.name}
            </span>
            <button
              className="text-xs text-yellow-600"
              onClick={() => handleEditLabel(label)}
            >
              Edit
            </button>
            <button
              className="text-xs text-red-600"
              onClick={() => handleDeleteLabel(label.id)}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <form
        onSubmit={editCategoryId === null ? handleAddCategory : handleUpdateCategory}
        className="flex gap-2 mb-4"
      >
        <input
          className="border px-2 py-1 rounded w-full"
          placeholder="Nama kategori"
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          {editCategoryId === null ? "Tambah" : "Update"}
        </button>
        {editCategoryId !== null && (
          <button
            type="button"
            className="bg-gray-400 text-white px-3 py-1 rounded"
            onClick={() => { setEditCategoryId(null); setCategoryName(""); }}
          >
            Batal
          </button>
        )}
      </form>
      <ul>
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center gap-2 mb-1"
          >
            <span
              className="cursor-pointer hover:underline flex-1"
              onClick={() => router.push(`/category/${cat.id}`)}
            >
              {cat.name}
            </span>
            <button
              className="text-xs text-yellow-600"
              onClick={() => handleEditCategory(cat)}
            >
              Edit
            </button>
            <button
              className="text-xs text-red-600"
              onClick={() => handleDeleteCategory(cat.id)}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
