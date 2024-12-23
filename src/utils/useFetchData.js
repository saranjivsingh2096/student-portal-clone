import { useState, useEffect, useCallback } from "react";

const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");
      if (!token || !user) return null;

      const response = await fetch(`${url}?user=${user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error };
};

export default useFetchData;
