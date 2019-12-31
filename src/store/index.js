import {
	createStore,
	applyMiddleware
} from 'redux';
import reduxLogger from 'redux-logger';
import reduxPromise from 'redux-promise';
import reduxThunk from 'redux-thunk';
import reducer from './reducers/index';
export default createStore(reducer, applyMiddleware(reduxLogger, reduxPromise, reduxThunk));