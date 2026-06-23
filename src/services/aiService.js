import axios from "axios";

const API_URL =
  "http://localhost:5000/api/ai";

export const analyzeBuild = async (
  buildData
) => {
  const response = await axios.post(
  `${API_URL}/analyze`,
  buildData,
  {
    timeout: 120000
  }
);

  return response.data;
};