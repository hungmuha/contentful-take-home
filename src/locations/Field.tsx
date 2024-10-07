import { FieldAppSDK } from '@contentful/app-sdk';
import { Paragraph } from '@contentful/f36-components';
import { useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
import axios from 'axios';
import { EntryProps, KeyValueMap } from 'contentful-management';
import { useEffect, useState } from 'react';
import ImageDisplay from '../components/ImageDisplay';
import './Field.css';
const PIXA_API_KEY = '46333734-3d443a8f1d12cf7decd891fec';

const Field = () => {
  useAutoResizer({ absoluteElements: true });
  const sdk = useSDK<FieldAppSDK>();
  const entryId: string = sdk.ids.entry;
  const [baseEntry, setBaseEntry] = useState<EntryProps<KeyValueMap>>();
  const cma = sdk.cma;

  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectImage, setSelectImage] = useState('');

  useEffect(() => {
    const updateImage = async () => {
      if (!baseEntry) return;
      const entry: EntryProps<KeyValueMap> = { ...baseEntry };
      console.log(entry);
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

  const handleImageSelect = async (image) => {
    setSelectImage(image);
  };

  const handleDeselectImage = () => {
    setSelectImage('');
  }

  useEffect(() => {
    const fetchEntry = async (entryId: string) => {
      const entry = await cma.entry.get({ entryId: entryId });
      console.log(entry);
      if (entry.fields['image']) setSelectImage(entry.fields['image']['en-US']);
      setBaseEntry(entry);
    };
    fetchEntry(entryId);
  }, []);

  const searchImages = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.get(
        `https://pixabay.com/api/?key=${PIXA_API_KEY}&q=${encodeURIComponent(
          searchQuery
        )}&image_type=photo`
      );
      console.log(response.data.hits);
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
