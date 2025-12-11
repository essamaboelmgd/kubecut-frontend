import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Settings2, 
  FolderKanban, 
  ShoppingCart, 
  ShoppingBag,
  ClipboardList,
  User, 
  LogOut,
  Menu,
  ChefHat,
  X
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
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

const sidebarItems = [
  { icon: LayoutDashboard, label: 'لوحة التحكم', href: '/dashboard' },
  { icon: Settings2, label: 'إعدادات التقطيع', href: '/dashboard/cutting-settings' },
  { icon: FolderKanban, label: 'المشاريع', href: '/dashboard/projects' },
  { icon: ShoppingCart, label: 'المتجر', href: '/dashboard/store' },
  { icon: ShoppingBag, label: 'السلة', href: '/dashboard/cart', showBadge: true },
  { icon: ClipboardList, label: 'الطلبات', href: '/dashboard/orders' },
  { icon: User, label: 'إعدادات الحساب', href: '/dashboard/account' },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const cartCount = getCartCount();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userInitials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || 'مس';

  return (
    <div className="flex min-h-screen font-cairo">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 transform border-l border-border bg-sidebar transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ChefHat className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">قطّع</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/dashboard'}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
                activeClassName="bg-sidebar-accent text-primary font-medium"
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.showBadge && cartCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-sidebar-border p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              <span>تسجيل خروج</span>
            </Button>
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
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
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
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
