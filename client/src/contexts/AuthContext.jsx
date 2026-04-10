import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const AuthContext = createContext(null);

const API_PARAMS = {
  headers: { 'Content-Type': 'application/json' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalMode, setAuthModalOpen] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('aqua_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const saveUserAndToken = (userData, token) => {
    const customUser = { ...userData, token };
    setUser(customUser);
    localStorage.setItem('aqua_user', JSON.stringify(customUser));

    if (pendingAction) {
      setAuthModalOpen(null);
      pendingAction();
      setPendingAction(null);
    }
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    const res = await fetch('/api/auth/google', {
      method: 'POST',
      ...API_PARAMS,
      body: JSON.stringify({
        email: fbUser.email,
        username: fbUser.displayName || 'Google User',
        avatar: fbUser.photoURL,
        firebaseUid: fbUser.uid
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi đăng nhập Google');
    saveUserAndToken(data.user, data.token);
  };

  const loginWithEmail = async (email, pass) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      ...API_PARAMS,
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi đăng nhập');
    saveUserAndToken(data.user, data.token);
  };

  const registerWithEmail = async (formData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      ...API_PARAMS,
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi đăng ký');

    return data;
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}

    setUser(null);
    localStorage.removeItem('aqua_user');
  };

  const requireAuth = (action) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setAuthModalOpen('login');
    }
  };

  const updateUser = (updatedData) => {
    if (!user) return;

    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('aqua_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        updateUser,
        logout,
        requireAuth,
        authModalMode,
        setAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};