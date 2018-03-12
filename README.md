# App Builders 2018 iOS & Android app


## Prerequisites

Ensure you have installed [node/npm](https://nodejs.org/), [yarn](https://yarnpkg.com/) (optional) and [react-native-cli](http://facebook.github.io/react-native/docs/getting-started.html#the-react-native-cli).

## Installation

Install dependencies

```bash
yarn install
```

Link native packages

```bash
react-native link
```

To seed the Cloud Firestore database, execute the following script which will post `data.json` to Firebase:

```bash
node SeedFirestore.js
```