import config from '@/configs';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const httpRequest = axios.create({
  baseURL: config.API.API_URL,
});

export const sleep = (ms = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const get = async <T extends object>(path: string, options?: AxiosRequestConfig<object>) => {
  const response = await httpRequest.get<T>(path, options);
  return response.data;
};

export const post = async <T extends object>(path: string, data?: object, options?: AxiosRequestConfig<object>) => {
  const response = await httpRequest.post<T>(path, data, options);
  return response.data;
};

export const patch = async <T extends object>(path: string, data: object, options?: AxiosRequestConfig<object>) => {
  const response = await httpRequest.patch<T>(path, data, options);
  return response.data;
};

export const put = async <T extends object>(path: string, data: object, options?: AxiosRequestConfig<object>) => {
  const response = await httpRequest.put<T>(path, data, options);
  return response.data;
};

export const remove = async <T extends object>(path: string, options: AxiosRequestConfig<object>) => {
  const response = await httpRequest.delete<T>(path, options);
  return response.data;
};

export default httpRequest;
