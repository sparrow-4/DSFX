import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  LogOut,
  Zap,
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import AboutPage from "@/pages/AboutPage";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AccountPage from "@/pages/account/AccountPage";
import OrdersPage from "@/pages/account/OrdersPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminReportsPage from "@/pages/admin/AdminReportsPage";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

const queryClient = new QueryClient();

// Layout wrapper for store pages (with Navbar/Footer/Cart)
function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// Layout wrapper for admin pages
function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-spark">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-foreground hover:text-primary transition">
                Admin Panel
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/admin"
              className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2"
            >
              <Package className="h-4 w-4" /> Products
            </Link>
            <Link
              to="/admin/orders"
              className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" /> Orders
            </Link>
            <Link
              to="/admin/reports"
              className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" /> Reports
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              Welcome, {user?.name || "Admin"}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />{" "}
              <span className="hidden sm:inline-block">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin routes – no Navbar/Footer */}
          {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProductsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminCategoriesPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminOrdersPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminReportsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Store routes – with Navbar/Footer */}
          <Route
            path="/"
            element={
              <StoreLayout>
                <HomePage />
              </StoreLayout>
            }
          />
          <Route
            path="/login"
            element={
              <StoreLayout>
                <LoginPage />
              </StoreLayout>
            }
          />
          <Route
            path="/register"
            element={
              <StoreLayout>
                <RegisterPage />
              </StoreLayout>
            }
          />
          <Route
            path="/products"
            element={
              <StoreLayout>
                <ProductsPage />
              </StoreLayout>
            }
          />
          <Route
            path="/products/:id"
            element={
              <StoreLayout>
                <ProductDetailPage />
              </StoreLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <StoreLayout>
                <CheckoutPage />
              </StoreLayout>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <StoreLayout>
                <OrderConfirmationPage />
              </StoreLayout>
            }
          />
          <Route
            path="/account"
            element={
              <StoreLayout>
                <AccountPage />
              </StoreLayout>
            }
          />
          <Route
            path="/order/:id"
            element={
              <StoreLayout>
                <OrderTrackingPage />
              </StoreLayout>
            }
          />
          <Route
            path="/account/orders"
            element={
              <StoreLayout>
                <OrdersPage />
              </StoreLayout>
            }
          />
          <Route
            path="/about"
            element={
              <StoreLayout>
                <AboutPage />
              </StoreLayout>
            }
          />
          <Route
            path="*"
            element={
              <StoreLayout>
                <NotFound />
              </StoreLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
