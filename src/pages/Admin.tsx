import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, FileText, Briefcase, Users, Settings, 
  Image, Menu, X, Layers, BookOpen, Building2, ChevronLeft,
  Bell, Search, Moon, Sun, Upload, Home, LogOut, UserCog,
  Navigation, FileCode, Cpu, MessageSquare, Globe, HelpCircle, ShoppingBag, Ticket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Admin Components
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminSlider from "@/components/admin/AdminSlider";
import AdminServices from "@/components/admin/AdminServices";
import AdminJobs from "@/components/admin/AdminJobs";
import AdminApplications from "@/components/admin/AdminApplications";
import AdminBlogs from "@/components/admin/AdminBlogs";
import AdminBrands from "@/components/admin/AdminBrands";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminMedia from "@/components/admin/AdminMedia";
import AdminPages from "@/components/admin/AdminPages";
import AdminMenus from "@/components/admin/AdminMenus";
import AdminAdmins from "@/components/admin/AdminAdmins";
import AdminExpertise from "@/components/admin/AdminExpertise";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminServicesPageBlocks from "@/components/admin/AdminServicesPageBlocks";
import AdminExpertisePageBlocks from "@/components/admin/AdminExpertisePageBlocks";
import AdminAboutPageBlocks from "@/components/admin/AdminAboutPageBlocks";
import AdminDynamicPageBlocks from "@/components/admin/AdminDynamicPageBlocks";
import { AdminDedicatedDevelopersBlocks, AdminTeamAugmentationBlocks, AdminProjectBasedBlocks, AdminManagedServicesBlocks, AdminITInfrastructureBlocks } from "@/components/admin/AdminServiceSubPageBlocks";
import AdminWhyEgyptBlocks from "@/components/admin/AdminWhyEgyptBlocks";
import AdminCareersPageBlocks from "@/components/admin/AdminCareersPageBlocks";
import AdminJobApplicationBlocks from "@/components/admin/AdminJobApplicationBlocks";
import AdminContactFaqs from "@/components/admin/AdminContactFaqs";
import AdminStore from "@/components/admin/AdminStore";
import AdminSupportDesk from "@/components/admin/AdminSupportDesk";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, color: "text-blue-500", permission: "dashboard" as const },
  { name: "Home Builder", href: "/admin/home-page", icon: Home, color: "text-teal-500", permission: "home" as const },
  { name: "Store", href: "/admin/store", icon: ShoppingBag, color: "text-emerald-500", permission: "store" as const },
  { name: "Support Tickets", href: "/admin/support", icon: Ticket, color: "text-amber-500", permission: "support" as const },
  { name: "Slider", href: "/admin/slider", icon: Image, color: "text-purple-500", permission: "slider" as const },
  { name: "Services", href: "/admin/services", icon: Layers, color: "text-green-500", permission: "services" as const },
  { name: "Services Page", href: "/admin/services-page", icon: FileCode, color: "text-green-400", permission: "services" as const },
  { name: "Expertise", href: "/admin/expertise", icon: Cpu, color: "text-cyan-500", permission: "services" as const },
  { name: "Expertise Page", href: "/admin/expertise-page", icon: FileCode, color: "text-cyan-400", permission: "services" as const },
  { name: "About Us Page", href: "/admin/about-page", icon: FileCode, color: "text-teal-400", permission: "services" as const },
  { name: "Why Egypt Section", href: "/admin/why-egypt", icon: Globe, color: "text-sky-400", permission: "services" as const },
  { name: "Dedicated Developers", href: "/admin/dedicated-developers-page", icon: FileCode, color: "text-emerald-400", permission: "services" as const },
  { name: "Team Augmentation", href: "/admin/team-augmentation-page", icon: FileCode, color: "text-lime-400", permission: "services" as const },
  { name: "Project-Based Dev", href: "/admin/project-based-page", icon: FileCode, color: "text-yellow-400", permission: "services" as const },
  { name: "Managed Services", href: "/admin/managed-services-page", icon: FileCode, color: "text-amber-400", permission: "services" as const },
  { name: "IT Infrastructure", href: "/admin/it-infrastructure-page", icon: FileCode, color: "text-red-400", permission: "services" as const },
  { name: "Contact FAQs", href: "/admin/contact-faqs", icon: HelpCircle, color: "text-indigo-400", permission: "settings" as const },
  
  { name: "Messages", href: "/admin/messages", icon: MessageSquare, color: "text-emerald-500", permission: "applications" as const },
  { name: "Blog Posts", href: "/admin/blogs", icon: BookOpen, color: "text-cyan-500", permission: "blogs" as const },
  { name: "Brands", href: "/admin/brands", icon: Building2, color: "text-amber-500", permission: "brands" as const },
  { name: "Media", href: "/admin/media", icon: Upload, color: "text-indigo-500", permission: "media" as const },
  { name: "Pages", href: "/admin/pages", icon: FileCode, color: "text-teal-500", permission: "pages" as const },
  { name: "Menus", href: "/admin/menus", icon: Navigation, color: "text-rose-500", permission: "menus" as const },
  { name: "Admins", href: "/admin/admins", icon: UserCog, color: "text-violet-500", permission: "admins" as const },
  { name: "Settings", href: "/admin/settings", icon: Settings, color: "text-gray-500", permission: "settings" as const },
];

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useData();
  const { currentAdmin, isAuthenticated, logout, hasPermission } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  // Filter links based on permissions
  const filteredLinks = sidebarLinks.filter(link => hasPermission(link.permission));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/50 h-16">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-primary/10"
            >
              <Menu size={22} />
            </Button>
            <div className="flex items-center gap-2">
              {data.settings.logo && (
                <img src={data.settings.logo} alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
              )}
              <span className="font-heading font-bold text-lg">Admin</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  {currentAdmin?.avatar ? (
                    <AvatarImage src={currentAdmin.avatar} />
                  ) : null}
                  <AvatarFallback className="bg-primary/20 text-primary font-medium">
                    {currentAdmin?.displayName?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{currentAdmin?.displayName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full bg-card/95 backdrop-blur-xl border-r border-border/50 
        transform transition-all duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
      `}>
        {/* Logo Section */}
        <div className={`h-16 border-b border-border/50 flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-6'}`}>
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center gap-3 group">
              {data.settings.logo && (
                <img 
                  src={data.settings.logo} 
                  alt="Logo" 
                  className="h-10 w-10 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform" 
                />
              )}
              <div>
                <h1 className="font-heading font-bold text-foreground">{data.settings.siteName}</h1>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hidden lg:flex hover:bg-primary/10 rounded-xl"
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden hover:bg-primary/10"
          >
            <X size={22} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {!sidebarCollapsed && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Main Menu</p>
            </div>
          )}
          
          {filteredLinks.map((link) => {
            const isActive = location.pathname === link.href || 
              (link.href !== '/admin' && location.pathname.startsWith(link.href + '/'));
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}
                `}
                title={sidebarCollapsed ? link.name : undefined}
              >
                <link.icon 
                  size={22} 
                  className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? '' : link.color}`} 
                />
                {!sidebarCollapsed && (
                  <span className="font-medium">{link.name}</span>
                )}
                {isActive && !sidebarCollapsed && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-6 bg-primary-foreground/30 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 border-t border-border/50 bg-card/50 backdrop-blur-sm`}>
          <Link
            to="/"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground 
              hover:bg-muted/80 hover:text-foreground transition-all
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <Home size={20} />
            {!sidebarCollapsed && <span className="font-medium">Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`
        transition-all duration-300 pt-16 lg:pt-0 min-h-screen
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
      `}>
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 border-b border-border/50 bg-card/50 backdrop-blur-xl items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-72 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xl"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-xl hover:bg-muted/80"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-muted/80">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </Button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-border/50">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{currentAdmin?.displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {currentAdmin?.role === 'super_admin' ? 'Super Admin' : 
                   currentAdmin?.role === 'admin' ? 'Admin' : 'Editor'}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20 cursor-pointer">
                    {currentAdmin?.avatar ? (
                      <AvatarImage src={currentAdmin.avatar} />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-semibold">
                      {currentAdmin?.displayName?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{currentAdmin?.displayName}</p>
                      <p className="text-xs text-muted-foreground">{currentAdmin?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="home-page" element={
              <AdminPageBlocks
                pageKey="home"
                pageTitle="Home Page Builder"
                pageDescription="Edit extra homepage sections that appear under the Telgawy store homepage."
                defaultBlocks={[
                  {
                    id: "home-cta",
                    type: "cta-banner",
                    order: 1,
                    title: "ابدأ مشروعك مع تلجاوي",
                    description: "<p>أضف هنا أي عرض أو قسم جديد تريد ظهوره في الصفحة الرئيسية.</p>",
                    buttonText: "فتح تذكرة",
                    buttonLink: "/support",
                    secondaryButtonText: "تصفح المتجر",
                    secondaryButtonLink: "/store",
                    backgroundColor: "dark"
                  }
                ]}
              />
            } />
            <Route path="store" element={<AdminStore />} />
            <Route path="support" element={<AdminSupportDesk />} />
            <Route path="slider" element={<AdminSlider />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="services-page" element={<AdminServicesPageBlocks />} />
            <Route path="expertise" element={<AdminExpertise />} />
            <Route path="expertise-page" element={<AdminExpertisePageBlocks />} />
            <Route path="about-page" element={<AdminAboutPageBlocks />} />
            <Route path="why-egypt" element={<AdminWhyEgyptBlocks />} />
            <Route path="dedicated-developers-page" element={<AdminDedicatedDevelopersBlocks />} />
            <Route path="team-augmentation-page" element={<AdminTeamAugmentationBlocks />} />
            <Route path="project-based-page" element={<AdminProjectBasedBlocks />} />
            <Route path="managed-services-page" element={<AdminManagedServicesBlocks />} />
            <Route path="it-infrastructure-page" element={<AdminITInfrastructureBlocks />} />
            <Route path="careers-page" element={<AdminCareersPageBlocks />} />
            <Route path="contact-faqs" element={<AdminContactFaqs />} />
            <Route path="jobs/:jobId/blocks" element={<AdminJobApplicationBlocks />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="pages/:slug/blocks" element={<AdminDynamicPageBlocks />} />
            <Route path="menus" element={<AdminMenus />} />
            <Route path="admins" element={<AdminAdmins />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Admin;
