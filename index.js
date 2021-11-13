// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// // import App from './App';
// import App from './src/App';
// import {name as appName} from './app.json';
// AppRegistry.registerComponent(appName, () => App);


/**
 * @format
 */

import React from 'react'
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import storeFactory from './src/redux/store';
// App
const Game = () => (
    <Provider store={storeFactory()}>
        <App />
    </Provider>
)

AppRegistry.registerComponent(appName, () => Game);