import React from 'react';
import Calculator from '../external/Calculator';
import History from './History';
import moment from 'moment';

export default class Table extends React.Component {
	tableStyle = {
		display: 'flex',
		maxWidth: '800px',
		maxHeight: '700px',
		width: '100%',
		border: '1px solid #000',
		borderRight: 'none',
		boxSizing: 'border-box'
	};

	columnStyle = {
		width: '50%',
		borderRight: '1px solid #000',
		padding: '20px',
		overflow: 'auto'
	};

	calculateCallback(query, result) {
		let {putHistoryItem} = this.props.historyActions;
		let time = moment().format('YYYY-MM-DD HH-mm-ss');

		putHistoryItem(`${time} | ${query.join(' ')} = ${result}`);
	}

	render() {
		let {items} = this.props.history;

		return <div style={this.tableStyle}>
			<div style={this.columnStyle}><Calculator calculateCallback={this.calculateCallback.bind(this)}/></div>
			<div style={this.columnStyle}><History items={items} /></div>
		</div>
	}
}