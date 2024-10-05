import { FieldAppSDK } from '@contentful/app-sdk';
import { Paragraph } from '@contentful/f36-components';
import {
  /* useCMA, */ useAutoResizer,
  useSDK,
} from '@contentful/react-apps-toolkit';
import axios from 'axios';
import { EntryProps, KeyValueMap } from 'contentful-management';
import { useEffect, useState } from 'react';
import ImageDisplay from '../components/Image';
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
      if(selectImage) {
        baseEntry.fields['image'] = {
          'en-US': selectImage,
        }
      } else {
        delete baseEntry.fields['image'];
      }
      const updatedEntry = await cma.entry.update({ entryId: entryId }, entry);
      if (updatedEntry) setBaseEntry(updatedEntry);
    };
    updateImage();
  }, [selectImage]);

  const handleImageSelect = async (image) => {
    if(selectImage) {
      setSelectImage('');
      return;
    }
    setSelectImage(image);
  };

  useEffect(() => {
    const fetchEntry = async (entryId: string) => {
      const entry = await cma.entry.get({ entryId: entryId });
      console.log(entry);
      if(entry.fields['image']) setSelectImage(entry.fields['image']['en-US']);
      setBaseEntry(entry);
    };
    fetchEntry(entryId);
  }, []);

  const searchImages = async () => {
    try {
      console.log(searchQuery);
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
    <>
      <div>
        {selectImage ? (
          <div>
            <p>attached image:</p>
            <ImageDisplay model={selectImage} handleClick={handleImageSelect}/>
          </div>
        ) : null}
      </div>
      <p>Search for an image:</p>
      <input
        type='text'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchImages}>Search</button>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((image) => (
          <ImageDisplay key={image.id} model={image} handleClick={handleImageSelect} />
        ))}
      </div>
      <Paragraph>Hello Entry Field Component (AppId: {sdk.ids.app})</Paragraph>
    </>
  );
};

export default Field;
