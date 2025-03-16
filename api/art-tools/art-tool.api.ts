import * as httpRequest from '@/libs/axios';
import { ArtTool } from './types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ArtToolsParams } from './types';
import { IResPagination } from '@/types';

const getArtTools = async (params?: ArtToolsParams) => {
  try {
    const response = await httpRequest.get<ArtTool[]>('/art-tools', { params });
    console.log(params);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getArtToolById = async (id: string) => {
  try {
    const response = await httpRequest.get<ArtTool>(`/art-tools/${id}`);
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export function useArtToolQuery(id: string) {
  return useQuery({
    queryKey: ['artTool', id],
    queryFn: () => getArtToolById(id),
  });
}

// Get all brands
export const useBrandsQuery = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () =>
      getArtTools().then((res) => {
        const brands = [...new Set(res.map((tool) => tool.brand))];
        return brands;
      }),
  });
};

export const useArtToolsQuery = (params?: ArtToolsParams) => {
  return useQuery({
    queryKey: ['artTools', params],
    queryFn: () => getArtTools(params),
  });
};
