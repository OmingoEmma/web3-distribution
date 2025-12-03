'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { ContributorLayout } from '@/components/layouts/ContributorLayout';
import { Revenue } from '@/lib/types';

export default function ContributorRevenuePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [revenue, setRevenue] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'contributor' && user.role !== 'admin') {
      router.replace('/unauthorized');
      return;
    }

    fetch('/api/revenue')
      .then(r => r.json())
      .then((data: Revenue[]) => {
        const userRevenue = data.filter(r => r.contributorId === user.id);
        setRevenue(userRevenue);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, router]);

  if (!user || (user.role !== 'contributor' && user.role !== 'admin')) {
    return null;
  }

  const totalEarnings = revenue.reduce((sum, r) => sum + r.amount, 0);
  const paidAmount = revenue.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amount, 0);
  const pendingAmount = revenue.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.amount, 0);

  return (
    <ContributorLayout>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            My Revenue
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your earnings from all projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Earnings</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${totalEarnings.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Paid Out</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${paidAmount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              ${pendingAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400">Loading revenue...</p>
            </div>
          ) : revenue.length === 0 ? (
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {revenue.map(rev => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ContributorLayout>
  );
}
