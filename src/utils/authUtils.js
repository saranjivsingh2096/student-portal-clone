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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
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
  if (!authToken) return false;

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/validate-token`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error("Token validation failed:", error.message);
    return false;
  }
};
