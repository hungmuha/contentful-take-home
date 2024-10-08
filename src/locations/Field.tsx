import { FormEvent, useEffect, useState } from 'react';
import { FieldAppSDK } from '@contentful/app-sdk';
import { useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
import { EntryProps, KeyValueMap } from 'contentful-management';
import { Button, Modal, Subheading, Text } from '@contentful/f36-components';
import ImageDisplay from '../components/ImageDisplay';
import getImages, {
  ImageModel,
} from '../services/PixabayImage';
import './Field.css';

const Field = () => {
  useAutoResizer();
  const sdk = useSDK<FieldAppSDK>();
  const entryId: string = sdk.ids.entry;
  const cma = sdk.cma;

  const [baseEntry, setBaseEntry] = useState<EntryProps<KeyValueMap>>();
  const [images, setImages] = useState<ImageModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectImage, setSelectImage] = useState<ImageModel>();
  const [isShown, setShown] = useState(false);

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

  useEffect(() => {
    const fetchEntry = async (entryId: string) => {
      const entry = await cma.entry.get({ entryId: entryId });
      if (entry.fields['image']) setSelectImage(entry.fields['image']['en-US']);
      setBaseEntry(entry);
    };
    fetchEntry(entryId);
  }, []);

  const openModal = async () => {
    setShown(true);
    const images = await getImages(searchQuery);
    setImages(images);
  };

  const handleImageSelect = async (image: ImageModel) => {
    setSelectImage(image);
  };

  const handleDeselectImage = () => {
    setSelectImage(undefined);
  };


  // set e as event type
  const searchImages = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const images = await getImages(searchQuery);
      setImages(images);
  };

  return (
    <div className={`image-app ${isShown ? 'show-modal' : ''}`}>
      <Button onClick={openModal}>Open Image Selector</Button>
      <Modal onClose={() => setShown(false)} isShown={isShown}>
        {() => (
          <>
            <Modal.Header
              title='Image Selector'
              security='select image for entry'
              onClose={() => setShown(false)}
            />
            <Modal.Content>
              {/* TODO: add tool tip to image for instruction if clicked would deselect image*/}
              {selectImage ? (
                <div className='selected-image-container'>
                  <Subheading>Selected Image</Subheading>
                  <ImageDisplay
                    model={selectImage}
                    handleClick={handleDeselectImage}
                    isPreview={false}
                  />
                </div>
              ) : null}
              <Subheading>Search for images</Subheading>
              <form onSubmit={searchImages} className='search-bar'>
                <input
                  type='text'
                  placeholder='Type the image you want...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='search-input'
                />
                <button type='submit' className='search-button'>
                  Search
                </button>
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
            </Modal.Content>
          </>
        )}
      </Modal>
      {/* TODO: add tool tip to image for instruction if clicked would deselect image*/}
      {selectImage ? (
        <div className='selected-image-container'>
          <Subheading>Selected Image URL: <Text>{selectImage.previewURL}</Text></Subheading>
        </div>
      ) : null}
    </div>
  );
};

export default Field;
