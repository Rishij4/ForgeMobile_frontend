import { useState } from "react";

import {
  runCompatibilityCheck
} from "../services/compatibilityService";

const useCompatibility = () => {

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const checkConfig =
    async (config) => {

      try {

        setLoading(true);

        const data =
          await runCompatibilityCheck(config);

        setResult(data);

      } catch (err) {

  setError(
    err.response?.data?.message ||
    "Compatibility failed"
  );

  throw err;     // VERY IMPORTANT
} finally {

        setLoading(false);
      }
    };
    const resetCompatibility = () => {

  setResult(null);

  setError(null);

};

  return {
  result,
  loading,
  error,
  checkConfig,
  resetCompatibility
};
};

export default useCompatibility;