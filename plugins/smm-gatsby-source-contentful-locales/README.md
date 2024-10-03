# gatsby-source-contentful-locales

Source plugin for pulling locales from contentful spaces.
It creates a list with all the locales available and exposes information like default locale and fallback locale.

### Install
```bash
# npm
npm install --save gatsby-source-contentful-locales
# yarn
yarn add gatsby-source-contentful-locales
```

### Usage

```js 
// In your gatsby-config.js
// Learn about environment variables on Gatsby: https://gatsby.dev/env-vars
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-contentful-locales`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    },
  ],
}
```

### Configuration options

**spaceId** [string][required]

Contentful spaceId

**accessToken** [string][required]

Contentful delivery api key

### How to query
```graphql
{
  allContentfulLocale {
    totalCount
      edges {
        node {
          id
          code
          name
          default
          fallbackCode
        }
      }
    }
  }
```
