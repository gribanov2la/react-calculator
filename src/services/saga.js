import {call, put, takeEvery, fork, take} from 'redux-saga/effects'
import {eventChannel} from 'redux-saga';
import {FETCH_HISTORY_ITEMS_REQUESTED, PUT_HISTORY_ITEM_REQUESTED} from '../constants/history';
import {pushHistoryItems} from '../actions/history';
import PouchApi from '../api/pouch';

const pouchApi = new PouchApi('http://127.0.0.1:5984/history');

/**
 * Запрашивает историю операций из couchDB
 */
function* fetchHistoryItems() {
	try {
		let items = yield call([pouchApi, pouchApi.fetchHistoryItems]);
		yield put(pushHistoryItems(items));
	} catch (e) {
		//something :)
	}
}

/**
 * Добавляет новую запись в истории couchDB
 *
 * @param action
 */
function* putHistoryItem(action) {
	try {
		yield call([pouchApi, pouchApi.putHistoryItem], action.payload.message);
	} catch (e) {
		//something :)
	}
}

/**
 * Подпиывается на изменения couchDB
 *
 * @param dbConnection
 * @returns {Channel<T>}
 */
function subscribePouchChanges(dbConnection) {
	return eventChannel(emit => {
		dbConnection.on('change', (change) => {
			emit(pushHistoryItems([change.doc.message]));
		});
		return () => {};
	});
}

/**
 *  Добавляет новые записи из коуча
 */
function* listenHistoryItems() {
	try	{
		const channel = yield call(subscribePouchChanges, pouchApi.createChanges());
		while (true) { // :D
			let action = yield take(channel);
			yield put(action);
		}
	} catch (e) {
		//something :)
	}
}

/**
 * Подулючаем генераторы саги
 */
function* rootSaga() {
	yield takeEvery(FETCH_HISTORY_ITEMS_REQUESTED, fetchHistoryItems);
	yield takeEvery(PUT_HISTORY_ITEM_REQUESTED, putHistoryItem);
	yield fork(fetchHistoryItems);
	yield fork(listenHistoryItems);
}

export default rootSaga;