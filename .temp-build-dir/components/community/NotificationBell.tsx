'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BellIcon } from '@heroicons/react/24/outline';

type Notification = {
  id: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/community/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/community/notifications/${id}`, {
        method: 'PATCH',
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await fetch('/api/community/notifications/read-all', {
        method: 'PATCH',
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/community/notifications/${id}`, {
        method: 'DELETE',
      });
      
      // Update local state
      const deleted = notifications.find(n => n.id === id);
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n.id !== id)
      );
      
      if (deleted && !deleted.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  // Format notification date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  // Poll for new notifications
  useEffect(() => {
    fetchNotifications();
    
    // Poll every minute for new notifications
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('#notification-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" id="notification-dropdown">
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full hover:bg-bg-alt focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-accent text-xs text-white text-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-bg border border-border/60 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border/60 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-accent hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-accent border-r-transparent"></div>
              <p className="mt-2 text-sm text-fg-muted">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-fg-muted">
              No notifications
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-border/60 hover:bg-bg-alt/50 ${
                    !notification.read ? 'bg-bg-alt/30' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-fg-muted'}`}>
                      {notification.content}
                    </p>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-fg-muted hover:text-fg"
                      aria-label="Delete notification"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-fg-muted">
                      {formatDate(notification.createdAt)}
                    </span>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-accent hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-2 text-center border-t border-border/60">
            <Link
              href="/community"
              className="text-xs text-accent hover:underline"
              onClick={() => setIsOpen(false)}
            >
              View all in community
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}