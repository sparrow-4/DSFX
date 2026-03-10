import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X, Upload, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct, getImageUrl, type ApiProduct, type ApiCategory } from '@/lib/api';
import { useAdminStore } from '@/store/adminStore';
import { toast } from 'sonner';

type SpecEntry = { key: string; value: string };

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  stock: string;
  featured: boolean;
  rating: string;
  reviewCount: string;
  specs: SpecEntry[];
  existingImages: string[];
}

const DEFAULT_FORM: ProductFormData = {
  name: '', description: '', price: '', originalPrice: '',
  category: '', stock: '0', featured: false,
  rating: '0', reviewCount: '0',
  specs: [{ key: '', value: '' }],
  existingImages: [],
};

function productToForm(p: ApiProduct): ProductFormData {
  return {
    name: p.name,
    description: p.description,
    price: String(p.price),
    originalPrice: p.originalPrice ? String(p.originalPrice) : '',
    category: p.category,
    stock: String(p.stock),
    featured: p.featured,
    rating: String(p.rating),
    reviewCount: String(p.reviewCount),
    specs: Object.entries(p.specifications).map(([key, value]) => ({ key, value })),
    existingImages: p.images,
  };
}

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<ApiProduct | null>(null);
  const [form, setForm] = useState<ProductFormData>(DEFAULT_FORM);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchCategories,
  });

  const openAdd = () => {
    setEditProduct(null);
    setForm({ ...DEFAULT_FORM, category: categories.length > 0 ? categories[0].name : '' });
    setNewFiles([]);
    setShowModal(true);
  };

  const openEdit = (p: ApiProduct) => {
    setEditProduct(p);
    setForm(productToForm(p));
    setNewFiles([]);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
    }
  };

  const addSpec = () => setForm((f) => ({ ...f, specs: [...f.specs, { key: '', value: '' }] }));
  const removeSpec = (i: number) => setForm((f) => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) =>
    setForm((f) => ({ ...f, specs: f.specs.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));

  const removeExistingImage = (img: string) =>
    setForm((f) => ({ ...f, existingImages: f.existingImages.filter((i) => i !== img) }));

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      toast.error('Name, price and stock are required');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      if (form.originalPrice) fd.append('originalPrice', form.originalPrice);
      fd.append('category', form.category);
      fd.append('stock', form.stock);
      fd.append('featured', String(form.featured));
      fd.append('rating', form.rating);
      fd.append('reviewCount', form.reviewCount);

      const specsObj: Record<string, string> = {};
      form.specs.filter((s) => s.key).forEach((s) => { specsObj[s.key] = s.value; });
      fd.append('specifications', JSON.stringify(specsObj));

      form.existingImages.forEach((img) => fd.append('existingImages', img));
      newFiles.forEach((file) => fd.append('images', file));

      if (editProduct) {
        await updateProduct(editProduct._id, fd);
        toast.success('Product updated!');
      } else {
        await createProduct(fd);
        toast.success('Product created!');
      }

      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };



  return (
    <div className="min-h-screen bg-background">


      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
              <p className="text-sm text-muted-foreground">{products.length} items</p>
            </div>
          </div>
          <Button onClick={openAdd} className="bg-gradient-spark font-display">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary/50" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Featured</th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p) => (
                    <motion.tr
                      key={p._id}
                      layout
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-border bg-secondary">
                            {p.images[0] ? (
                              <img src={getImageUrl(p.images[0])} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                                <Zap className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-foreground text-sm line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{p.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">₹{p.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={p.stock > 0 ? 'text-green-400' : 'text-destructive'}>{p.stock}</span>
                      </td>
                      <td className="px-4 py-3">
                        {p.featured ? (
                          <Badge className="bg-primary/20 text-primary text-xs">Featured</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 bottom-0 top-4 z-50 mx-auto max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-card p-6 md:inset-y-8 md:rounded-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {editProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Label>Product Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. TitanSpark Pro" />
                </div>

                {/* Description */}
                <div>
                  <Label>Description</Label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    placeholder="Product description..."
                  />
                </div>

                {/* Price / Original Price */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Price (₹) *</Label>
                    <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Original Price (₹)</Label>
                    <Input type="number" step="0.01" value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))} placeholder="Optional (for sale)" />
                  </div>
                </div>

                {/* Category / Stock */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Category</Label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c: ApiCategory) => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label>Stock *</Label>
                    <Input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
                  </div>
                </div>

                {/* Rating / Review Count */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label>Rating (0-5)</Label>
                    <Input type="number" step="0.1" max="5" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Review Count</Label>
                    <Input type="number" value={form.reviewCount} onChange={(e) => setForm((f) => ({ ...f, reviewCount: e.target.value }))} />
                  </div>
                  <div className="flex items-end">
                    <label className="flex cursor-pointer items-center gap-2 pb-2">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm text-foreground">Featured</span>
                    </label>
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Specifications</Label>
                    <Button variant="ghost" size="sm" onClick={addSpec} className="h-7 text-xs">+ Add</Button>
                  </div>
                  <div className="space-y-2">
                    {form.specs.map((spec, i) => (
                      <div key={i} className="flex gap-2">
                        <Input placeholder="Key (e.g. Power)" value={spec.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} className="flex-1" />
                        <Input placeholder="Value (e.g. 750W)" value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} className="flex-1" />
                        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-destructive" onClick={() => removeSpec(i)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Existing images */}
                {form.existingImages.length > 0 && (
                  <div>
                    <Label>Current Images</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.existingImages.map((img) => (
                        <div key={img} className="relative">
                          <img src={getImageUrl(img)} alt="" className="h-16 w-16 rounded-md object-cover border border-border" />
                          <button
                            onClick={() => removeExistingImage(img)}
                            className="absolute -right-1 -top-1 rounded-full bg-destructive p-0.5 text-white"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload new images */}
                <div>
                  <Label>Upload Images</Label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload images (max 5)</p>
                    {newFiles.length > 0 && (
                      <p className="text-xs font-medium text-primary">{newFiles.length} file(s) selected</p>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={closeModal} className="flex-1">Cancel</Button>
                  <Button onClick={handleSave} className="flex-1 bg-gradient-spark font-display" disabled={saving}>
                    {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
