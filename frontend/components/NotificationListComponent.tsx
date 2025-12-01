// frontend/components/NotificationList.tsx

'use client';

import { Notification } from '@/types';

interface NotificationListProps {
    notifications: Notification[];
    onMarkRead: (id: string) => void;
}

export default function NotificationList({ notifications, onMarkRead }: NotificationListProps) {

    // Helper to format timestamps nicely (e.g., "2 hours ago")
    function formatTime(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    }

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[400px]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Notifications
                </h3>
            </div>

            {/* List Body */}
            <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                    // Empty State
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-sm">No new notifications</p>
                    </div>
                ) : (
                    // Notification Items
                    <ul className="divide-y divide-gray-100 dark:divide-neutral-800">
                        {notifications.map((notification) => (
                            <li
                                key={notification.id}
                                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className="flex-1 space-y-1">
                                        <p className={`text-sm leading-snug ${!notification.is_read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-neutral-500">
                                            {formatTime(notification.created_at)}
                                        </p>
                                    </div>

                                    {/* Read Indicator / Button */}
                                    {!notification.is_read && (
                                        <button
                                            onClick={() => onMarkRead(notification.id)}
                                            className="flex-shrink-0 h-2 w-2 mt-1.5 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer"
                                            title="Mark as read"
                                        />
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}