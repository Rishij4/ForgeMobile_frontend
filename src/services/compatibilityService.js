import API from "./api";

export const runCompatibilityCheck =
  async (config) => {

    const response =
      await API.post(
        "/compatibility/check",
        config
      );

    return response.data;
};