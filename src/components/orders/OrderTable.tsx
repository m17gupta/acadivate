"use client"

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/hook/store';
import { cn } from '@/src/lib/utils';
import { CreditCard, Loader2 } from 'lucide-react';

const OrderTable = ({ allOrders, loading }: { allOrders: any[], loading: boolean }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";
   const {allNomination}= useSelector((state: RootState)=>state.nominations)
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      const timeStr = date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).toLowerCase();

      const isToday = date.toDateString() === now.toDateString();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();

      if (isToday) return `Today, ${timeStr}`;
      if (isYesterday) return `Yesterday, ${timeStr}`;

      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + `, ${timeStr}`;
    } catch (e) {
      return dateString;
    }
  };

  return (
    <article className="rounded-[2rem] border border-border-light bg-white p-6 shadow-sh-sm lg:p-7">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-text-subtle">
            Data table
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-navy">
            Payments records
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">
            Monitor and track all transaction history across the platform.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-border-light">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-soft border-b border-border-light">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Sr.No.</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Payment ID</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Order ID</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Method</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-text-subtle text-right">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-sm text-text-muted">Fetching orders...</p>
                  </td>
                </tr>
              ) : allOrders.length > 0 ? (
                allOrders.map((order, idx) => {
                   const paymentMode = allNomination.find((item)=>item?._id===order?.formId)?.paymentMode
                  return(
                  <tr key={order._id || idx} className="hover:bg-bg-soft/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-pale text-primary">
                        {idx+1}
                        </div>
                        
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-pale text-primary">
                          <CreditCard size={18} />
                        </div>
                        <div className="font-bold text-navy truncate max-w-[150px]" title={order.paymentId}>{order.paymentId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-navy text-sm">{order.orderId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-navy">₹{(order.amount || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text-muted text-sm uppercase">{paymentMode || '—'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize",
                        order.status === 'success' ? "bg-sage-2 text-sage" : 
                        order.status === 'pending' ? "bg-gold-pale text-gold" : "bg-crimson-2 text-crimson"
                      )}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-text-muted text-xs">{formatDate(order.createdAt)}</div>
                    </td>
                  </tr>
                )})
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <p className="text-sm font-semibold text-navy">No orders found.</p>
                    <p className="mt-1 text-sm text-text-muted">Completed payments will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
};

export default OrderTable;
