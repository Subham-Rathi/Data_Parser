"use client";

import Link from "next/link";
import { useState } from "react";

type Result = {
  _id?: string;
  name: string;
  mobile: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  tag: "Retail" | "Wholesale";
  amount: number | "";
};

export default function Home() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [tag, setTag] = useState<Result["tag"]>("Retail");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleTagChange = (selectedTag: Result["tag"]) => {
    setTag(selectedTag);
    setSaved(false);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setSaved(false);
  };

  const handleParse = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      const parsedResults = Array.isArray(data) ? data : [data];

      setResults(
        parsedResults.map((result) => ({
          ...result,
          tag,
          amount: amount ? Number(amount) : "",
        }))
      );
      setSaved(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users: results }),
      });

      if (!res.ok) {
        throw new Error("Failed to save data");
      }

      setText("");
      setResults([]);
      setTag("Retail");
      setAmount("");
      setSaved(false);
      alert("Data saved successfully");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 text-gray-950 sm:p-8">
      <div className="mx-auto w-full max-w-4xl rounded-lg bg-white p-4 text-gray-950 shadow sm:p-6">

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-950 sm:text-3xl">
            Data Parser
          </h1>

          <Link
            href="/users"
            className="inline-flex justify-center rounded-lg bg-blue-700 px-5 py-3 text-center font-medium text-white"
          >
            Show DB Data
          </Link>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste one or multiple records here..."
          className="h-52 w-full rounded-lg border border-gray-300 bg-white p-4 text-base text-black outline-none placeholder:text-gray-500"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="font-medium text-gray-950">Tag</span>

          {(["Retail", "Wholesale"] as const).map((option) => (
            <label
              key={option}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 cursor-pointer ${
                tag === option
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <input
                type="radio"
                name="tag"
                value={option}
                checked={tag === option}
                onChange={() => handleTagChange(option)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>

        <div className="mt-4 max-w-xs">
          <label className="mb-2 block font-medium" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Enter amount"
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-base text-black outline-none placeholder:text-gray-500"
          />
        </div>

        <button
          onClick={handleParse}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-black text-white rounded-lg cursor-pointer disabled:bg-gray-400"
        >
          {loading ? "Parsing..." : "Parse Data"}
        </button>

        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-xl font-semibold">
              Parsed Data
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-[760px] w-full border border-collapse text-sm text-gray-950 sm:text-base">

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
                  {results.map((result, index) => (
                    <tr key={result._id ?? `${result.mobile}-${result.pincode}-${index}`}>
                      <td className="border p-3">{result.name}</td>
                      <td className="border p-3">{result.mobile}</td>
                      <td className="border p-3 break-words">{result.address}</td>
                      <td className="border p-3">{result.pincode}</td>
                      <td className="border p-3">{result.city}</td>
                      <td className="border p-3">{result.state}</td>
                      <td className="border p-3"><b>{result.tag}</b></td>
                      <td className="border p-3"><b>{result.amount}</b></td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="mt-4 px-6 py-3 bg-green-700 text-white rounded-lg cursor-pointer disabled:bg-gray-400"
            >
              {saving ? "Saving..." : saved ? "Saved" : "Save Data"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
