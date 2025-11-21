'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const RecentActivity: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([]);
  React.useEffect(() => {
    Promise.all([
      fetch('/api/revenue').then(r=>r.json()),
      fetch('/api/rights').then(r=>r.json()),
      fetch('/api/milestones').then(r=>r.json())
    ]).then(([revenue, rights, milestones]) => {
      let splits: any[] = [];
      try { splits = JSON.parse(localStorage.getItem('crt_recent_splits')||'[]'); } catch {}
      const revItems = revenue.slice(0,5).map((r:any)=>({ id: r.id, title: `Payment of $${r.amount.toLocaleString()} received for ${r.projectName}`, time: new Date(r.date).toDateString(), icon: '💰' }));
      const splitItems = splits.slice(0,3).map((s:any)=>({ id: `split_${s.id}`, title: `Split $${s.amount.toLocaleString()} for ${(s.projectId)}`, time: new Date(s.date).toDateString(), icon: '🧮' }));
      const rightsItems = rights.slice(0,3).map((x:any)=>({ id: `right_${x.id}`, title: `Rights ${x.status.toLowerCase()} for ${x.projectName}`, time: new Date(x.createdDate||x.expirationDate).toDateString(), icon: '⚖️' }));
      const mileItems = milestones.slice(0,3).map((m:any)=>({ id: m.id, title: m.title, time: new Date(m.date).toDateString(), icon: '📅' }));
      setItems([...revItems, ...splitItems, ...rightsItems, ...mileItems].slice(0,8));
    }).catch(()=>setItems([]));
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map(i => (
            <div key={i.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">{i.icon}</div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">{i.title}</p>
                <p className="text-xs text-gray-500">{i.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;


