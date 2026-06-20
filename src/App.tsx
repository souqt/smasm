import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import { MemberProvider } from "@/context/MemberContext";
import LoadingScreen from "./components/LoadingScreen";
import ScrollToTop from "./components/ScrollToTop";
import ChatbotWidget from "./components/ChatbotWidget";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import JobApplication from "./pages/JobApplication";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ExpertisePage from "./pages/ExpertisePage";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import DynamicPage from "./pages/DynamicPage";
import RootDynamicPage from "./pages/RootDynamicPage";
import NotFound from "./pages/NotFound";
import DedicatedDevelopersPage from "./pages/DedicatedDevelopersPage";
import TeamAugmentationPage from "./pages/TeamAugmentationPage";
import ProjectBasedPage from "./pages/ProjectBasedPage";
import ManagedServicesPage from "./pages/ManagedServicesPage";
import ITInfrastructurePage from "./pages/ITInfrastructurePage";
import Store from "./pages/Store";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import MemberAuth from "./pages/MemberAuth";
import Account from "./pages/Account";
import Support from "./pages/Support";
import Directory from "./pages/Directory";
import Portfolio from "./pages/Portfolio";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <AuthProvider>
          <MemberProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AnimatePresence mode="wait">
                {isLoading && (
                  <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
                )}
              </AnimatePresence>
              
              {!isLoading && (
                <>
                  <BrowserRouter>
                    <ScrollToTop />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/store" element={<Store />} />
                      <Route path="/product/:slug" element={<ProductDetails />} />
                      <Route path="/checkout/:productId" element={<Checkout />} />
                      <Route path="/login" element={<MemberAuth />} />
                      <Route path="/register" element={<MemberAuth mode="register" />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/downloads" element={<Account initialTab="downloads" />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/directory" element={<Directory />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/apply/:jobSlug" element={<JobApplication />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/about-us" element={<AboutPage />} />
                      <Route path="/dedicated-developers" element={<DedicatedDevelopersPage />} />
                      <Route path="/team-augmentation" element={<TeamAugmentationPage />} />
                      <Route path="/project-based-development" element={<ProjectBasedPage />} />
                      <Route path="/managed-services" element={<ManagedServicesPage />} />
                      <Route path="/it-infrastructure-setup" element={<ITInfrastructurePage />} />
                      <Route path="/expertise" element={<ExpertisePage />} />
                      
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin/*" element={<Admin />} />
                      <Route path="/page/:slug" element={<DynamicPage />} />
                      <Route path="/:slug" element={<RootDynamicPage />} />
                    </Routes>
                    <ChatbotWidget />
                  </BrowserRouter>
                </>
              )}
            </TooltipProvider>
          </MemberProvider>
        </AuthProvider>
      </DataProvider>
    </QueryClientProvider>
  );
};

export default App;
