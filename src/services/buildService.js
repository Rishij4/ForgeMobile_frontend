import API from "./api";


// SAVE BUILD
export const saveBuild =
async (data) => {

  const response =
    await API.post(
      "/builds",
      data
    );

  return response.data;

};


// GET BUILDS
export const getBuilds =
async () => {

  const response =
    await API.get(
      "/builds"
    );

  return response.data;

};


// UPDATE BUILD
export const updateBuild =
async (id, data) => {

  const response =
    await API.put(
      `/builds/${id}`,
      data
    );

  return response.data;

};
// GET PUBLIC BUILD
export const getPublicBuild =
async (id) => {

  const response =
    await API.get(

      `/builds/public/${id}`
    );

  return response.data;
};