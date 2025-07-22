'use client';
import React, { useState, useMemo } from 'react';
import { PageTitle } from './PageTitle';
import { useGetNotificationsQuery } from '@/store/services/api';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import Button from '@/components/ui/button/Button';


dayjs.extend(isToday);
dayjs.extend(isYesterday);

interface NotificationItem {
  id: number;
  message: string;
  created_at: string;
  type: string;
}

const formatRelativeTime = (timestamp: string): string => {
  const now = dayjs();
  const created = dayjs(timestamp);
  const diffInMinutes = now.diff(created, 'minute');
  const diffInHours = now.diff(created, 'hour');
  const diffInDays = now.diff(created, 'day');

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return '1 day ago';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return created.format('MMMM D, YYYY');
};

const Notifications = () => {
  const [perPage, setPerPage] = useState(10);
  const { data, isFetching, isLoading } = useGetNotificationsQuery(perPage, {
  refetchOnMountOrArgChange: true,
});

  const allNotifications: NotificationItem[] = data?.notifications?.data ?? [];
  const total = data?.notifications?.total ?? 0;
  const hasMore = allNotifications.length < total;

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {};

    allNotifications.forEach((item) => {
      const date = dayjs(item.created_at);
      let groupKey: string;

      if (date.isToday()) {
        groupKey = 'Today';
      } else if (date.isYesterday()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = date.format('MMMM D, YYYY');
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return groups;
  }, [allNotifications]);

if (isLoading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-sm text-gray-500 animate-pulse">Loading Notifications...</div>
    </div>
  );
}

if (!isFetching && allNotifications.length === 0) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg text-gray-500">No notifications available for you.</div>
    </div>
  );
}


  return (
    <>
      <PageTitle title="Notifications" />
      <div className="max-w-2xl mx-auto p-4">
        {Object.entries(groupedNotifications).map(([groupTitle, items]) => (
          <div key={groupTitle} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 px-2 mb-2">{groupTitle}</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              {items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex justify-between items-start px-4 py-6">
                    <p className="text-sm text-gray-800 w-4/5">{item.message}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>
                  {index !== items.length - 1 && (
                    <hr className="border-t border-gray-100" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {hasMore && (
          <div className="mt-4 text-center">

            <Button
              onClick={() => setPerPage((prev) => prev + 10)}

              variant="primary"
              disabled={isFetching}
            >
              {isFetching ? <div className=" flex items-center justify-center"> Loading...
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              </div> : 'Load More'}
            </Button>

          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
