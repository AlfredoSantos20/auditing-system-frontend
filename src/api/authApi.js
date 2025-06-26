import api from "./index";
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};