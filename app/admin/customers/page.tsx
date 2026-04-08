"use client";

import AdminShell from "@/app/components/AdminShell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  gender: string;
  phone: string;
  isVerified: boolean;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchCustomers = async () => {
      try {
        const res = await fetch(`/api/admin/customers?page=${page}&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch customers");
        }

        setCustomers(data.data.customers || []);
        setTotalPages(data.data.totalPages || 1);
        setTotalCustomers(data.data.total || 0);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [page, router]);

  const handleExport = async () => {
    try {
      const res = await fetch("/api/admin/customers/export", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to export customers");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "customers-export.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting customers:", error);
    }
  };

  return (
    <AdminShell
      activeHref="/admin/customers"
      title="Customers"
      subtitle={`Track verified signups, account details, and returning buyers. Total customers: ${totalCustomers}.`}
      actions={
        <button
          type="button"
          onClick={handleExport}
          className="rounded-full bg-[#3b2317] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5"
        >
          Export Customers
        </button>
      }
    >
      {loading ? (
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-10 text-center text-slate-600 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          Loading customers...
        </div>
      ) : customers.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-[28px] border border-[#eadfce] bg-white shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
            <div className="grid grid-cols-[1.3fr_1.2fr_0.7fr_0.9fr_0.7fr_0.8fr_0.8fr_0.7fr] gap-4 border-b border-[#f0e6d9] bg-[#fbf6ef] px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <p>Customer</p>
              <p>Contact</p>
              <p>Gender</p>
              <p>Status</p>
              <p>Orders</p>
              <p>Total Spent</p>
              <p>Joined</p>
              <p>Action</p>
            </div>

            <div className="divide-y divide-[#f5ede2]">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="grid grid-cols-1 gap-4 px-6 py-5 text-sm md:grid-cols-[1.3fr_1.2fr_0.7fr_0.9fr_0.7fr_0.8fr_0.8fr_0.7fr]"
                >
                  <div>
                    <p className="font-semibold text-[#2f1b12]">
                      {customer.name || "Unnamed customer"}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {customer.phone}
                    </p>
                  </div>
                  <div className="text-slate-600">
                    <p>{customer.email || "-"}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                      Customer ID
                    </p>
                  </div>
                  <p className="capitalize text-slate-600">
                    {customer.gender || "-"}
                  </p>
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        customer.isVerified
                          ? "bg-[#e5f3e4] text-[#2f6b2d]"
                          : "bg-[#f8e8cf] text-[#9a661d]"
                      }`}
                    >
                      {customer.isVerified ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <p className="font-semibold text-[#2f1b12]">
                    {customer.totalOrders}
                  </p>
                  <p className="font-semibold text-[#2f1b12]">
                    Rs. {customer.totalSpent.toFixed(2)}
                  </p>
                  <p className="text-slate-600">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                  <div>
                    <Link
                      href={`/admin/customers/${customer._id}/edit`}
                      className="rounded-full bg-[#3b2317] px-4 py-2 text-xs font-semibold text-white"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-[24px] border border-[#eadfce] bg-white px-5 py-4 shadow-[0_16px_45px_rgba(79,55,32,0.06)]">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              disabled={page <= 1}
              className="rounded-full border border-[#dccab3] px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </p>
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(current + 1, totalPages))
              }
              disabled={page >= totalPages}
              className="rounded-full border border-[#dccab3] px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-10 text-center text-slate-600 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          No customers yet.
        </div>
      )}
    </AdminShell>
  );
}
