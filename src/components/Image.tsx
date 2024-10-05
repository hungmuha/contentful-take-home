const ImageDisplay = ({ model, handleClick }) => {
  return (
    <img
      src={model.previewURL}
      alt={model.alt}
      style={{ width: '200px', height: '150px', margin: '10px' }}
      onClick={() => handleClick(model)}
    />
  );
};

export default ImageDisplay;
