import React from 'react';

const style = {
	color: 'white',
	background: '#1c191c',
	lineHeight: '130px',
	flex: '1',
	width: '100%',
	height: '130px',
	padding: '5px',
	boxSizing: 'border-box'
};
const baseFontSize = 90;
const fontSizeUnits = 'px';
const baseSymbolsCount = 6;

export default (props) => {
	let {text} = props;
	let fontSize = text.length <= baseSymbolsCount
		? baseFontSize
		: ((baseSymbolsCount*baseFontSize) / text.length);

	return <div style={{...style, fontSize: fontSize + fontSizeUnits}}>{text}</div>;
}