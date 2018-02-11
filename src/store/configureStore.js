import {createStore, applyMiddleware} from 'redux'
import rootReducer from '../reducers'
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import saga from '../services/saga';

export default function configureStore(initialState) {
	let sagaMiddleware = createSagaMiddleware();
	let store = createStore(
		rootReducer,
		initialState,
		applyMiddleware(thunk, sagaMiddleware)
	);

	sagaMiddleware.run(saga);

	return store
}
