import api from "../api/index";


const token = localStorage.getItem('token');


export const getAllUsers = async () => {
  try {
    
    const response = await api.post("/sections/get-sections", {
      headers: {
        Authorization: `Bearer ${token}`,  
      }
    });

    return response.data || [];  
  } catch (error) {
    console.error('Error fetching sections:', error);
    return []; 
  }
};
