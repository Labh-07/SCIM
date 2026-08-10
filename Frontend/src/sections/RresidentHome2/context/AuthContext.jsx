import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import { societyApi } from "../api/societyApi";

const AuthContext = createContext(null);

/**
 * Provides the logged-in user's data to the whole app and exposes
 * login/logout helpers. Wrap the app (or the resident section) with
 * <AuthProvider> once, then read state with useAuth().
 */
export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [societyData , setSocietyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin , setIsAdmin] = useState(false)

  const fetchUserData = ()=>{
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then((data) => setUserData(data))
      .catch((err) => console.error("Failed to fetch current user:", err))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchUserData()
  }, []);

  useEffect(()=>{
    const isAdminRight = userData?.role == "Admin"
    setIsAdmin(isAdminRight)

    if(isAdminRight && userData?.societyid){
      societyApi
      .getSocietyInsights(userData?.societyid)
      .then((data) => setSocietyData(data))
      .catch((err)=>console.error("Failed to fetch socity data:",err))
      .finally(()=>setIsLoading(false))
    }else if(userData?.societyid){
       societyApi
      .getSocietyInfo(userData?.societyid)
      .then((data) => setSocietyData(data))
      .catch((err)=>console.error("Failed to fetch socity data:",err))
      .finally(()=>setIsLoading(false))
    }
  },[userData])

  const logout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ fetchUserData , userData,societyData, setUserData, isLoading, logout , isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
