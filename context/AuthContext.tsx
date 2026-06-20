import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, AdminPermission } from '@/data/types';
import { api } from '@/lib/api';

const AUTH_STORAGE_KEY = 'oversea_admin_auth';

interface AuthContextType {
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: AdminPermission) => boolean;
  updateCurrentAdmin: (data: Partial<AdminUser>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  getAllAdmins: () => AdminUser[];
  addAdmin: (admin: Omit<AdminUser, 'id' | 'createdAt'>) => Promise<boolean>;
  updateAdmin: (id: string, admin: Partial<AdminUser>) => Promise<boolean>;
  deleteAdmin: (id: string) => Promise<boolean>;
  refreshAdmins: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeAdmin(admin: Partial<AdminUser>): AdminUser {
  return {
    id: admin.id || '',
    username: admin.username || '',
    password: '',
    displayName: admin.displayName || admin.username || '',
    email: admin.email || '',
    avatar: admin.avatar || '',
    role: admin.role || 'editor',
    permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
    isMainAdmin: Boolean(admin.isMainAdmin),
    createdAt: admin.createdAt || new Date().toISOString(),
    lastLogin: admin.lastLogin || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    try {
      return normalizeAdmin(JSON.parse(stored));
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  });

  const [admins, setAdmins] = useState<AdminUser[]>([]);

  const refreshAdmins = async () => {
    try {
      const apiAdmins = await api.getAdmins();
      const normalizedAdmins = apiAdmins.map(normalizeAdmin);
      setAdmins(normalizedAdmins);
      setCurrentAdmin(prev => {
        if (!prev) return prev;
        return normalizedAdmins.find(a => a.id === prev.id || a.username === prev.username) || prev;
      });
    } catch (error) {
      console.error('Failed to load admins from API:', error);
    }
  };

  useEffect(() => {
    refreshAdmins();
  }, []);

  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentAdmin]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(username, password);
      if (!response?.success || !response?.admin) {
        return false;
      }

      const loggedInAdmin = normalizeAdmin(response.admin);
      setCurrentAdmin(loggedInAdmin);
      await refreshAdmins();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === 'super_admin') return true;
    return currentAdmin.permissions.includes(permission);
  };

  const updateCurrentAdmin = (data: Partial<AdminUser>) => {
    if (!currentAdmin) return;
    const updated = normalizeAdmin({ ...currentAdmin, ...data });
    setCurrentAdmin(updated);
    setAdmins(prev => prev.map(a => a.id === currentAdmin.id ? updated : a));
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!currentAdmin) return false;

    try {
      const verify = await api.login(currentAdmin.username, oldPassword);
      if (!verify?.success) return false;

      const success = await updateAdmin(currentAdmin.id, { ...currentAdmin, password: newPassword });
      return success;
    } catch (error) {
      console.error('Failed to change password:', error);
      return false;
    }
  };

  const getAllAdmins = (): AdminUser[] => admins;

  const addAdmin = async (adminData: Omit<AdminUser, 'id' | 'createdAt'>): Promise<boolean> => {
    if (!hasPermission('admins')) return false;

    try {
      const response = await api.addAdmin({
        ...adminData,
        permissions: adminData.role === 'super_admin'
          ? ['dashboard', 'home', 'slider', 'services', 'store', 'orders', 'support', 'coupons', 'directory', 'chatbot', 'jobs', 'applications', 'blogs', 'brands', 'media', 'pages', 'menus', 'settings', 'admins']
          : adminData.permissions,
      });

      if (!response?.success) return false;
      await refreshAdmins();
      return true;
    } catch (error) {
      console.error('Failed to add admin:', error);
      return false;
    }
  };

  const updateAdmin = async (id: string, data: Partial<AdminUser>): Promise<boolean> => {
    if (!hasPermission('admins')) return false;

    const existingAdmin = admins.find(a => a.id === id);
    if (!existingAdmin) return false;
    if (existingAdmin.isMainAdmin && data.isMainAdmin === false) return false;

    try {
      const response = await api.updateAdmin(id, {
        username: data.username ?? existingAdmin.username,
        displayName: data.displayName ?? existingAdmin.displayName,
        email: data.email ?? existingAdmin.email,
        avatar: data.avatar ?? existingAdmin.avatar ?? '',
        role: data.role ?? existingAdmin.role,
        permissions: data.permissions ?? existingAdmin.permissions,
        ...(data.password ? { password: data.password } : {}),
      });

      if (!response?.success) return false;
      await refreshAdmins();

      if (currentAdmin?.id === id) {
        const refreshed = await api.getAdmins();
        const updatedCurrent = refreshed.map(normalizeAdmin).find(a => a.id === id);
        if (updatedCurrent) setCurrentAdmin(updatedCurrent);
      }

      return true;
    } catch (error) {
      console.error('Failed to update admin:', error);
      return false;
    }
  };

  const deleteAdmin = async (id: string): Promise<boolean> => {
    if (!hasPermission('admins')) return false;

    const admin = admins.find(a => a.id === id);
    if (!admin || admin.isMainAdmin) return false;

    try {
      const response = await api.deleteAdmin(id);
      if (!response?.success) return false;
      setAdmins(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (error) {
      console.error('Failed to delete admin:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentAdmin,
      isAuthenticated: !!currentAdmin,
      login,
      logout,
      hasPermission,
      updateCurrentAdmin,
      changePassword,
      getAllAdmins,
      addAdmin,
      updateAdmin,
      deleteAdmin,
      refreshAdmins,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
