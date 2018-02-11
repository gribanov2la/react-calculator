import {PUSH_HISTORY_ITEMS} from '../constants/history';

const initialState = {
	items: [],
};

export default function history(state = initialState, action) {
	switch (action.type) {
		case PUSH_HISTORY_ITEMS:
			return {...state, items: [...state.items, ...action.payload.items]};
		default:
			return state;
	}
}
