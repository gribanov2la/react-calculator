import React from 'react';

const style =  {
	width: '80px',
	height: '80px',
	textAlign: 'center',
	lineHeight: '80px',
	textRendering: 'auto',
	color: 'initial',
	letterSpacing: 'normal',
	wordSpacing: 'normal',
	textTransform: 'none',
	textIndent: '0px',
	textShadow: 'none',
	display: 'inline-block',
	margin: '0em',
	fontSize: '3em',
	fontWeight: '100',
	border: 'none',
	borderRight: '1px solid #666',
	padding: 0,
	boxSizing: 'content-box',
	cursor: 'pointer'
};
const orangeMixin = {
	background: 'rgba(252,156,23,1)',
	color: 'white'
};
const grayMixin = {
	background: '#e0e0e7'
};
const doubleMixin = {
	width: '161px'
};


export default (props) => {
	let {config, buttonClickCallback} = props;
	let _style = {...style};

	if (!config.theme || config.theme === 'gray') {
		_style = {..._style, ...grayMixin};
	}
	if (config.theme === 'orange') {
		_style = {..._style, ...orangeMixin};
	}
	if (config.size === 2) {
		_style = {..._style, ...doubleMixin};
	}

	return <button style={_style} onClick={buttonClickCallback.bind(this, config)}>{config.caption}</button>
}