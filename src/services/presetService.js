import API from "./api";

export const getPreset = async (tier, category) => {
  const response = await API.post("/preset", {
    tier,
    category
  });

  return response.data;
};