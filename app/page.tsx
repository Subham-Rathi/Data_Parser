"use client";

import { useState } from "react";

type Result = {
  name: string;
  mobile: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
};

export default function Home() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

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

      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          Data Parser
        </h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste one or multiple records here..."
          className="w-full border rounded-lg p-4 h-52 outline-none"
        />

        <button
          onClick={handleParse}
          disabled={loading}
          className="mt-4 px-6 py-3 bg-black text-white rounded-lg cursor-pointer disabled:bg-gray-400"
        >
          {loading ? "Parsing..." : "Parse Data"}
        </button>

        {results.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border border-collapse">

              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Mobile</th>
                  <th className="border p-3">Address</th>
                  <th className="border p-3">Pincode</th>
                  <th className="border p-3">City</th>
                  <th className="border p-3">State</th>
                </tr>
              </thead>

              <tbody>
                {results.map((result, index) => (
                  <tr key={`${result.mobile}-${result.pincode}-${index}`}>
                    <td className="border p-3">{result.name}</td>
                    <td className="border p-3">{result.mobile}</td>
                    <td className="border p-3">{result.address}</td>
                    <td className="border p-3">{result.pincode}</td>
                    <td className="border p-3">{result.city}</td>
                    <td className="border p-3">{result.state}</td>
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
