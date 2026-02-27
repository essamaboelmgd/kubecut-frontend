import { useState, useEffect } from 'react';
import { Navigate, useLocation, Link, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Settings2,
  FolderKanban,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Users,
  Wallet,
  Package,
  Megaphone,
  FileText,
  LucideIcon
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { cn } from '@/lib/utils';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  showBadge?: boolean;
  adminOnly?: boolean;
}

interface SidebarCategory {
  title: string;
  items: SidebarItem[];
}

const sidebarCategories: SidebarCategory[] = [
  {
    title: 'رئيسي',
    items: [
      { icon: LayoutDashboard, label: 'لوحة التحكم', href: '/dashboard' },
      { icon: FolderKanban, label: 'المشاريع', href: '/dashboard/projects' },
      { icon: Settings2, label: 'إعدادات التقطيع', href: '/dashboard/cutting-settings' },
      { icon: Megaphone, label: 'إدارة الإعلانات', href: '/dashboard/ads-management', adminOnly: true },
    ]
  },
  {
    title: 'التجارة',
    items: [
      { icon: ShoppingCart, label: 'المتجر', href: '/dashboard/store' },
      // { icon: ShoppingBag, label: 'السلة', href: '/dashboard/cart', showBadge: true },
      // { icon: ClipboardList, label: 'الطلبات', href: '/dashboard/orders' },
      // { icon: TrendingUp, label: 'المبيعات', href: '/dashboard/sales' },
      { icon: Package, label: 'إدارة منتجاتي', href: '/dashboard/my-products' },
    ]
  },
  {
    title: 'الحساب',
    items: [
      { icon: Users, label: 'المستخدمين', href: '/dashboard/users', adminOnly: true },
      { icon: FileText, label: 'طلبات الشحن', href: '/dashboard/token-requests', adminOnly: true },
      { icon: User, label: 'إعدادات الحساب', href: '/dashboard/account' },
    ]
  }
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const cartCount = getCartCount();

  // Public store paths - accessible without login
  const isPublicStorePath = location.pathname === '/dashboard/store';

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated && !isPublicStorePath) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Guest layout for public store
  if (!isAuthenticated && isPublicStorePath) {
    return (
      <div className="flex min-h-screen flex-col font-cairo">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/20">
              <img src="/logo.png" alt="Logo" className="h-6 w-6 object-contain brightness-0 invert" />
            </div>
            <span className="text-lg font-bold">كيوب كت</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">تسجيل الدخول</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/register">إنشاء حساب</Link>
            </Button>
          </div>
        </header>
        <main className="flex-1 w-full overflow-x-hidden p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    );
  }

  const userInitials = user?.full_name
    ? user.full_name.slice(0, 2).toUpperCase()
    : 'مس';

  return (
    <div className="flex min-h-screen font-cairo overflow-x-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 border-l border-white/10 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-2xl transition-transform duration-300 lg:relative lg:translate-x-0 shadow-2xl",
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-24 items-center justify-between px-6">
            <Link to="/dashboard" className="flex items-center gap-4 group">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40">
                <img src="/logo.png" alt="Logo" className="h-7 w-7 object-contain brightness-0 invert" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">كيوب كت</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Dashboard</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-6 p-4 overflow-y-auto custom-scrollbar">
            {sidebarCategories.map((category, index) => (
              <div key={index} className="space-y-1">
                <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2 font-mono">
                  {category.title}
                </h3>
                {category.items.map((item) => {
                  if (item.adminOnly && user?.role !== 'admin') return null;

                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.href === '/dashboard'}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                        )
                      }
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <item.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110")} />
                      <span className="relative z-10">{item.label}</span>
                      {item.showBadge && cartCount > 0 && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-sm ring-2 ring-background">
                          {cartCount}
                        </span>
                      )}
                      {/* Active Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Profile Snippet */}
          <div className="p-4 mt-auto">
            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-card/50 to-card/30 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <div className="flex items-center gap-3 relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-105">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-sm font-bold text-foreground/90">{user?.full_name || 'مستخدم'}</span>
                  <span className="truncate text-xs text-muted-foreground">{user?.phone}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                className="mt-3 w-full justify-start h-9 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors relative z-10"
                onClick={logout}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                تسجيل خروج
              </Button>
              {/* Background Decoration */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            {/* Wallet Widget */}
            <Link to="/dashboard/wallet-history">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer group">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 group-hover:bg-amber-500/30 transition-colors">
                  <Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex flex-col items-start pr-1">
                  <span className="text-[10px] text-muted-foreground leading-none">الرصيد</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 leading-none mt-0.5">
                    {user?.wallet_balance ?? 0} توكن
                  </span>
                </div>
              </div>
            </Link>

            <Link to="/dashboard/wallet-history" className="md:hidden">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Wallet className="h-5 w-5" />
              </div>
            </Link>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary p-0 text-sm font-bold text-primary-foreground"
                >
                  {userInitials}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="font-medium">{user?.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user?.phone}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/account" className="cursor-pointer">
                    <User className="ml-2 h-4 w-4" />
                    الإعدادات
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  تسجيل خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 w-full overflow-x-hidden p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
