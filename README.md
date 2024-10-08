This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

## How to use

Execute create-contentful-app with npm, npx or yarn to bootstrap the example:

```bash
# npx
npx create-contentful-app --example vite-react

# npm
npm init contentful-app --example vite-react

# Yarn
yarn create contentful-app --example vite-react
```

## Available Scripts

In the project directory, you can run:

#### `npm start`

Creates or updates your app definition in Contentful, and runs the app in development mode.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

#### `npm run upload`

Uploads the `dist` folder to Contentful and creates a bundle that is automatically activated.
The command guides you through the deployment process and asks for all required arguments.
Read [here](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/#deploy-with-contentful) for more information about the deployment process.

#### `npm run upload-ci`

Similar to `npm run upload` it will upload your app to contentful and activate it. The only difference is  
that with this command all required arguments are read from the environment variables, for example when you add
the upload command to your CI pipeline.

For this command to work, the following environment variables must be set:

- `CONTENTFUL_ORG_ID` - The ID of your organization
- `CONTENTFUL_APP_DEF_ID` - The ID of the app to which to add the bundle
- `CONTENTFUL_ACCESS_TOKEN` - A personal [access token](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/personal-access-tokens)

## Libraries to use

To make your app look and feel like Contentful use the following libraries:

- [Forma 36](https://f36.contentful.com/) – Contentful's design system
- [Contentful Field Editors](https://www.contentful.com/developers/docs/extensibility/field-editors/) – Contentful's field editor React components

## Using the `contentful-management` SDK

In the default create contentful app output, a contentful management client is
passed into each location. This can be used to interact with Contentful's
management API. For example

```js
// Use the client
cma.locale.getMany({}).then((locales) => console.log(locales));
```

Visit the [`contentful-management` documentation](https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library)
to find out more.

## Learn More

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.

## Note for collaborators/developers
The app is deployed in Contentful
Installing link to the app in Contentful:
https://app.contentful.com/deeplink?link=apps&id=4Tx3xEhI7taGq2RjCGbCQp

## Thinking process for this test
1. I have created a new app in Contentful and added the app to the space.
2. I created a content model in this case called Image Selector with the field called image as JSON object.
3. From here I can install the app to the space and imbedded the app to the content model.
4. As instruction, I developed in Field.tsx and I used the CMA to retrieve the entry using the EntryId
5. I break the app down to 2 main portion the searching image section and the selected image section.
6. I abstracted out the imageDisplay component to make it reusable. I give it an interface to make it easier to work with.
7. I created a couple interfaces for the api response and the image object to make it easier to work with.
8. As data come back from the Pixabay, I set the data to the state and pass it down to the imageDisplay component.
9. I created a search bar to search for the image and display the image in the imageDisplay component. I found it easier with a search bar to search for the image vs just browsing through the images.
10. Editor can click the image returned from pixabay to select it and it will display in the selected image section and also attached it to the Entry via the CMA, the Entry is updated to Contentful.
11. I make a simple feature by clicking the selectedImage to deselect the image. Although I can spend a little more time to make it more user friendly with a deselect button.
12. I abstracted out the service for the api call to make it easier to work with and also to make it easier to test.


