import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Member } from "@/data/types";
import { api, clearMemberAuth, getStoredMemberAuth, storeMemberAuth } from "@/lib/api";

interface MemberContextType {
  member: Member | null;
  token: string;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: Record<string, string>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(() => getStoredMemberAuth()?.member || null);
  const [token, setToken] = useState<string>(() => getStoredMemberAuth()?.token || "");

  const applyAuth = (auth: { token: string; member: Member }) => {
    setToken(auth.token);
    setMember(auth.member);
    storeMemberAuth(auth);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.memberLogin(email, password);
      if (!response?.success || !response?.token || !response?.member) return false;
      applyAuth({ token: response.token, member: response.member });
      return true;
    } catch (error) {
      console.error("Member login failed:", error);
      return false;
    }
  };

  const register = async (payload: Record<string, string>) => {
    try {
      const response = await api.memberRegister(payload);
      if (!response?.success || !response?.token || !response?.member) return false;
      applyAuth({ token: response.token, member: response.member });
      return true;
    } catch (error) {
      console.error("Member registration failed:", error);
      return false;
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const response = await api.getMemberProfile(token);
      if (response?.member) {
        const auth = { token, member: response.member };
        setMember(response.member);
        storeMemberAuth(auth);
      }
    } catch (error) {
      console.error("Member profile refresh failed:", error);
    }
  };

  const logout = () => {
    setToken("");
    setMember(null);
    clearMemberAuth();
  };

  useEffect(() => {
    if (token) {
      refreshProfile();
    }
  }, []);

  return (
    <MemberContext.Provider
      value={{
        member,
        token,
        isAuthenticated: Boolean(member && token),
        login,
        register,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMember must be used within a MemberProvider");
  }
  return context;
}
