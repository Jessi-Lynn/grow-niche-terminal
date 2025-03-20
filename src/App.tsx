
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { useAuth } from "@/contexts/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Blueprints from "./pages/Blueprints";
import BlueprintDetails from "./pages/BlueprintDetails";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Team from "./pages/Team";
import Courses from "./pages/Courses";
import Tools from "./pages/Tools";
import Login from "./pages/Login";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-terminal-black flex items-center justify-center text-terminal-white">
        <p>Verifying authentication...</p>
      </div>
    );
  }
  
  if (!user) {
    console.log("Access denied: User not logged in");
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    console.log("Access denied: User is not an admin");
    return <Navigate to="/login" replace />;
  }
  
  console.log("Access granted: User is authenticated and has admin privileges");
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/blueprints" element={<Blueprints />} />
    <Route path="/blueprints/:slug" element={<BlueprintDetails />} />
    <Route path="/services" element={<Services />} />
    <Route path="/team" element={<Team />} />
    <Route path="/courses" element={<Courses />} />
    <Route path="/tools" element={<Tools />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/login" element={<Login />} />
    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
