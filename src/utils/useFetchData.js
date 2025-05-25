import { useQuery } from "react-query";

const useFetchData = (url, queryKey) => {
  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    // Consider how to handle this case: maybe throw an error or return a specific state
    // that the component can use to prompt for login.
    if (!token || !user) {
      // Returning null or an empty object might be problematic if the consuming component
      // expects a certain data structure. React Query's error state is better for this.
      throw new Error("User not authenticated"); 
    }

    const response = await fetch(`${url}?user=${user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  };

  // The queryKey should be unique to this query.
  // If the URL can change, it should be part of the queryKey.
  // Example: ['fetchData', url]
  // If you have a more specific name for the data, use that: e.g., ['studentProfile', studentId]
  const { data, error, isLoading, isError } = useQuery(queryKey || url, fetchData, {
    // Optional: configure staleTime, cacheTime, retry, refetchOnWindowFocus, etc.
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Return a more comprehensive state that React Query provides
  return { data, error, isLoading, isError }; 
};

export default useFetchData;
