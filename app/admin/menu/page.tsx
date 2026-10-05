"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MENU_CATEGORIES } from "@/data/menu-categories";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular: boolean;
  available: boolean;
};

type MenuForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  popular: boolean;
};

const emptyForm: MenuForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  popular: false,
};

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      try {
        const response = await fetch("/api/admin/menu", {
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load menu items.");
        }
        if (isMounted) setMenuItems(data.menuItems);
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load menu items.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMenu();
    return () => {
      isMounted = false;
    };
  }, []);

  function startEditing(item: MenuItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image: item.image,
      popular: item.popular,
    });
    setError("");
    setMessage("");
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function uploadImage(file: File | undefined) {
    if (!file) return;
    setError("");
    setMessage("");
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.set("image", file);
      const response = await fetch("/api/admin/menu/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to upload image.");
      setForm((current) => ({ ...current, image: data.image }));
      setMessage("Image uploaded. Save the menu item to finish.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/menu", {
        method: editingId === null ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingId === null ? {} : { id: editingId }),
          ...form,
          price: Number(form.price),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save menu item.");
      }

      setMenuItems((items) => {
        const updatedItems =
          editingId === null
            ? [...items, data.menuItem]
            : items.map((item) =>
                item.id === editingId ? data.menuItem : item,
              );
        return updatedItems.sort((a, b) =>
          a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
        );
      });
      setMessage(editingId === null ? "Menu item added." : "Menu item updated.");
      setEditingId(null);
      setForm(emptyForm);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save menu item.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleAvailability(item: MenuItem) {
    setUpdatingId(item.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/menu", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, available: !item.available }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update availability.");
      }

      setMenuItems((items) =>
        items.map((current) =>
          current.id === item.id ? data.menuItem : current,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update availability.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
            FAMZI Admin
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#171717] sm:text-4xl">
            Menu
          </h1>
          <p className="mt-2 text-sm text-black/50">
            Add meals, update their details, and control what customers can order.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <form
            onSubmit={saveItem}
            className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-black text-[#171717]">
              {editingId === null ? "Add a menu item" : "Edit menu item"}
            </h2>

            <div className="mt-5 space-y-4">
              <label className="block text-sm font-bold text-[#171717]">
                Name
                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-orange-500"
                />
              </label>

              <label className="block text-sm font-bold text-[#171717]">
                Description
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  className="mt-2 w-full resize-y rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-orange-500"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-[#171717]">
                  Price (₦)
                  <input
                    required
                    min="1"
                    step="1"
                    type="number"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: event.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-orange-500"
                  />
                </label>

                <label className="block text-sm font-bold text-[#171717]">
                  Category
                  <select
                    required
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500"
                  >
                    <option value="" disabled>Select a category</option>
                    {form.category && !MENU_CATEGORIES.includes(form.category as (typeof MENU_CATEGORIES)[number]) && (
                      <option value={form.category}>{form.category} (current)</option>
                    )}
                    {MENU_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <span className="mt-1 block text-xs font-normal text-black/45">
                    Set soup size and pot options as separate items in the Quick Meals category, each with its own price.
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#171717]" htmlFor="menu-image">
                  Meal photo
                </label>
                <input
                  id="menu-image"
                  required={!form.image}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={isUploadingImage}
                  onChange={(event) => void uploadImage(event.target.files?.[0])}
                  className="mt-2 block w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:font-bold file:text-orange-700"
                />
                <p className="mt-1 text-xs font-normal text-black/45">JPG, PNG, or WebP. Maximum size: 5 MB.</p>
                {isUploadingImage && <p className="mt-2 text-xs font-semibold text-orange-600">Uploading image...</p>}
                {form.image && (
                  <img src={form.image} alt="Menu item preview" className="mt-3 h-36 w-full rounded-xl border border-black/5 object-cover" />
                )}
              </div>

              <label className="flex items-center gap-3 text-sm font-semibold text-black/70">
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={(event) =>
                    setForm({ ...form, popular: event.target.checked })
                  }
                  className="h-4 w-4 accent-orange-500"
                />
                Feature this item as popular
              </label>
            </div>

            {error && (
              <p role="alert" className="mt-5 text-sm font-semibold text-red-600">
                {error}
              </p>
            )}
            {message && (
              <p role="status" className="mt-5 text-sm font-semibold text-green-600">
                {message}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSaving || isUploadingImage}
                className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600 disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : editingId === null
                    ? "Add item"
                    : "Save changes"}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-xl border border-black/10 px-5 py-3 text-sm font-bold text-black/60 transition hover:bg-black/5"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#171717]">
                  Menu items
                </h2>
                <p className="mt-1 text-sm text-black/45">
                  {menuItems.length} item{menuItems.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {isLoading ? (
              <p className="py-10 text-center text-sm font-semibold text-black/45">
                Loading menu items...
              </p>
            ) : menuItems.length === 0 ? (
              <p className="py-10 text-center text-sm text-black/45">
                No menu items yet. Add your first item using the form.
              </p>
            ) : (
              <div className="mt-5 divide-y divide-black/5">
                {menuItems.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 py-5 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-[#171717]">
                          {item.name}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            item.available
                              ? "bg-green-50 text-green-700"
                              : "bg-black/5 text-black/45"
                          }`}
                        >
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                        {item.popular && (
                          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-600">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-black/40">
                        {item.category}
                      </p>
                      <p className="mt-2 text-sm font-bold text-orange-500">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEditing(item)}
                        className="rounded-lg border border-black/10 px-3 py-2 text-xs font-bold text-black/60 transition hover:bg-black/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAvailability(item)}
                        disabled={updatingId === item.id}
                        className="rounded-lg bg-[#171717] px-3 py-2 text-xs font-bold text-white transition hover:bg-orange-500 disabled:opacity-50"
                      >
                        {updatingId === item.id
                          ? "Updating..."
                          : item.available
                            ? "Mark unavailable"
                            : "Make available"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
