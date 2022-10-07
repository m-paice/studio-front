import { useState, useCallback } from "react";

export function useAsync(asyncFunction, ...initialParams) {
  const [status, setStatus] = useState("");
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const handleResetStatus = () => {
    setStatus("idle");
  };

  const execute = useCallback((...execParams) => {
    setStatus("pending");
    setValue(null);
    setError(null);

    const params = execParams.length ? execParams : initialParams;

    return asyncFunction(...params)
      .then((response) => {
        setValue(response.data);
        setStatus("success");
      })
      .catch((e) => {
        setError(e);
        setStatus("error");
      });
  }, []);

  return { execute, handleResetStatus, status, value, error };
}
