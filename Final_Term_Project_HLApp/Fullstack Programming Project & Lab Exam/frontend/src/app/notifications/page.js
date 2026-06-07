'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function NotificationsRedirect() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) router.push(`/${user.role}/notifications` === '/patient/notifications' ? '/patient/notifications' : '/patient/notifications');
    else router.push('/login');
  }, [user, router]);
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>⏳ Redirecting...</div>;
}
