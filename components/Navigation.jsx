"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/auth";

export default function Navigation() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100); // Small delay to prevent rapid checks

    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/check");
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/add-school", label: "Add School", requireAuth: true },
    { href: "/show-schools", label: "View Schools" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            School Management
          </Link>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks
              .filter((link) => !link.requireAuth || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors ${
                    pathname === link.href
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex space-x-2 items-center">
            {navLinks
              .filter((link) => !link.requireAuth || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-medium ${
                    pathname === link.href ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
