import axios from 'axios';
const PIXA_API_KEY = import.meta.env.PIXA_API_KEY;

export interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: ImageModel[];
}
export interface ImageModel {
  id: number;
  previewURL: string;
  webformatURL: string;
  alt: string;
}

const getImages = async (query: string): Promise<ImageModel[]> => {
  try {
    const response = await axios.get<PixabayResponse>(
      `https://pixabay.com/api/?key=${PIXA_API_KEY}&q=${encodeURIComponent(
        query
      )}&image_type=photo`
    );
    return response.data.hits??[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getImages;
