import './ImageDisplay.css';

const ImageDisplay = ({ model, handleClick, isPreview = true }) => {
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
