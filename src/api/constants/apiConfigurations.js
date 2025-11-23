const BASE_URL =
    import.meta.env.VITE_BASE_URL || 'https://localhost:44362/api';

export const API_CONFIGURATIONS = {
    BASE_URL: BASE_URL,
    HEADERS: {
        'Content-Type': 'application/json',
    },
    ENDPOINTS: {

        VENDORS: '/vendors',
        VENDORS_ACTIVE: '/vendors/active',
        VENDOR_BY_ID: (id) => `/vendors/${id}`,
        VENDOR_BY_CODE: (code) => `/vendors/code/${code}`,
        VENDORS_SEARCH: '/vendors/search',
        VENDOR_ACTIVATE: (id) => `/vendors/${id}/activate`,
        VENDOR_DEACTIVATE: (id) => `/vendors/${id}/deactivate`,
        REGISTER_USER: `${BASE_URL}/register`,

        BANKS: '/Banks',
        BANK_BY_ID: (id) => `/banks/${id}`,
        BANKSVACCOUNT: '/Banks/account',

        BANKACCOUNT: '/BankAccounts',
        BANKACCOUNT_BY_ID: (id) => `/BankAccounts/${id}`,
        
        CHEQUEBOOK: '/ChequeBooks',
        CHEQUEBOOK_BY_ID: (id) => `/ChequeBooks/${id}`,
        CHEQUEBOOK_BY_BANKACCOUNTID: (id) => `/ChequeBooks/account/${id}`,

        CHEQUE: '/Cheques',
        CHEQUE_BY_ID: (id) => `/Cheques/${id}`,

        LOGIN_USER: `${BASE_URL}/login`,
        FORGOT_PASSWORD_USER: `${BASE_URL}/forgot-password`,
        RESET_PASSWORD_USER: `${BASE_URL}/reset-password`,
        LOGOUT_USER: `${BASE_URL}/logout`,
        VERIFY_EMAIL: `${BASE_URL}/verify-email`,
    },
};