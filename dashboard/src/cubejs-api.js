import { useState, useEffect } from "react";
import cubejs from "@cubejs-client/core";

const CUBE_API_URL = import.meta.env.VITE_CUBE_API_URL;
const CUBE_API_TOKEN = import.meta.env.VITE_CUBE_API_TOKEN;

if (!CUBE_API_URL || !CUBE_API_TOKEN) {
  console.error("Missing Cube credentials. Check dashboard/.env file.");
}

const cubejsApi =
  CUBE_API_URL && CUBE_API_TOKEN
    ? cubejs(CUBE_API_TOKEN, { apiUrl: CUBE_API_URL })
    : null;

export default cubejsApi;

export function useCubeQuery(query) {
  const [resultSet, setResultSet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cubejsApi) {
      setError(new Error("Cube API not configured"));
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    cubejsApi
      .load(query)
      .then((res) => {
        if (!cancelled) {
          setResultSet(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(query)]);

  return { resultSet, isLoading, error };
}
