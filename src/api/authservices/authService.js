import axios from "axios";
import { API_CONFIGURATIONS } from "../constants/apiConfigurations";

const authService = () => {
  const register = async (email, username, password) => {
    try {
      const response = await axios.post(
        API_CONFIGURATIONS.REGISTER_USER,

        { email: email,
          username: username,
          password: password },
        { headers: { "Content-Type": "application/json" } }
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  };
 const login = async (username, password) => {
    try {
      const response = await axios.post(
        API_CONFIGURATIONS.LOGIN_USER,

        { 
          username: username,
          password: password },
        { headers: { "Content-Type": "application/json" } }
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  };
 const forgotPassword = async (email) => {
  try {
    const response = await axios.post(
      `${API_CONFIGURATIONS.FORGOT_PASSWORD_USER}?email=${encodeURIComponent(email)}`,
      null, // 👈 no request body
      { headers: { "Content-Type": "application/json" } }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
   const resetPassword = async (email, token, newPassword) => {
// debugger
    try { 
      const response = await axios.post(
        API_CONFIGURATIONS.RESET_PASSWORD_USER,

        { email: email,
          token: token,
          newPassword: newPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      // debugger
      return response;
    } catch (error) {
      throw error;
    }
  };

   const logout = async (email, username, password) => {
    try {
      const response = await axios.post(
        API_CONFIGURATIONS.REGISTER_USER,

        { email: email,
          username: username,
          password: password },
        { headers: { "Content-Type": "application/json" } }
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  };
 const verifyEmail = async (email) => {
    try {
       const response = await axios.post(
      `${API_CONFIGURATIONS.VERIFY_EMAIL}?email=${encodeURIComponent(email)}`,
      null,
      { headers: { "Content-Type": "application/json" } }
    );
      
      return response;
    } catch (error) {
      throw error;
    }
  };
  // const validManager = async (username, password) => {
  //   try {
  //     const response = await axios.post(
  //       API_CONFIGURATIONS.POST_VALIDATE_MANAGER,
  //       { Username: username, Password: password },
  //       { headers: { "Content-Type": "application/json" } }
  //     );
  //     if (response.status === 200) return { success: true, message: response.data };
  //     return { success: false, message: "Unexpected response from server." };
  //   } catch (error) {
  //     return { success: false, message: error.response?.data || "Login failed. Please check your credentials." };
  //   }
  // };

  // const validAccountant = async (username, password) => {
  //   try {
  //     const response = await axios.post(
  //       API_CONFIGURATIONS.POST_VALIDATE_ACCOUNTANT,
  //       { Username: username, Password: password },
  //       { headers: { "Content-Type": "application/json" } }
  //     );
  //     if (response.status === 200) return { success: true, message: response.data };
  //     return { success: false, message: "Unexpected response from server." };
  //   } catch (error) {
  //     return { success: false, message: error.response?.data || "Login failed. Please check your credentials." };
  //   }
  // };

  // const validateUser = async (username, password) => {
  //   const roleEndpoints = {
  //     manager: API_CONFIGURATIONS.POST_VALIDATE_MANAGER,
  //     accountant: API_CONFIGURATIONS.POST_VALIDATE_ACCOUNTANT,
  //     chiefCashier: API_CONFIGURATIONS.POST_VALIDATE_CHIEF_CASHIER,
  //   };
  //   for (const [role, endpoint] of Object.entries(roleEndpoints)) {
  //     try {
  //       const response = await axios.post(
  //         endpoint,
  //         { Username: username, Password: password },
  //         { headers: { "Content-Type": "application/json" } }
  //       );
  //       if (response.status === 200) return { success: true, role, message: response.data };
  //     } catch (error) {
  //       if (error.response?.status !== 401) console.error(`Error validating ${role}:`, error.message);
  //     }
  //   }
  //   return { success: false, message: "Invalid credentials for all roles." };
  // };


  // };



  // };

  return { register,login,forgotPassword,resetPassword,logout,verifyEmail};
};

export default authService;
