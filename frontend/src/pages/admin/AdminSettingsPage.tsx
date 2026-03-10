import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Store, Mail, Phone, MapPin, Facebook, Twitter, Instagram, BarChart3, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { fetchSettings, updateSettings } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: fetchSettings,
  });

  const [form, setForm] = useState({
    storeName: '',
    logoUrl: '',
    aboutText: '',
    heroSubtitle: '',
    stats: [] as { label: string; value: string }[],
    benefits: [] as { title: string; description: string; icon: string }[],
    email: '',
    phone: '',
    location: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        storeName: settings.storeName || '',
        logoUrl: settings.logoUrl || '',
        aboutText: settings.aboutText || '',
        heroSubtitle: settings.heroSubtitle || '',
        stats: settings.stats || [],
        benefits: settings.benefits || [],
        email: settings.email || '',
        phone: settings.phone || '',
        location: settings.location || '',
        facebookUrl: settings.facebookUrl || '',
        twitterUrl: settings.twitterUrl || '',
        instagramUrl: settings.instagramUrl || '',
      });
    }
  }, [settings]);

  const addStat = () => setForm(f => ({ ...f, stats: [...f.stats, { label: '', value: '' }] }));
  const removeStat = (i: number) => setForm(f => ({ ...f, stats: f.stats.filter((_, idx) => idx !== i) }));
  const updateStat = (i: number, field: 'label' | 'value', val: string) => 
    setForm(f => ({ ...f, stats: f.stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));

  const addBenefit = () => setForm(f => ({ ...f, benefits: [...f.benefits, { title: '', description: '', icon: 'Zap' }] }));
  const removeBenefit = (i: number) => setForm(f => ({ ...f, benefits: f.benefits.filter((_, idx) => idx !== i) }));
  const updateBenefit = (i: number, field: 'title' | 'description' | 'icon', val: string) => 
    setForm(f => ({ ...f, benefits: f.benefits.map((b, idx) => idx === i ? { ...b, [field]: val } : b) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      toast.success('Settings updated!');
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-secondary/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Store Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your store information</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-gradient-spark font-display" disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* General Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">General</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={form.storeName}
                onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))}
                placeholder="Your Store Name"
              />
            </div>
            <div>
              <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
              <Input
                id="logoUrl"
                value={form.logoUrl}
                onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Hero Subtitle (Home Page)</Label>
              <Textarea
                id="heroSubtitle"
                value={form.heroSubtitle}
                onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))}
                rows={2}
                placeholder="Tagline for the home page..."
              />
            </div>
            <div>
              <Label htmlFor="aboutText">About Text (About Page)</Label>
              <Textarea
                id="aboutText"
                value={form.aboutText}
                onChange={(e) => setForm((f) => ({ ...f, aboutText: e.target.value }))}
                rows={4}
                placeholder="Describe your store..."
              />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold text-foreground">Site Statistics</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={addStat} className="h-8">+ Add Stat</Button>
          </div>
          <div className="space-y-3">
            {form.stats.map((stat, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  className="w-1/3"
                  value={stat.value}
                  onChange={(e) => updateStat(i, 'value', e.target.value)}
                  placeholder="e.g. 5,000+"
                />
                <Input
                  className="flex-1"
                  value={stat.label}
                  onChange={(e) => updateStat(i, 'label', e.target.value)}
                  placeholder="e.g. Customers"
                />
                <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive" onClick={() => removeStat(i)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Contact Info</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="pl-9"
                  placeholder="info@yourstore.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="pl-9"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="pl-9"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 lg:col-span-2"
        >
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Social Links</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                value={form.facebookUrl}
                onChange={(e) => setForm((f) => ({ ...f, facebookUrl: e.target.value }))}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter / X URL</Label>
              <Input
                id="twitter"
                value={form.twitterUrl}
                onChange={(e) => setForm((f) => ({ ...f, twitterUrl: e.target.value }))}
                placeholder="https://x.com/..."
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                value={form.instagramUrl}
                onChange={(e) => setForm((f) => ({ ...f, instagramUrl: e.target.value }))}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
