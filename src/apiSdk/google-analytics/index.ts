import axios from 'axios';
import queryString from 'query-string';
import { GoogleAnalyticsInterface, GoogleAnalyticsGetQueryInterface } from 'interfaces/google-analytics';
import { GetQueryInterface } from '../../interfaces';

export const getGoogleAnalytics = async (query?: GoogleAnalyticsGetQueryInterface) => {
  const response = await axios.get(`/api/google-analytics${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createGoogleAnalytics = async (googleAnalytics: GoogleAnalyticsInterface) => {
  const response = await axios.post('/api/google-analytics', googleAnalytics);
  return response.data;
};

export const updateGoogleAnalyticsById = async (id: string, googleAnalytics: GoogleAnalyticsInterface) => {
  const response = await axios.put(`/api/google-analytics/${id}`, googleAnalytics);
  return response.data;
};

export const getGoogleAnalyticsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/google-analytics/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteGoogleAnalyticsById = async (id: string) => {
  const response = await axios.delete(`/api/google-analytics/${id}`);
  return response.data;
};
