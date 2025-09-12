import Image from "next/image";
import Link from "next/link";

export default function SchoolCard({ school, authenticated }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg relative">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100">
        {school.image ? (
          <Image
            src={school.image}
            alt={school.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 flex-col">
            <svg
              className="w-12 h-12 mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
            <p className="text-sm">No Image</p>
          </div>
        )}

        {/* Edit button overlay */}
        {authenticated && (
          <Link
            href={`/edit?id=${school.id}`}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 shadow-sm border border-gray-200 rounded-full p-2 transition"
            aria-label="Edit"
          >
            {/* Pencil SVG (no dependency) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2.5 2.5 0 113.536 3.536L12.536 14.5H9v-3.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 20H5a2 2 0 01-2-2V7a2 2 0 012-2h7"
              />
            </svg>
          </Link>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {school.name}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-1">
          {school.address}
        </p>
        <p className="text-gray-800 font-medium">{school.city}</p>
      </div>
    </div>
  );
}
