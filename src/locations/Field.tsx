import { FieldAppSDK } from '@contentful/app-sdk';
import { Paragraph } from '@contentful/f36-components';
import { useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
import axios from 'axios';
import { EntryProps, KeyValueMap } from 'contentful-management';
import { FormEvent, useEffect, useState } from 'react';
import ImageDisplay from '../components/ImageDisplay';
import './Field.css';

// read the API key from the environment variables
const PIXA_API_KEY =import.meta.env.PIXA_API_KEY;

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

const Field = () => {
  useAutoResizer({ absoluteElements: true });
  const sdk = useSDK<FieldAppSDK>();
  const entryId: string = sdk.ids.entry;
  const [baseEntry, setBaseEntry] = useState<EntryProps<KeyValueMap>>();
  const cma = sdk.cma;

  const [images, setImages] = useState<ImageModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectImage, setSelectImage] = useState<ImageModel>();

  useEffect(() => {
    const updateImage = async () => {
      if (!baseEntry) return;
      const entry: EntryProps<KeyValueMap> = { ...baseEntry };
      if (selectImage) {
        baseEntry.fields['image'] = {
          'en-US': selectImage,
        };
      } else {
        delete baseEntry.fields['image'];
      }
      const updatedEntry = await cma.entry.update({ entryId: entryId }, entry);
      if (updatedEntry) setBaseEntry(updatedEntry);
    };
    updateImage();
  }, [selectImage]);

  const handleImageSelect = async (image: ImageModel) => {
    setSelectImage(image);
  };

  const handleDeselectImage = () => {
    setSelectImage(undefined);
  }

  useEffect(() => {
    const fetchEntry = async (entryId: string) => {
      const entry = await cma.entry.get({ entryId: entryId });
      if (entry.fields['image']) setSelectImage(entry.fields['image']['en-US']);
      setBaseEntry(entry);
    };
    fetchEntry(entryId);
  }, []);

  // set e as event type
  const searchImages = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await axios.get<PixabayResponse>(
        `https://pixabay.com/api/?key=${PIXA_API_KEY}&q=${encodeURIComponent(
          searchQuery
        )}&image_type=photo`
      );
      setImages(response.data.hits);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='image-app'>
      <h3>Search for an image</h3>
      <form onSubmit={searchImages} className="search-bar">
        <input
          type="text"
          placeholder="Type the image you want..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      
      <div className='image-collage'>
        {images.map((image) => (
          <ImageDisplay
            key={image.id}
            model={image}
            handleClick={handleImageSelect}
            isPreview={true}
          />
        ))}
      </div>

      {selectImage ? (
        <div className="selected-image-container">
          <h3>Selected Image</h3>
          <ImageDisplay model={selectImage} handleClick={handleDeselectImage} isPreview={false}/>
        </div>
      ) : null}
    </div>
  );
};

export default Field;
