const BASE_URL = import.meta.env.VITE_BASE_URL;

export const API_CONFIGURATIONS = {
    REGISTER_USER: `${BASE_URL}/register`,
    LOGIN_USER: `${BASE_URL}/login`,
    FORGOT_PASSWORD_USER: `${BASE_URL}/forgot-password`,
    RESET_PASSWORD_USER: `${BASE_URL}/reset-password`,
    LOGOUT_USER: `${BASE_URL}/logout`,
    VERIFY_EMAIL: `${BASE_URL}/verify-email`,
};
