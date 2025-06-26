import api from "./index";
export const logActivity = async ({ usernameId, activity }) => {
  try {
    const response = await api.post('/activity/logs', {
      usernameId,
      activity,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to log activity.');
  }
};


export const getAllLogs = async () => {
    try {
        const response = await api.get("/activity/get-logs");
        return response.data
    } catch (error) {
        throw new Error("Invalid Credentials")
    }
}

