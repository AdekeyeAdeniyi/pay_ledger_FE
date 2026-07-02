"use client";

import CustomerFormModal from "@/components/modal/CustomerFormModal";
import PreLoader from "@/components/modal/Preloader";
import { Button } from "@/components/ui/Button";
import { useCustomer } from "@/hooks/useCustomers";
import { useDeactivateCustomer } from "@/hooks/useDeactivateCustomer";
import { useReactivateCustomer } from "@/hooks/useReactivateCustomer";
import { useUpdateCustomer } from "@/hooks/useUpdateCustomer";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function CustomerPage() {
  const params = useParams();

  const id = params.id as string;

  const { data, isLoading, error } = useCustomer(id);
  const updateCustomer = useUpdateCustomer();
  const deactivateCustomer = useDeactivateCustomer();
  const reactivateCustomer = useReactivateCustomer();
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (isLoading) {
    return <PreLoader />;
  }

  if (error) {
    return <div className="p-10 text-red-500">Failed to load customer.</div>;
  }

  const customer = data?.data;

  if (!customer) {
    return <div className="p-10">Customer not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex justify-center items-center gap-3">
          <Link href="/customers" className="w-10 h-10 rounded-lg border border-pl-border-dark flex items-center justify-center hover:bg-pl-surface transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>

            <p className="text-gray-500">{customer.customerCode}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            customer.status === "ACTIVE" ? "bg-green-100 text-green-700" : customer.status === "PENDING_VA" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
          }`}>
          {customer.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="primary" icon={<Pencil size={16} />} onClick={() => setEditModalOpen(true)}>
          Edit Customer
        </Button>

        {customer.status === "INACTIVE" ? (
          <Button
            variant="primary"
            disabled={reactivateCustomer.isPending}
            onClick={() =>
              reactivateCustomer.mutate(customer.id, {
                onSuccess: () => {
                  // toast.success("Customer reactivated successfully.");
                },
              })
            }>
            {reactivateCustomer.isPending ? "Reactivating..." : "Reactivate"}
          </Button>
        ) : (
          <Button
            variant="danger"
            disabled={deactivateCustomer.isPending}
            onClick={() =>
              deactivateCustomer.mutate(customer.id, {
                onSuccess: () => {
                  // toast.success("Customer suspended successfully.");
                },
              })
            }>
            {deactivateCustomer.isPending ? "Suspending..." : "Suspend"}
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Customer Information</h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p>{customer.email}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p>{customer.phone}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Customer Type</p>
              <p>{customer.customerType}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Notes</p>
              <p>{customer.notes ?? "-"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Virtual Account</h2>

          {customer.virtualAccount ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Account Number</p>

                <p className="font-mono text-lg">{customer.virtualAccount.accountNumber}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Bank</p>

                <p>{customer.virtualAccount.bankName}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Status</p>

                <p>{customer.virtualAccount.status}</p>
              </div>
            </div>
          ) : (
            <p>No virtual account.</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Credit Balance</h2>

          <p className="text-3xl font-bold">₦{customer.creditBalance}</p>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Outstanding Debt</h2>

          <p className="text-3xl font-bold">₦{customer.outstandingDebt}</p>
        </div>
      </div>

      <CustomerFormModal
        open={editModalOpen}
        mode="edit"
        loading={updateCustomer.isPending}
        error={null}
        initialValues={{
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          customerType: customer.customerType,
          notes: customer.notes ?? "",
        }}
        onClose={() => setEditModalOpen(false)}
        onSubmit={(values) => {
          updateCustomer.mutate(
            {
              id: customer.id,
              name: values.name,
              email: values.email,
              phone: values.phone,
              notes: values.notes,
            },
            {
              onSuccess: () => {
                setEditModalOpen(false);
              },
            },
          );
        }}
      />
    </div>
  );
}
