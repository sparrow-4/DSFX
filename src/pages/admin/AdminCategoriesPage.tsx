import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, X, ArrowLeft, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchCategories, createCategory, updateCategory, deleteCategory, type ApiCategory } from '@/lib/api';
import { useAdminStore } from '@/store/adminStore';
import { toast } from 'sonner';

export default function AdminCategoriesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<ApiCategory | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchCategories,
  });

  const openAdd = () => {
    setEditCategory(null);
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const openEdit = (c: ApiCategory) => {
    setEditCategory(c);
    setName(c.name);
    setDescription(c.description);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditCategory(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      if (editCategory) {
        await updateCategory(editCategory._id, { name, description });
        toast.success('Category updated!');
      } else {
        await createCategory({ name, description });
        toast.success('Category created!');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };



  return (
    <div className="min-h-screen bg-background">


      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
              <p className="text-sm text-muted-foreground">{categories.length} categories</p>
            </div>
          </div>
          <Button onClick={openAdd} className="bg-gradient-spark font-display">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        {/* Categories Table */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary/50" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Slug</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground w-1/3">Description</th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((c) => (
                    <motion.tr key={c._id} layout className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                            <Tags className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-foreground">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{c.slug}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground truncate max-w-[200px]">
                        {c.description || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive" 
                            onClick={() => handleDelete(c._id)}
                            disabled={deletingId === c._id}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  {categories.length === 0 && (
                     <tr>
                       <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                         No categories found. Add one to get started.
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {editCategory ? 'Edit Category' : 'Add Category'}
                </h2>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Category Name *</Label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Laser Effects" 
                    autoFocus
                  />
                  <p className="mt-1 text-xs text-muted-foreground">The slug will be generated automatically.</p>
                </div>

                <div>
                  <Label>Description</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                    placeholder="Brief description of this category..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={closeModal} className="flex-1">Cancel</Button>
                  <Button onClick={handleSave} className="flex-1 bg-gradient-spark font-display" disabled={saving}>
                    {saving ? 'Saving...' : editCategory ? 'Update Category' : 'Add Category'}
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
