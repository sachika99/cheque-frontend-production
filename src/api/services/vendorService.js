import axios from 'axios';
import { API_CONFIGURATIONS } from '../constants/apiConfigurations';

const axiosInstance = axios.create({
  baseURL: API_CONFIGURATIONS.BASE_URL,
  headers: API_CONFIGURATIONS.HEADERS,
});
 
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class VendorService { 
  async getAllVendors() {
    try {
      const response = await axiosInstance.get(API_CONFIGURATIONS.ENDPOINTS.VENDORS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
 
  async getActiveVendors() {
    try {
      const response = await axiosInstance.get(API_CONFIGURATIONS.ENDPOINTS.VENDORS_ACTIVE);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
 
  async getVendorById(id) {
    try {
      const response = await axiosInstance.get(API_CONFIGURATIONS.ENDPOINTS.VENDOR_BY_ID(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
 
  async getVendorByCode(vendorCode) {
    try {
      const response = await axiosInstance.get(API_CONFIGURATIONS.ENDPOINTS.VENDOR_BY_CODE(vendorCode));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
 
  async searchVendors(searchCriteria) {
    try {
      const params = new URLSearchParams();
      if (searchCriteria.searchTerm) params.append('searchTerm', searchCriteria.searchTerm);
      if (searchCriteria.status) params.append('status', searchCriteria.status);
      params.append('pageNumber', searchCriteria.pageNumber || 1);
      params.append('pageSize', searchCriteria.pageSize || 10);

      const response = await axiosInstance.get(`${API_CONFIGURATIONS.ENDPOINTS.VENDORS_SEARCH}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
 
  async createVendor(vendorData) {
    try {
      const response = await axiosInstance.post(API_CONFIGURATIONS.ENDPOINTS.VENDORS, vendorData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
 
  async updateVendor(id, vendorData) {
    try {
      const response = await axiosInstance.put(API_CONFIGURATIONS.ENDPOINTS.VENDOR_BY_ID(id), vendorData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
 
  async deleteVendor(id) {
    try {
      await axiosInstance.delete(API_CONFIGURATIONS.ENDPOINTS.VENDOR_BY_ID(id));
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }
 
  async activateVendor(id) {
    try {
      const response = await axiosInstance.patch(API_CONFIGURATIONS.ENDPOINTS.VENDOR_ACTIVATE(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
 
  async deactivateVendor(id) {
    try {
      const response = await axiosInstance.patch(API_CONFIGURATIONS.ENDPOINTS.VENDOR_DEACTIVATE(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
 
  handleError(error) {
    if (error.response) { 
      return new Error(error.response.data?.message || error.response.statusText || 'An error occurred');
    } else if (error.request) { 
      return new Error('No response from server. Please check your connection.');
    } else { 
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new VendorService();
