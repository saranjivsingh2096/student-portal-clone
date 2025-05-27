export const handleLogout = async (navigate) => {
  const token = localStorage.getItem("authToken");

  // Client-side cleanup first
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  
  // Attempt to navigate to login page immediately
  // This ensures the user is redirected even if the backend call has issues.
  window.location.reload();

  // Then, attempt to notify the backend (best effort)
  if (token) { // Only attempt if a token existed
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Log if the backend logout failed, but client is already logged out
        console.warn("Backend logout request failed. Status:", response.status);
      }
    } catch (error) {
      console.warn("Error during backend logout request:", error);
    }
  }
};

export const validateToken = async () => {
  const authToken = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");

  if (!authToken || !user) {
    return false;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/validate-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ 
          username: user,
          token: authToken 
        }),
      }
    );

    if (response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return false;
    }

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    
    // Check if the response indicates success and matches the user
    if (!data.success || data.user?.username !== user) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token validation failed:", error.message);
    // Don't remove localStorage items on network errors
    return false;
  }
};
