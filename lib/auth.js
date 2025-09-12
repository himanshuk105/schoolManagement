// Client-side auth utilities
export const logout = async () => {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const checkAuth = async () => {
  try {
    const response = await fetch("/api/auth/check", {
      method: "GET",
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};
