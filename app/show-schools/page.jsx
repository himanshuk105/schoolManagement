"use client";

import SchoolCard from "@/components/SchoolCard";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ShowSchoolsPage() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sync, setSync] = useState(false);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/schools?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      console.log(result);

      if (result.success) {
        setSync(true);
      }
    } catch (error) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [sync]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const limit = 20; // how many rows you want
      const offset = 0; // from which row

      const response = await fetch(
        `/api/schools?limit=${limit}&offset=${offset}`
      );
      const result = await response.json();

      console.log(result);

      if (result.success) {
        setSchools(result.data);
      } else {
        setError("Failed to fetch schools");
      }
    } catch (err) {
      setError("Error loading schools");
      console.error("Fetch error:", err);
    }
    setLoading(false);
    setSync(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Schools Directory
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-8">
          {error}
        </div>
      )}

      {schools.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">
            No schools found in the directory.
          </p>
          <Link
            href="/add-school"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add the first school
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
