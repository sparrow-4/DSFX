import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Building, Map, Hash, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchMyProfile, updateMyProfile } from '@/lib/api';
import { toast } from 'sonner';

export default function ProfileSettingsPage() {
  const { user, isAuthenticated, token, updateUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyProfile()
        .then(data => {
          setFormData({
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            pincode: data.pincode || '',
          });
          // Also sync with global store just in case
          updateUser(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch profile:', err);
          toast.error('Failed to load profile data');
          setIsLoading(false);
        });
    }
  }, [isAuthenticated, token, updateUser]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedUser = await updateMyProfile(formData);
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 pb-20 max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground">
              <Link to="/account">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Account
              </Link>
            </Button>
            <h1 className="font-display text-3xl font-bold text-foreground">Login & Security</h1>
            <p className="text-muted-foreground mt-2">Manage your personal information and address details.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-8 animate-pulse">
            <div className="h-8 w-1/3 bg-secondary rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-secondary rounded"></div>
              <div className="h-10 bg-secondary rounded"></div>
              <div className="h-10 bg-secondary rounded"></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details Section */}
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Personal Details
              </h2>
              <div className="grid gap-6">
                <div>
                  <Label htmlFor="email" className="text-muted-foreground">Email Address (Cannot be changed)</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="pl-9 bg-secondary/50 cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Details Section */}
            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Shipping Address
              </h2>
              <div className="grid gap-6">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, Apt 4B"
                    className="mt-2"
                  />
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <div className="relative mt-2">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Los Angeles"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <div className="relative mt-2">
                      <Map className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="CA"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN/ZIP Code</Label>
                    <div className="relative mt-2">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="90001"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving} className="min-w-[150px]">
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
