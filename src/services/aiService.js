import API from "./api";

export const analyzeBuild = async (buildData) => {
  const response = await API.post(
    "/ai/analyze",
    buildData,
    { timeout: 120000 }
  );

  return response.data;
};
