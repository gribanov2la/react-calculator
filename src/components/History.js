import React from 'react';

const rowStyle = {
	margin: '0 0 20px'
};

export default (props) =>
	<div>{props.items.map((item, index) => <div key={'history' + index} style={rowStyle}>{item}</div>)}</div>