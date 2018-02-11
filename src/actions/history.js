import {PUSH_HISTORY_ITEMS, PUT_HISTORY_ITEM_REQUESTED} from '../constants/history'

export function pushHistoryItems(items) {
	return {
		type: PUSH_HISTORY_ITEMS,
		payload: {items}
	};
}

export function putHistoryItem(message) {
	return {
		type: PUT_HISTORY_ITEM_REQUESTED,
		payload: {message}
	};
}