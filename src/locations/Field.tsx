import { FieldAppSDK } from '@contentful/app-sdk';
import { Paragraph } from '@contentful/f36-components';
import { /* useCMA, */ useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
import axios from 'axios';
import { EntryProps, KeyValueMap } from 'contentful-management';
import { useEffect, useState } from 'react';
const PIXA_API_KEY = '46333734-3d443a8f1d12cf7decd891fec';

const Field = () => {
  useAutoResizer({ absoluteElements: true })
  const sdk = useSDK<FieldAppSDK>();
  const entryId: string = sdk.ids.entry
  const [baseEntry, setBaseEntry] = useState<EntryProps<KeyValueMap>>()
  const cma = sdk.cma;
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectImage, setSelectImage] = useState('');

  const handleImageSelect = async (image) => {
    setSelectImage(image);
    if (!baseEntry) return
    const entry: EntryProps<KeyValueMap> = { ...baseEntry }
    console.log(entry)
    baseEntry.fields['image'] = {
      'en-US': image
    }
    const updatedEntry = await cma.entry.update({ entryId: entryId }, entry)
    if(updatedEntry) setBaseEntry(updatedEntry)
  }

  useEffect(() => {
    const fetchEntry = async (entryId: string) => {
      const entry = await cma.entry.get({ entryId: entryId })
      console.log(entry)
      setBaseEntry(entry)
    }
    fetchEntry(entryId)
  }, [])

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
      <p>Search for an image:</p>
      <input
        type='text'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchImages}>Search</button>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((image) => (
          <div key={image.id} style={{ margin: '10px'}}>
            <img
              src={image.previewURL}
              alt={image.tags}
              style={{ cursor: 'pointer', width: '200px', height:'150px'}}
              onClick={() => handleImageSelect(image)}
            />
          </div>
        ))}
      </div>
      <Paragraph>Hello Entry Field Component (AppId: {sdk.ids.app})</Paragraph>
    </>
  );
};

export default Field;
