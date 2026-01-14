import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import CuttingSettings from "./pages/dashboard/CuttingSettings";
import Projects from "./pages/dashboard/Projects";
import NewProject from "./pages/dashboard/NewProject";
import ProjectDetails from "./pages/dashboard/ProjectDetails";
import UnitDetails from "./pages/dashboard/UnitDetails";
import Store from "./pages/dashboard/Store";
import Cart from "./pages/dashboard/Cart";
import Checkout from "./pages/dashboard/Checkout";
import Orders from "./pages/dashboard/Orders";
import Sales from "./pages/dashboard/Sales";
import Users from "./pages/dashboard/Users";
import AccountSettings from "./pages/dashboard/AccountSettings";
import NotFound from "./pages/NotFound";
import ProductManagement from "./pages/dashboard/ProductManagement";
import Ads from "./pages/dashboard/Ads";
import StoreItemDetails from "./pages/dashboard/StoreItemDetails";
import WalletHistory from "./pages/dashboard/WalletHistory";
import TokenRequests from "./pages/dashboard/TokenRequests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="cutting-settings" element={<CuttingSettings />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/new" element={<NewProject />} />
                  <Route path="projects/:id" element={<ProjectDetails />} />
                  <Route path="units/:id" element={<UnitDetails />} />
                  <Route path="store" element={<Store />} />
                  <Route path="store/:id" element={<StoreItemDetails />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="sales" element={<Sales />} />
                  <Route path="my-products" element={<ProductManagement />} />
                  <Route path="ads-management" element={<Ads />} />
                  <Route path="users" element={<Users />} />
                  <Route path="account" element={<AccountSettings />} />
                  <Route path="wallet-history" element={<WalletHistory />} />
                  <Route path="token-requests" element={<TokenRequests />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
