"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Search, Copy, Check, ExternalLink } from "lucide-react";
import { useCustomerCreate } from "@/hooks/useCustomerCreate";
import { useCustomers } from "@/hooks/useCustomers";
import Link from "next/link";
import CustomerFormModal from "@/components/modal/CustomerFormModal";
import PreLoader from "@/components/modal/Preloader";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const createCustomer = useCustomerCreate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useCustomers();

  const customers = data?.data ?? [];
  const meta = data?.meta;

  const [formError] = useState<string | null>(null);

  const handleCopyNuban = (nuban: string | undefined, id: string) => {
    if (nuban) {
      navigator.clipboard.writeText(nuban);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredCustomers = customers.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isLoading) {
    return <PreLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header Segment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl font-extrabold text-pl-ink tracking-tight">Customer Routing Nodes</h1>
          <p className="text-xs text-pl-ink-3 mt-0.5">Provision static virtual ledger routing endpoints mapped to explicit buyer identities.</p>
        </div>
        <div className="w-full sm:w-auto">
          <Button variant="primary" size="sm" className="w-full sm:w-auto justify-center" icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
            Provision Client Node
          </Button>
        </div>
      </div>

      {/* Filter Options Bar */}
      <div className="bg-white p-4 rounded-pl-lg border border-pl-border-dark flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1 sm:max-w-md">
          <Search size={16} className="absolute left-3 top-3.5 text-pl-ink-3" />
          <Input type="text" placeholder="Filter identity names" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-pl-ink-2 font-medium pt-2 sm:pt-0 border-t sm:border-0 border-pl-border-dark/50">
          <span className="sm:hidden text-pl-ink-3">Summary Metrics</span>
          <span>
            Total Tracked: <span className="font-bold text-pl-ink">{meta?.total}</span>
          </span>
        </div>
      </div>

      {/* Responsive Customer Grid / Table Layout */}
      <div className="bg-white border border-pl-border-dark rounded-pl-lg shadow-xs overflow-hidden w-full">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full border-collapse text-left text-sm min-w-187.5 md:min-w-full">
            <thead>
              <tr className="bg-pl-surface text-pl-ink-2 text-xs uppercase font-bold tracking-wider border-b border-pl-border-dark">
                <th className="p-4 pl-6">Client Profile & ID</th>
                <th className="p-4">Dedicated Router (Nomba NUBAN)</th>
                <th className="p-4 hidden md:table-cell">Total Obligation Metrics</th>
                <th className="p-4">Ledger Credit Offset</th>
                <th className="p-4 hidden sm:table-cell">Operational Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pl-border-dark">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-pl-ink-3 font-medium">
                    No active client nodes match current search indices.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-pl-surface/50 transition-colors duration-100">
                    {/* Column 1: Core Client Profile info */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-pl-sm bg-pl-primary-light text-pl-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-pl-ink text-sm leading-tight truncate max-w-45 sm:max-w-xs">{customer.name}</p>
                          <div className="text-[11px] text-pl-ink-3 mt-1 font-medium flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                            <span className="truncate max-w-30 xs:max-w-none">{customer.phone}</span>
                            <span className="md:hidden">&bull;</span>
                            <span className="md:hidden font-semibold text-pl-ink-2">{`₦${customer.outstandingDebt}`} Inv</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Dedicated NUBAN Allocation Node */}
                    <td className="p-4">
                      <div className="inline-flex flex-col text-left">
                        <div className="flex items-center gap-1.5 bg-pl-surface px-2 py-1 rounded border border-pl-border-dark w-max">
                          <span className="font-mono font-black text-xs text-pl-ink tracking-wide">{customer.virtualAccount?.accountNumber ?? "No Virtual Account"}</span>

                          {customer.virtualAccount?.accountNumber && (
                            <button
                              onClick={() => handleCopyNuban(customer.virtualAccount?.accountNumber, customer.id)}
                              className="text-pl-ink-3 hover:text-pl-primary p-0.5 transition-colors cursor-pointer"
                              title="Copy Account Number">
                              {copiedId === customer.id ? <Check size={12} className="text-pl-emerald" /> : <Copy size={12} />}
                            </button>
                          )}
                        </div>

                        <span className="text-[10px] text-pl-ink-3 font-bold mt-1 uppercase tracking-wider pl-0.5 flex items-center gap-1">
                          {customer.virtualAccount?.bankName ?? "No Bank Assigned"}

                          <span className="sm:hidden">&bull;</span>

                          <span className={`sm:hidden uppercase ${customer.status === "ACTIVE" ? "text-pl-emerald-dark" : "text-pl-ink-3"}`}>{customer.status}</span>
                        </span>
                      </div>
                    </td>

                    {/* Column 3: Invoiced metrics (Hidden on Mobile/Tablets, disclosed inline under Column 1) */}
                    <td className="p-4 hidden md:table-cell">
                      <span className="font-bold text-pl-ink">{`₦${customer.outstandingDebt}`}</span>
                    </td>

                    {/* Column 4: Ledger Credit Pool Balances */}
                    <td className="p-4">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          `₦${customer.creditBalance}` !== "₦0" ? "bg-pl-violet-light text-pl-violet font-black" : "bg-pl-surface text-pl-ink-3"
                        }`}>
                        {`₦${customer.creditBalance}`}
                      </span>
                    </td>

                    {/* Column 5: Status pill (Hidden on micro screens, disclosed under account label) */}
                    <td className="p-4 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-pl-pill text-[10px] font-bold uppercase tracking-wider ${
                          customer.status === "ACTIVE" ? "bg-pl-emerald-light text-pl-emerald-dark" : "bg-pl-surface text-pl-ink-3"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${customer.status === "ACTIVE" ? "bg-pl-emerald" : "bg-pl-ink-3"}`} />
                        {customer.status}
                      </span>
                    </td>

                    {/* Column 6: Action Anchors */}
                    <td className="p-4 text-right">
                      <Link href={`/customers/${customer.id}`} title="Inspect Ledger Records">
                        <ExternalLink size={15} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deploy Node Account Trigger Modal Shell */}
      <CustomerFormModal
        open={isModalOpen}
        mode="create"
        loading={createCustomer.isPending}
        error={formError}
        initialValues={{
          name: "",
          email: "",
          phone: "",
          customerType: "RECURRING",
          notes: "",
        }}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(values) => {
          createCustomer.mutate(values);
        }}
      />
    </div>
  );
}
