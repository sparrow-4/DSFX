import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUser } from '@/lib/api';
import React, { useState } from 'react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const redirectParams = searchParams.get('redirect') || '/';

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await registerUser({ name, email, password });
      login(data.user, data.token);
      toast.success('Account created successfully!');
      navigate(redirectParams);
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 pt-24">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center relative">
          <Button variant="ghost" size="sm" asChild className="absolute -left-4 -top-4">
            <Link to={`/login?redirect=${redirectParams}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>
          <br/>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">Create Account</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign up to track your orders easily</p>
        </div>

        <form onSubmit={handleManualRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                className="pl-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          <Button type="submit" className="w-full font-display" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="flex justify-center flex-col gap-2 items-center mt-6">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to={`/login?redirect=${redirectParams}`} className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
