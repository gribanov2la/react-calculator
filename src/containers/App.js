import React from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {pushHistoryItems, putHistoryItem} from "../actions/history";
import Table from '../components/Table';

class App extends React.Component {
	render() {
		return <Table {...this.props}/>;
	}
}

export default connect(
	state => ({history: state.history}),
	dispatch => ({historyActions: bindActionCreators({pushHistoryItems, putHistoryItem}, dispatch)})
)(App)

