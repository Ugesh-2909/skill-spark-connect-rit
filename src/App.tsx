import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Achievements from "./pages/Achievements";
import Leaderboard from "./pages/Leaderboard";
import Projects from "./pages/Projects";
import Network from "./pages/Network";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Admin from "./pages/Admin";
import Faculty from "./pages/Faculty";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/" element={<Index />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/network" element={<Network />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
