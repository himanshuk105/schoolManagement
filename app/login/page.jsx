"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check");

      if (response.ok) {
        // Add a small delay to prevent rapid redirects
        setTimeout(() => {
          window.location.href = "/add-school";
        }, 500);
      }
    } catch (error) {
      // User not authenticated, stay on login page
    }
  };

  // Check if user is already authenticated
  useEffect(() => {
    checkAuth();
  }, []);

  const requestOtp = async () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStep("otp");
        setMessage("OTP sent to your email!");
      } else {
        const error = await res.json();
        setMessage(error.error || "Failed to send OTP");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!code || code.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (res.ok) {
        setMessage("Login successful! Redirecting...");
        // Wait longer to ensure cookie is set and reload to ensure it's recognized
        setTimeout(() => {
          window.location.replace("/add-school"); // Use replace instead of href
        }, 1500);
      } else {
        const error = await res.json();
        setMessage(error.error || "Invalid or expired OTP");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === "email" ? "Sign in to your account" : "Enter OTP"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === "email"
              ? "We'll send you a 6-digit code to verify your email"
              : `Code sent to ${email}`}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {message && (
            <div
              className={`p-3 rounded text-center text-sm ${
                message.includes("successful") || message.includes("sent")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {step === "email" && (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && requestOtp()}
              />
              <button
                onClick={requestOtp}
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                6-digit OTP
              </label>
              <input
                id="code"
                type="text"
                maxLength="6"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                onKeyUp={(e) => e.key === "Enter" && verifyOtp()}
              />
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setMessage("");
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
                <button
                  onClick={verifyOtp}
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
              </div>
              <button
                onClick={requestOtp}
                disabled={loading}
                className="w-full mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                Resend OTP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
