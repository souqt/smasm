import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SiteData, Job, BlogPost, JobApplication, Service, Slide, Brand, NavLink, Technology, Stat, Benefit, DynamicPage, AdminUser, ExpertiseSection, ContentBlock } from '@/data/types';

import { initialData } from '@/data/initialData';
import { api, uploadFile } from '@/lib/api';

interface DataContextType {
  data: SiteData;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  // Settings
  updateSettings: (settings: Partial<SiteData['settings']>) => Promise<void>;
  // Navigation
  updateNavLinks: (links: NavLink[]) => Promise<void>;
  // Slides
  addSlide: (slide: Omit<Slide, 'id'>) => Promise<void>;
  updateSlide: (id: string, slide: Partial<Slide>) => Promise<void>;
  deleteSlide: (id: string) => Promise<void>;
  // Brands
  addBrand: (brand: Omit<Brand, 'id'>) => Promise<void>;
  updateBrand: (id: string, brand: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  // Services
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  // Technologies
  addTechnology: (tech: Omit<Technology, 'id'>) => Promise<void>;
  updateTechnology: (id: string, tech: Partial<Technology>) => Promise<void>;
  deleteTechnology: (id: string) => Promise<void>;
  // Stats
  addStat: (stat: Omit<Stat, 'id'>) => Promise<void>;
  updateStat: (id: string, stat: Partial<Stat>) => Promise<void>;
  deleteStat: (id: string) => Promise<void>;
  updateStats: (stats: Stat[]) => Promise<void>;
  // Expertise Sections
  addExpertiseSection: (section: Omit<ExpertiseSection, 'id'>) => Promise<void>;
  updateExpertiseSection: (id: string, section: Partial<ExpertiseSection>) => Promise<void>;
  deleteExpertiseSection: (id: string) => Promise<void>;
  // Benefits
  addBenefit: (benefit: Omit<Benefit, 'id'>) => Promise<void>;
  updateBenefit: (id: string, benefit: Partial<Benefit>) => Promise<void>;
  deleteBenefit: (id: string) => Promise<void>;
  // Jobs
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<void>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  // Applications
  addApplication: (application: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>) => Promise<void>;
  updateApplicationStatus: (id: string, status: JobApplication['status']) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  // Blogs
  addBlog: (blog: Omit<BlogPost, 'id' | 'slug'>) => Promise<void>;
  updateBlog: (id: string, blog: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  // Contact
  updateContact: (contact: Partial<SiteData['contact']>) => Promise<void>;
  // Pages
  addPage: (page: Omit<DynamicPage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePage: (id: string, page: Partial<DynamicPage>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  // Admins
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => Promise<void>;
  updateAdmin: (id: string, admin: Partial<AdminUser>) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
  // Export/Import
  exportData: () => string;
  importData: (jsonString: string) => Promise<boolean>;
  resetData: () => Promise<void>;
  // Upload
  uploadFile: (file: File, category?: string) => Promise<{ success: boolean; url: string; filename: string }>;
  // Page Blocks
  getPageBlocks: (pageKey: string) => ContentBlock[];
  savePageBlocks: (pageKey: string, blocks: ContentBlock[]) => Promise<void>;
}

// Keep a stable Context identity across Vite HMR updates.
// Without this, provider and consumers can end up using different Context instances,
// causing `useData must be used within a DataProvider` even when wrapped correctly.
const globalAny = globalThis as unknown as {
  __LOVABLE_DATA_CONTEXT__?: React.Context<DataContextType | undefined>;
};

export const DataContext: React.Context<DataContextType | undefined> =
  globalAny.__LOVABLE_DATA_CONTEXT__ ?? createContext<DataContextType | undefined>(undefined);

globalAny.__LOVABLE_DATA_CONTEXT__ = DataContext;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(initialData);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API on initial mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await api.getAllData();
        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error('Failed to load data from API:', error);
        // Fallback to initial data if API fails
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Refresh data from API
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await api.getAllData();
      if (result) {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Settings
  const updateSettings = async (settings: Partial<SiteData['settings']>) => {
    const updated = { ...data.settings, ...settings };
    setData(prev => ({ ...prev, settings: updated }));
    try {
      await api.updateSettings(updated);
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  // Navigation - Full sync with API
  const updateNavLinks = async (links: NavLink[]) => {
    setData(prev => ({ ...prev, navLinks: links }));
    try {
      // Get current links from server (returns tree structure)
      const currentLinks = await api.getNavLinks();
      const currentAllIds = new Set(getAllLinkIds(currentLinks));
      const newIds = new Set(getAllLinkIds(links));
      
      // Delete removed links (check all levels, not just top)
      const currentFlat = flattenLinks(currentLinks);
      for (const link of currentFlat) {
        if (!newIds.has(link.id)) {
          await api.deleteNavLink(link.id);
        }
      }
      
      // Add or update links
      const flatLinks = flattenLinks(links);
      for (const link of flatLinks) {
        if (currentAllIds.has(link.id)) {
          await api.updateNavLink(link.id, link);
        } else {
          await api.addNavLink(link);
        }
      }
      
      // Refresh to get server state
      await refreshData();
    } catch (error) {
      console.error('Failed to update nav links:', error);
      await refreshData();
    }
  };
  
  // Helper to get all link IDs including nested
  const getAllLinkIds = (links: NavLink[]): string[] => {
    const ids: string[] = [];
    for (const link of links) {
      ids.push(link.id);
      if (link.children) {
        ids.push(...getAllLinkIds(link.children));
      }
    }
    return ids;
  };
  
  // Helper to flatten nested links for API calls
  const flattenLinks = (links: NavLink[], parentId?: string, order: number = 0): any[] => {
    const result: any[] = [];
    links.forEach((link, index) => {
      result.push({
        ...link,
        parentId: parentId || null,
        order: order + index
      });
      if (link.children) {
        result.push(...flattenLinks(link.children, link.id, (order + index) * 100));
      }
    });
    return result;
  };

  // Slides
  const addSlide = async (slide: Omit<Slide, 'id'>) => {
    const newSlide = { ...slide, id: generateId() };
    setData(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
    try {
      await api.addSlide(slide);
    } catch (error) {
      console.error('Failed to add slide:', error);
    }
  };

  const updateSlide = async (id: string, slide: Partial<Slide>) => {
    setData(prev => ({
      ...prev,
      slides: prev.slides.map(s => s.id === id ? { ...s, ...slide } : s)
    }));
    try {
      await api.updateSlide(id, slide);
    } catch (error) {
      console.error('Failed to update slide:', error);
    }
  };

  const deleteSlide = async (id: string) => {
    setData(prev => ({
      ...prev,
      slides: prev.slides.filter(s => s.id !== id)
    }));
    try {
      await api.deleteSlide(id);
    } catch (error) {
      console.error('Failed to delete slide:', error);
    }
  };

  // Brands
  const addBrand = async (brand: Omit<Brand, 'id'>) => {
    const newBrand = { ...brand, id: generateId() };
    setData(prev => ({
      ...prev,
      brands: [...prev.brands, newBrand]
    }));
    try {
      await api.addBrand(brand);
    } catch (error) {
      console.error('Failed to add brand:', error);
    }
  };

  const updateBrand = async (id: string, brand: Partial<Brand>) => {
    setData(prev => ({
      ...prev,
      brands: prev.brands.map(b => b.id === id ? { ...b, ...brand } : b)
    }));
    try {
      await api.updateBrand(id, brand);
    } catch (error) {
      console.error('Failed to update brand:', error);
    }
  };

  const deleteBrand = async (id: string) => {
    setData(prev => ({
      ...prev,
      brands: prev.brands.filter(b => b.id !== id)
    }));
    try {
      await api.deleteBrand(id);
    } catch (error) {
      console.error('Failed to delete brand:', error);
    }
  };

  // Services
  const addService = async (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: generateId() };
    setData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
    try {
      await api.addService(service);
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  };

  const updateService = async (id: string, service: Partial<Service>) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...service } : s)
    }));
    try {
      await api.updateService(id, service);
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const deleteService = async (id: string) => {
    setData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
    try {
      await api.deleteService(id);
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  // Technologies
  const addTechnology = async (tech: Omit<Technology, 'id'>) => {
    const newTech = { ...tech, id: generateId() };
    setData(prev => ({
      ...prev,
      technologies: [...prev.technologies, newTech]
    }));
    try {
      await api.addTechnology(tech);
    } catch (error) {
      console.error('Failed to add technology:', error);
    }
  };

  const updateTechnology = async (id: string, tech: Partial<Technology>) => {
    setData(prev => ({
      ...prev,
      technologies: prev.technologies.map(t => t.id === id ? { ...t, ...tech } : t)
    }));
    try {
      await api.updateTechnology(id, tech);
    } catch (error) {
      console.error('Failed to update technology:', error);
    }
  };

  const deleteTechnology = async (id: string) => {
    setData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t.id !== id)
    }));
    try {
      await api.deleteTechnology(id);
    } catch (error) {
      console.error('Failed to delete technology:', error);
    }
  };

  // Stats - with individual CRUD
  const addStat = async (stat: Omit<Stat, 'id'>) => {
    const newStat = { ...stat, id: generateId() };
    setData(prev => ({
      ...prev,
      stats: [...prev.stats, newStat]
    }));
    try {
      await api.addStat(stat);
      // Refresh to get server ID
      await refreshData();
    } catch (error) {
      console.error('Failed to add stat:', error);
    }
  };

  const updateStat = async (id: string, stat: Partial<Stat>) => {
    setData(prev => ({
      ...prev,
      stats: prev.stats.map(s => s.id === id ? { ...s, ...stat } : s)
    }));
    try {
      await api.updateStat(id, stat);
    } catch (error) {
      console.error('Failed to update stat:', error);
    }
  };

  const deleteStat = async (id: string) => {
    setData(prev => ({
      ...prev,
      stats: prev.stats.filter(s => s.id !== id)
    }));
    try {
      await api.deleteStat(id);
    } catch (error) {
      console.error('Failed to delete stat:', error);
    }
  };

  const updateStats = async (stats: Stat[]) => {
    setData(prev => ({ ...prev, stats }));
    // Stats are updated individually now
  };

  // Expertise Sections - with immediate refresh from server
  const addExpertiseSection = async (section: Omit<ExpertiseSection, 'id'>) => {
    try {
      await api.addExpertiseSection(section);
      // Refresh data from server to get correct ID
      await refreshData();
    } catch (error) {
      console.error('Failed to add expertise section:', error);
      throw error;
    }
  };

  const updateExpertiseSection = async (id: string, section: Partial<ExpertiseSection>) => {
    // Optimistic update
    setData(prev => ({
      ...prev,
      expertiseSections: (prev.expertiseSections || []).map(s => s.id === id ? { ...s, ...section } : s)
    }));
    try {
      await api.updateExpertiseSection(id, section);
    } catch (error) {
      console.error('Failed to update expertise section:', error);
      // Refresh to restore correct state
      await refreshData();
      throw error;
    }
  };

  const deleteExpertiseSection = async (id: string) => {
    // Optimistic update
    setData(prev => ({
      ...prev,
      expertiseSections: (prev.expertiseSections || []).filter(s => s.id !== id)
    }));
    try {
      await api.deleteExpertiseSection(id);
    } catch (error) {
      console.error('Failed to delete expertise section:', error);
      // Refresh to restore correct state
      await refreshData();
      throw error;
    }
  };

  // Benefits
  const addBenefit = async (benefit: Omit<Benefit, 'id'>) => {
    const newBenefit = { ...benefit, id: generateId() };
    setData(prev => ({
      ...prev,
      benefits: [...prev.benefits, newBenefit]
    }));
    try {
      await api.addBenefit(benefit);
    } catch (error) {
      console.error('Failed to add benefit:', error);
    }
  };

  const updateBenefit = async (id: string, benefit: Partial<Benefit>) => {
    setData(prev => ({
      ...prev,
      benefits: prev.benefits.map(b => b.id === id ? { ...b, ...benefit } : b)
    }));
    try {
      await api.updateBenefit(id, benefit);
    } catch (error) {
      console.error('Failed to update benefit:', error);
    }
  };

  const deleteBenefit = async (id: string) => {
    setData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b.id !== id)
    }));
    try {
      await api.deleteBenefit(id);
    } catch (error) {
      console.error('Failed to delete benefit:', error);
    }
  };

  // Jobs
  const addJob = async (job: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob = { 
      ...job, 
      id: generateId(), 
      createdAt: new Date().toISOString().split('T')[0] 
    };
    setData(prev => ({
      ...prev,
      jobs: [...prev.jobs, newJob]
    }));
    try {
      await api.addJob(job);
    } catch (error) {
      console.error('Failed to add job:', error);
    }
  };

  const updateJob = async (id: string, job: Partial<Job>) => {
    setData(prev => ({
      ...prev,
      jobs: prev.jobs.map(j => j.id === id ? { ...j, ...job } : j)
    }));
    try {
      await api.updateJob(id, job);
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  const deleteJob = async (id: string) => {
    setData(prev => ({
      ...prev,
      jobs: prev.jobs.filter(j => j.id !== id)
    }));
    try {
      await api.deleteJob(id);
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  // Applications
  const addApplication = async (application: Omit<JobApplication, 'id' | 'appliedAt' | 'status'>) => {
    const newApp = {
      ...application,
      id: generateId(),
      status: 'pending' as const,
      appliedAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      applications: [...prev.applications, newApp]
    }));
    try {
      await api.addApplication(application);
    } catch (error) {
      console.error('Failed to add application:', error);
    }
  };

  const updateApplicationStatus = async (id: string, status: JobApplication['status']) => {
    setData(prev => ({
      ...prev,
      applications: prev.applications.map(a => 
        a.id === id ? { ...a, status } : a
      )
    }));
    try {
      await api.updateApplication(id, { status });
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  };

  const deleteApplication = async (id: string) => {
    setData(prev => ({
      ...prev,
      applications: prev.applications.filter(a => a.id !== id)
    }));
    try {
      await api.deleteApplication(id);
    } catch (error) {
      console.error('Failed to delete application:', error);
    }
  };

  // Blogs
  const addBlog = async (blog: Omit<BlogPost, 'id' | 'slug'>) => {
    const newBlog = { 
      ...blog, 
      id: generateId(),
      slug: generateSlug(blog.title)
    };
    setData(prev => ({
      ...prev,
      blogs: [...prev.blogs, newBlog]
    }));
    try {
      await api.addBlog(blog);
    } catch (error) {
      console.error('Failed to add blog:', error);
    }
  };

  const updateBlog = async (id: string, blog: Partial<BlogPost>) => {
    setData(prev => ({
      ...prev,
      blogs: prev.blogs.map(b => {
        if (b.id === id) {
          const updated = { ...b, ...blog };
          if (blog.title) {
            updated.slug = generateSlug(blog.title);
          }
          return updated;
        }
        return b;
      })
    }));
    try {
      await api.updateBlog(id, blog);
    } catch (error) {
      console.error('Failed to update blog:', error);
    }
  };

  const deleteBlog = async (id: string) => {
    setData(prev => ({
      ...prev,
      blogs: prev.blogs.filter(b => b.id !== id)
    }));
    try {
      await api.deleteBlog(id);
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  // Contact
  const updateContact = async (contact: Partial<SiteData['contact']>) => {
    const updated = { ...data.contact, ...contact };
    setData(prev => ({
      ...prev,
      contact: updated
    }));
    try {
      await api.updateContact(updated);
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  // Pages
  const addPage = async (page: Omit<DynamicPage, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPage = { 
      ...page, 
      id: generateId(), 
      slug: generateSlug(page.title),
      createdAt: now, 
      updatedAt: now 
    };
    setData(prev => ({
      ...prev,
      pages: [...(prev.pages || []), newPage]
    }));
    try {
      await api.addPage(page);
    } catch (error) {
      console.error('Failed to add page:', error);
    }
  };

  const updatePage = async (id: string, page: Partial<DynamicPage>) => {
    setData(prev => ({
      ...prev,
      pages: (prev.pages || []).map(p => 
        p.id === id ? { ...p, ...page, updatedAt: new Date().toISOString() } : p
      )
    }));
    try {
      await api.updatePage(id, page);
    } catch (error) {
      console.error('Failed to update page:', error);
    }
  };

  const deletePage = async (id: string) => {
    setData(prev => ({
      ...prev,
      pages: (prev.pages || []).filter(p => p.id !== id)
    }));
    try {
      await api.deletePage(id);
    } catch (error) {
      console.error('Failed to delete page:', error);
    }
  };

  // Admins
  const addAdmin = async (admin: Omit<AdminUser, 'id' | 'createdAt'>) => {
    const newAdmin = { 
      ...admin, 
      id: generateId(), 
      createdAt: new Date().toISOString() 
    };
    setData(prev => ({
      ...prev,
      admins: [...(prev.admins || []), newAdmin]
    }));
    try {
      await api.addAdmin(admin);
    } catch (error) {
      console.error('Failed to add admin:', error);
    }
  };

  const updateAdmin = async (id: string, admin: Partial<AdminUser>) => {
    setData(prev => ({
      ...prev,
      admins: (prev.admins || []).map(a => a.id === id ? { ...a, ...admin } : a)
    }));
    try {
      await api.updateAdmin(id, admin);
    } catch (error) {
      console.error('Failed to update admin:', error);
    }
  };

  const deleteAdmin = async (id: string) => {
    const adminToDelete = (data.admins || []).find(a => a.id === id);
    if (adminToDelete?.isMainAdmin) {
      console.error('Cannot delete main admin');
      return;
    }
    setData(prev => ({
      ...prev,
      admins: (prev.admins || []).filter(a => a.id !== id)
    }));
    try {
      await api.deleteAdmin(id);
    } catch (error) {
      console.error('Failed to delete admin:', error);
    }
  };

  // Export/Import
  const exportData = () => {
    return JSON.stringify(data, null, 2);
  };

  const importData = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      setData(parsed);
      // Import data via API
      await api.getAllData(); // This will trigger a refresh after import
      return true;
    } catch {
      return false;
    }
  };

  const resetData = async () => {
    setData(initialData);
  };

  // Page Blocks
  const getPageBlocks = useCallback((pageKey: string): ContentBlock[] => {
    return data.pageBlocks?.[pageKey] || [];
  }, [data.pageBlocks]);

  const savePageBlocks = useCallback(async (pageKey: string, blocks: ContentBlock[]) => {
    setData(prev => ({
      ...prev,
      pageBlocks: { ...prev.pageBlocks, [pageKey]: blocks }
    }));
    try {
      await api.savePageBlocks(pageKey, blocks);
    } catch (error) {
      console.error('Failed to save page blocks:', error);
      await refreshData();
    }
  }, [refreshData]);

  return (
    <DataContext.Provider value={{
      data,
      isLoading,
      refreshData,
      updateSettings,
      updateNavLinks,
      addSlide,
      updateSlide,
      deleteSlide,
      addBrand,
      updateBrand,
      deleteBrand,
      addService,
      updateService,
      deleteService,
      addTechnology,
      updateTechnology,
      deleteTechnology,
      addStat,
      updateStat,
      deleteStat,
      updateStats,
      addExpertiseSection,
      updateExpertiseSection,
      deleteExpertiseSection,
      addBenefit,
      updateBenefit,
      deleteBenefit,
      addJob,
      updateJob,
      deleteJob,
      addApplication,
      updateApplicationStatus,
      deleteApplication,
      addBlog,
      updateBlog,
      deleteBlog,
      updateContact,
      addPage,
      updatePage,
      deletePage,
      addAdmin,
      updateAdmin,
      deleteAdmin,
      exportData,
      importData,
      resetData,
      uploadFile,
      getPageBlocks,
      savePageBlocks
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
