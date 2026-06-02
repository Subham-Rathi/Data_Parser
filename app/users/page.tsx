"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  _id?: string;
  name?: string;
  mobile?: string;
  address?: string;
  pincode?: string;
  city?: string;
  state?: string;
  tag?: "Retail" | "Wholesale";
  amount?: number;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user");

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">
            Saved Data
          </h1>

          <Link
            href="/"
            className="px-5 py-3 bg-black text-white rounded-lg cursor-pointer"
          >
            Back to Parser
          </Link>
        </div>

        {loading && (
          <p className="text-gray-600">
            Loading saved data...
          </p>
        )}

        {!loading && error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="text-gray-600">
            No saved data found.
          </p>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Mobile</th>
                  <th className="border p-3">Address</th>
                  <th className="border p-3">Pincode</th>
                  <th className="border p-3">City</th>
                  <th className="border p-3">State</th>
                  <th className="border p-3">Tag</th>
                  <th className="border p-3">Amount</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id ?? `${user.mobile}-${user.pincode}-${index}`}>
                    <td className="border p-3">{user.name}</td>
                    <td className="border p-3">{user.mobile}</td>
                    <td className="border p-3">{user.address}</td>
                    <td className="border p-3">{user.pincode}</td>
                    <td className="border p-3">{user.city}</td>
                    <td className="border p-3">{user.state}</td>
                    <td className="border p-3">{user.tag ?? "Retail"}</td>
                    <td className="border p-3">{user.amount ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
