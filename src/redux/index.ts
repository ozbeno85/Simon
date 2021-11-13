import { combineReducers } from 'redux'
import AppReducer from './reducers'

const RootReducer = combineReducers({
    App : AppReducer
})

export default RootReducer