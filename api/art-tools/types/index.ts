import { IReqPagination } from '@/types';

export interface Feedback {
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface ArtTool {
  id: string;
  artName: string;
  price: number;
  description: string;
  glassSurface: boolean;
  image: string;
  brand: string;
  limitedTimeDeal: number;
  feedbacks?: Feedback[];
}

export interface ArtToolsParams {
  brand?: string;
  artName?: string;
}
