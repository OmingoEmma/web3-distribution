'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { CreatorLayout } from '@/components/layouts/CreatorLayout';
import { Revenue, Project } from '@/lib/types';

export default function CreatorRevenuePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Paid' | 'Pending' | 'Processing'>('all');

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'creator' && user.role !== 'admin') {
      router.replace('/unauthorized');
      return;
    }

    // Fetch both projects and revenue to filter correctly
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/revenue').then(r => r.json()),
    ])
      .then(([projectsData, revenueData]) => {
        // Get creator's project IDs
        const creatorProjectIds = projectsData
          .filter((p: any) => p.creatorId === user.id)
          .map((p: any) => p.id);
        
        // Only show revenue from creator's projects
        const creatorRevenue = revenueData.filter((r: Revenue) => 
          creatorProjectIds.includes(r.projectId)
        );
        
        setRevenue(creatorRevenue);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, router]);

  if (!user || (user.role !== 'creator' && user.role !== 'admin')) {
    return null;
  }

  const filteredRevenue = filter === 'all' 
    ? revenue 
    : revenue.filter(r => r.status === filter);

  const totalEarnings = revenue.reduce((sum, r) => sum + r.amount, 0);
  const paidAmount = revenue.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = revenue.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);

  return (
    <CreatorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            My Revenue
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track revenue from all your projects.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Project Revenue</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Distributed</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${paidAmount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pending Distribution</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              ${pendingAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All ({revenue.length})
            </button>
            <button
              onClick={() => setFilter('Paid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'Paid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Paid ({revenue.filter(r => r.status === 'Paid').length})
            </button>
            <button
              onClick={() => setFilter('Pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'Pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Pending ({revenue.filter(r => r.status === 'Pending').length})
            </button>
            <button
              onClick={() => setFilter('Processing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'Processing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Processing ({revenue.filter(r => r.status === 'Processing').length})
            </button>
          </div>
        </div>

        {/* Revenue Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400">Loading revenue...</p>
            </div>
          ) : filteredRevenue.length === 0 ? (
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400">No revenue records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Transaction
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRevenue.map(rev => (
                    <tr key={rev.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {rev.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {rev.projectName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {rev.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        ${rev.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          rev.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          rev.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {rev.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {rev.transactionHash ? (
                          <a
                            href={`https://etherscan.io/tx/${rev.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </CreatorLayout>
  );
}
