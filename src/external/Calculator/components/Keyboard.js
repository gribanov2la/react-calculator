import React from 'react';
import Button from './Button';

const rowStyle = {
	border: 'none',
	borderBottom: '1px solid #666',
	borderLeft: '1px solid #666',
};

export default (props) =>
	<div>
		{props.layout.map((row, index) =>
			<div style={rowStyle} key={'row' + index} className="row">
				{row.map((button, index) =>
					<Button key={'button' + index} buttonClickCallback={props.buttonClickCallback} config={button}/>
				)}
			</div>
		)}
	</div>
