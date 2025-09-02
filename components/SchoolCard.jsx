import Image from "next/image";

export default function SchoolCard({ school, handleDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 relative">
      <div className="relative h-48 bg-gray-200">
        {school.image ? (
          <Image
            src={`${school.image}`}
            alt={school.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {school.name}
        </h3>
        <p className="text-gray-600 text-sm mb-1 line-clamp-2">
          {school.address}
        </p>
        <p className="text-gray-700 font-medium">{school.city}</p>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleDelete(school.id);
          }}
          className="text-gray-700 font-medium mt-2 border border-black p-2  rounded-lg cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
