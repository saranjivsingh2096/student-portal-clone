import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

const useFetchData = (url, queryKey) => {
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      // Clear any invalid auth data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/login");
      throw new Error("Authentication required");
    }

    // Add user parameter to URL
    const urlWithUser = `${url}${url.includes('?') ? '&' : '?'}user=${user}`;

    const response = await fetch(urlWithUser, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/login");
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    
    // Verify that the returned data belongs to the authenticated user
    if (data.userId && data.userId !== user) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/login");
      throw new Error("Unauthorized access");
    }

    return data;
  };

  // The queryKey should be unique to this query.
  // If the URL can change, it should be part of the queryKey.
  // Example: ['fetchData', url]
  // If you have a more specific name for the data, use that: e.g., ['studentProfile', studentId]
  const { data, error, isLoading, isError } = useQuery(queryKey || url, fetchData, {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Return a more comprehensive state that React Query provides
  return { data, error, isLoading, isError }; 
};

export default useFetchData;
