export const handleLogout = async (navigate) => {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/login");
    } else {
      console.error("Logout failed.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
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
