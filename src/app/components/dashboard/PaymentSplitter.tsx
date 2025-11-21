'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatPercentage, calculatePaymentSplit } from '@/lib/utils';
import { mockProjects, mockRevenue, getProjectContributors } from '@/data/mockData';
import { useAuth } from '@/lib/auth';
import { toast } from 'react-hot-toast';

export const PaymentSplitter: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [revenueSource, setRevenueSource] = useState('');
  const [calculatedSplits, setCalculatedSplits] = useState<any[]>([]);

  const projectOptions = mockProjects.map(project => ({
    value: project.id,
    label: project.name
  }));

  const revenueSourceOptions = [
    { value: 'streaming', label: 'Streaming Royalties' },
    { value: 'licensing', label: 'Licensing Deal' },
    { value: 'sales', label: 'Sales Revenue' },
    { value: 'performance', label: 'Performance Rights' },
    { value: 'sync', label: 'Sync Licensing' },
    { value: 'other', label: 'Other' },
  ];

  const handleCalculateSplits = () => {
    if (!selectedProject || !paymentAmount) return;

    const contributors = getProjectContributors(selectedProject);
    const amount = parseFloat(paymentAmount);
    const splits = calculatePaymentSplit(amount, contributors);
    setCalculatedSplits(splits);
  };

  const handleProcessPayment = async () => {
    if (user?.role !== 'admin') {
      toast.error('Admin only: You do not have permission to process payments.');
      return;
    }
    
    try {
      toast.loading('Processing payment splits...');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with smart contract or payment processor
      console.log('Processing payment splits:', calculatedSplits);
      
      // Persist to localStorage recent payments
      const existing = JSON.parse(localStorage.getItem('crt_recent_splits') || '[]');
      const entry = { 
        id: Date.now().toString(), 
        projectId: selectedProject, 
        amount: parseFloat(paymentAmount), 
        splits: calculatedSplits.map(split => ({
          ...split,
          status: 'Paid',
          transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`
        })), 
        date: new Date().toISOString(),
        status: 'Completed'
      };
      localStorage.setItem('crt_recent_splits', JSON.stringify([entry, ...existing].slice(0, 10)));
      
      toast.dismiss();
      toast.success(`Payment of ${formatCurrency(parseFloat(paymentAmount))} successfully split among ${calculatedSplits.length} contributors!`);
      
      setIsModalOpen(false);
      setSelectedProject('');
      setPaymentAmount('');
      setRevenueSource('');
      setCalculatedSplits([]);
      
      // Refresh the component to show new data
      window.location.reload();
      
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to process payment splits. Please try again.');
      console.error('Payment processing error:', error);
    }
  };

  return (
    <>
      <Card id="payment-splitter">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Splitter</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Automatically split payments based on revenue sharing agreements
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => {
                setIsModalOpen(true);
                toast.success('Opening payment split modal...');
              }}>
                New Payment Split
              </Button>
              <Button 
                variant="success" 
                onClick={() => {
                  // Quick split with default values
                  if (mockProjects.length > 0) {
                    setSelectedProject(mockProjects[0].id);
                    setPaymentAmount('1000');
                    setRevenueSource('streaming');
                    setIsModalOpen(true);
                    toast.success('Quick split setup ready! Adjust values as needed.');
                  } else {
                    toast.error('No projects available for quick split');
                  }
                }}
              >
                Quick Split
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Recent Payment Splits</h4>
            {(() => {
              let recent: any[] = [];
              try { recent = JSON.parse(localStorage.getItem('crt_recent_splits') || '[]'); } catch {}
              const combined = [
                ...recent.map((r:any)=>({ id: r.id, projectName: (mockProjects.find(p=>p.id===r.projectId)?.name)||'Project', amount: r.amount, date: r.date, source: 'Split', status: 'Paid', splits: r.splits })),
                ...mockRevenue.filter(rev => rev.splits && rev.splits.length > 0),
              ].slice(0,5);
              return combined;
            })().map((revenue:any) => (
              <div key={revenue.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {revenue.projectName}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {revenue.source} • {new Date(revenue.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(revenue.amount)}
                    </p>
                    <Badge variant={revenue.status === 'Paid' ? 'success' : 'warning'}>
                      {revenue.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Splits:</h6>
                  {revenue.splits?.map((split: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {split.contributorName} ({formatPercentage(split.percentage)})
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(split.amount)}
                        </span>
                        <Badge variant={split.status === 'Paid' ? 'success' : 'warning'} className="text-xs">
                          {split.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Split Modal */}
      
      {/* Simple test modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Calculate Payment Split</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Project
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Choose a project</option>
                    {projectOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Revenue Source
                  </label>
                  <select
                    value={revenueSource}
                    onChange={(e) => setRevenueSource(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Choose source</option>
                    {revenueSourceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Amount
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount in USD"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <Button 
                onClick={handleCalculateSplits}
                disabled={!selectedProject || !paymentAmount}
                className="w-full"
              >
                Calculate Splits
              </Button>

              {calculatedSplits.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Calculated Payment Splits:</h4>
                  
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="space-y-3">
                      {calculatedSplits.map((split, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                              {split.contributorName.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {split.contributorName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatPercentage(split.percentage)} share
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(split.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Total:</span>
                        <span>{formatCurrency(parseFloat(paymentAmount))}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 items-center">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <div className="flex-1">
                      <Button onClick={handleProcessPayment} className="w-full" disabled={user?.role !== 'admin'} title={user?.role !== 'admin' ? 'You need admin access' : undefined}>
                        Process Payment
                      </Button>
                      {user?.role !== 'admin' && (
                        <div className="mt-1">
                          <Badge variant="warning">You need admin access</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
    </>
  );
};
