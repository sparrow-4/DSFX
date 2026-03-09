import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 pb-20 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="font-display text-3xl font-bold text-foreground">Your Account</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-1 border border-border bg-card rounded-xl p-6 h-fit text-center">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="mx-auto h-24 w-24 rounded-full object-cover mb-4 border-2 border-primary" />
            ) : (
              <div className="mx-auto h-24 w-24 rounded-full bg-secondary flex items-center justify-center mb-4 border-2 border-primary">
                <span className="font-display text-3xl font-bold text-foreground">{user.name.charAt(0)}</span>
              </div>
            )}
            <h2 className="font-display text-xl font-bold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">{user.email}</p>
            <Button variant="destructive" className="w-full" onClick={logout}>
              Log Out
            </Button>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 grid gap-6 sm:grid-cols-2">
            <Link to="/account/orders" className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 transition-colors hover:border-primary">
              <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                <img src="https://img.icons8.com/m_outlined/200/FFFFFF/open-box.png" alt="Orders" className="h-10 w-10 opacity-80" />
              </div>
              <div className="text-center">
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary">Your Orders</h3>
                <p className="text-sm text-muted-foreground">Track, return, or buy things again</p>
              </div>
            </Link>

            <Link to="/account" className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 transition-colors hover:border-primary">
              <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                <img src="https://img.icons8.com/m_outlined/200/FFFFFF/user-menu-male.png" alt="Profile" className="h-10 w-10 opacity-80" />
              </div>
              <div className="text-center">
                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary">Login & Security</h3>
                <p className="text-sm text-muted-foreground">Edit login, name, and mobile number</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
