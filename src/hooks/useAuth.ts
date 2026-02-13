'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { LoginCredentials, SignupData } from '@/types/auth.types';
import { ROUTES } from '@/constants/routes';

export function useAuth() {
  const { user, isLoading, setUser, setLoading, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  // 초기 로드 시 사용자 정보 가져오기
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      }
    }

    fetchUser();
  }, [setUser]);

  // 로그인
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '로그인에 실패했습니다');
      }

      const data = await response.json();
      setUser(data.user);
      router.push(ROUTES.HOME);
      router.refresh();
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : '로그인에 실패했습니다',
      };
    }
  };

  // 회원가입
  const signup = async (data: SignupData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '회원가입에 실패했습니다');
      }

      const result = await response.json();
      setLoading(false);
      return { success: true, message: result.message };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : '회원가입에 실패했습니다',
      };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      storeLogout();
      router.push(ROUTES.HOME);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };
}
