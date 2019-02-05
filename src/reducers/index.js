import { combineReducers } from 'redux';
import appReducer from './appReducer';

// Combine all the reducers
const rootReducer = combineReducers({
    app: appReducer,
})

export default rootReducer;
