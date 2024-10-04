import { Paragraph } from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";
import { useState } from "react";

const Search = () => {
  const sdk = useSDK<SearchAppSDK>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectImage, setSelectImage] = useState('');

  const searchImages = async () => {
    const images = await sdk.searchImages(searchQuery);
    console.log(images);
  };

  return (
    <>
      <p>Search for an image:</p>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchImages}>Search</button>
      <Paragraph>Hello Search Component (AppId: {sdk.ids.app})</Paragraph>
    </>
  );
}
