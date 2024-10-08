import { ImageModel } from '../services/PixabayImage';
import './ImageDisplay.css';

export interface ImageDisplayProps {
  model: ImageModel;
  handleClick: (model: ImageModel) => void;
  isPreview?: boolean;
}

const ImageDisplay = ({ model, handleClick, isPreview = true }: ImageDisplayProps) => {
  return (
    <div className='image-container'>
      <img
        src={isPreview ? model.previewURL : model.webformatURL}
        alt={model.alt}
        className={isPreview ? 'preview-image' : 'full-image'}
        onClick={() => handleClick(model)}
      />
    </div>
  );
};

export default ImageDisplay;
