// frontend/components/NotificationBell.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Notification } from '@/types';
import NotificationListComponent from './NotificationListComponent';

export default function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load notifications when user logs in
    useEffect(() => {
        if (user) {
            loadNotifications();
            // Poll every 30s for new alerts
            const interval = setInterval(loadNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function loadNotifications() {
        if (!user) return;
        try {
            const data = await api.getNotifications(user.id);
            setNotifications(data);
        } catch (e) {
            console.error('Failed to load notifications');
        }
    }

    // Mark as read in UI immediately, then sync with backend
    async function handleMarkRead(id: string) {
        // UI Optimistic Update
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, is_read: true } : n
        ));

        // API Call
        await api.markNotificationRead(id);
    }

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors relative"
                aria-label="Notifications"
            >
                {/* SVG Bell Icon */}
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                {/* Red Badge for Unread Items */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-black animate-pulse" />
                )}
            </button>

            {/* Dropdown Container */}
            {/* UPDATED: Aligned to LEFT (left-0) so it pops out into the main content area */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 z-50 origin-top-left shadow-2xl rounded-xl">
                    <NotificationListComponent
                        notifications={notifications}
                        onMarkRead={handleMarkRead}
                    />
                </div>
            )}
        </div>
    );
}