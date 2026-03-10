import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useAdminStore } from "@/store/adminStore";
import { toast } from "sonner";
import { ArrowLeft, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser, adminLogin } from "@/lib/api";
import React, { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const adminLoginStore = useAdminStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"customer" | "admin">("customer");

  // Customer fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Admin fields
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const redirectParams = searchParams.get("redirect") || "/";

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      login(data.user.email, data.token);
      toast.success("Successfully logged in!");
      navigate(redirectParams);
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await adminLogin(adminUsername, adminPassword);
      adminLoginStore(result.token, result.username);
      toast.success("Admin logged in!");
      navigate("/admin");
    } catch (err: any) {
      toast.error(err.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center relative">
          <Button variant="ghost" size="sm" asChild className="absolute -left-4 -top-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <br />
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {tab === "customer" ? "Log in to manage your orders" : "Admin access only"}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setTab("customer")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "customer"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setTab("admin")}
            className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
              tab === "admin"
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin
          </button>
        </div>

        {/* Customer Login Form */}
        {tab === "customer" && (
          <form onSubmit={handleCustomerLogin} className="space-y-4">
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
                />
              </div>
            </div>
            <Button type="submit" className="w-full font-display" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        )}

        {/* Admin Login Form */}
        {tab === "admin" && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-username"
                  placeholder="admin"
                  className="pl-9"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full font-display" disabled={loading}>
              {loading ? "Logging in..." : "Admin Login"}
            </Button>
          </form>
        )}

        {/* Footer */}
        {tab === "customer" && (
          <div className="flex justify-center flex-col gap-2 items-center mt-2">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to={`/register?redirect=${redirectParams}`}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
