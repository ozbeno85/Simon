import { createStore, } from 'redux';
import RootReducer from '.';

let storeInstance: any;

export default function () {
  if (storeInstance) {
    return storeInstance;
  }

  storeInstance = createStore(RootReducer);

  return storeInstance;
}
