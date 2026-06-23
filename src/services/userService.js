import API from "./api";

export const getProfileStats =
async () => {

  const response =
    await API.get(
      "/users/profile-stats"
    );

  return response.data;
};