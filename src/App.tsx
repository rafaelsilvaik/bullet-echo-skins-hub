
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import RequireAuth from "./components/auth/RequireAuth";

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Heroes from "./pages/Heroes";
import HeroDetail from "./pages/HeroDetail";
import HeroEdit from "./pages/HeroEdit";
import Checklist from "./pages/Checklist";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/heroes" element={<Heroes />} />
                <Route path="/hero/:id" element={<HeroDetail />} />
                <Route path="/hero/:id/edit" element={
                  <RequireAuth>
                    <HeroEdit />
                  </RequireAuth>
                } />
                <Route path="/checklist" element={
                  <RequireAuth>
                    <Checklist />
                  </RequireAuth>
                } />
                <Route path="/chat" element={
                  <RequireAuth>
                    <Chat />
                  </RequireAuth>
                } />
                <Route path="/admin" element={
                  <RequireAuth requireAdmin={true}>
                    <Admin />
                  </RequireAuth>
                } />
                <Route path="/profile" element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
