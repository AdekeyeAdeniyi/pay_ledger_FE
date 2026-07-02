"use client";

import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import CreateInvoiceModal from "@/components/modal/CreateEditInvoiceModal";
import { InvoiceStatus } from "@/services/invoiceService";
import { useInvoices } from "@/hooks/useInvoices";
import Link from "next/link";
import PreLoader from "@/components/modal/Preloader";

export default function InvoicesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [page] = useState(1);

  const [status] = useState<InvoiceStatus | undefined>();

  const { data: invoices, isLoading } = useInvoices({
    page,
    limit: 20,
    status,
  });

  if (isLoading) return <PreLoader />;

  return (
    <div className="space-y-6 w-full relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-pl-ink tracking-tight">Invoice Management</h1>
          <p className="text-xs text-pl-ink-3 mt-0.5">Manage customer obligations </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} variant="primary" size="sm" className="w-full sm:w-auto order-1 sm:order-2 justify-center">
          <Plus size={14} /> Create Invoice
        </Button>
      </div>

      {/* Audit-Style Table */}
      <div className="bg-white border border-pl-border-dark rounded-pl-lg shadow-xs overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-pl-surface text-pl-ink-2 uppercase font-bold text-xs border-b border-pl-border-dark">
            <tr>
              <th className="p-4">Invoice</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Due Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-pl-border-dark">
            {invoices?.meta.total === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-pl-ink-3">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices?.data.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-pl-surface/40 transition">
                  <td className="p-4">
                    <div className="font-semibold">{invoice.invoiceNumber}</div>

                    <div className="text-xs text-pl-ink-3">{invoice.orderReference ?? "No checkout"}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium">{invoice.customer.name}</div>

                    <div className="text-xs text-pl-ink-3">{invoice.customer.email}</div>
                  </td>

                  <td className="p-4 font-bold">₦{Number(invoice.totalAmount).toLocaleString()}</td>

                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        invoice.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : invoice.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : invoice.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}>
                      {invoice.status}
                    </span>
                  </td>

                  <td className="p-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/invoices/${invoice.id}`}>
                        <ChevronRight size={16} className="inline text-pl-ink-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreateInvoiceModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
}
