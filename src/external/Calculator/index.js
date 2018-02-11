import React from 'react';
import Display from './components/Display';
import Keyboard from './components/Keyboard';
import QueryProcessor from './services/QueryProcessor';

export default class Calculator extends React.Component {
	/**
	 * Знак обозначающий точку
	 *
	 * @type {string}
	 */
	point = '.';
	/**
	 * Операторы, разрешенные для использования
	 *
	 * @type {Array}
	 */
	operators = ['-', '+', '*', '/', '%'];
	/**
	 * Левосторонние унарные операторы
	 *
	 * @type {Array}
	 */
	leftUnaryOperators = ['%'];
	/**
	 * Максимальное количество операндов для вычисление (возможно расширение)
	 *
	 * @type {number}
	 */
	maxOperands = 20;
	/**
	 * Раскладка клавиатуры
	 *
	 * command: Имя метода, который будет вызван при нажатии на кнопку.
	 * operator: Оператор, который будет вставлен при нажатии
	 * operand: Операнд, который будет вставлен при нажатии
	 * caption: Надпись на кнопке.
	 * theme: цветовая схема кнопки (gray || orange).
	 *
	 * @type {Array}
	 */
	/**
	 * Количество чисел после запятой
	 *
	 * @type {Number}
	 */
	digitsAfterPoint = 6;

	keyboardLayout = [
		[
			{command: 'commandClear', caption: 'AC', theme: 'gray'},
			{command: 'commandSwitchSign', caption: '±', theme: 'gray'},
			{operator: '%', caption: '%', theme: 'gray'},
			{operator: '/', caption: '÷', theme: 'orange'}
		],
		[
			{operand: '7', caption: '7', theme: 'gray'},
			{operand: '8', caption: '8', theme: 'gray'},
			{operand: '9', caption: '9', theme: 'gray'},
			{operator: '*', caption: 'x', theme: 'orange'}
		],
		[
			{operand: '4', caption: '4', theme: 'gray'},
			{operand: '5', caption: '5', theme: 'gray'},
			{operand: '6', caption: '6', theme: 'gray'},
			{operator: '-', caption: '-', theme: 'orange'}
		],
		[
			{operand: '1', caption: '1', theme: 'gray'},
			{operand: '2', caption: '2', theme: 'gray'},
			{operand: '3', caption: '3', theme: 'gray'},
			{operator: '+', caption: '+', theme: 'orange'}
		],
		[
			{operand: '0', size: 2, caption: '0', theme: 'gray'},
			{command: 'commandAddPoint', caption: ',', theme: 'gray'},
			{command: 'commandCalculate', caption: '=', theme: 'gray'},
		],
	];

	state = {
		query: [],
	};

	style = {
		width: '325px',
		boxShadow: '0px 0px 20px 0px #aaa'
	};

	constructor(props) {
		super(props);

		this.queryProcessor = new QueryProcessor({
			digitsAfterPoint: this.digitsAfterPoint,
			point: this.point,
			operators: this.operators,
			leftUnaryOperators: this.leftUnaryOperators,
			maxOperands: this.maxOperands
		});
	}

	render() {
		let {query} = this.state;

		return <div style={this.style}>
			<Display text={query.join('')}/>
			<Keyboard layout={this.keyboardLayout} buttonClickCallback={this.processButtonClick.bind(this)}/>
		</div>;
	}

	/**
	 * Обрабатывает нажатие по кнопке калькулятора, в зависимости от конфигурации производит различные действия
	 *
	 * @param button
	 * @returns {*}
	 */
	processButtonClick(button) {
		if (typeof button.operand !== 'undefined') {
			return this.commandOperand(button.operand);
		}
		if (typeof button.command !== 'undefined') {
			return this[button.command]();
		}
		if (typeof button.operator !== 'undefined') {
			return this.commandOperator(button.operator);
		}
	}

	onCalculateCallback(query, result) {
		if (typeof this.props.calculateCallback === "function") {
			this.props.calculateCallback(query, result);
		}
	}

	/**
	 * Производит вычисление текущей query, результатом будет новый операнд, вставленый в пустую query
	 */
	commandCalculate() {
		let {query} = this.state;
		let result = this.queryProcessor.calculate(query);

		if (result === null) {
			return;
		}
		this.onCalculateCallback(query, result);

		return this.setState({query: [result]});
	}

	/**
	 * Обрабатывает команду очистки query
	 */
	commandClear() {
		return this.setState({query: this.queryProcessor.queryClear()});
	}

	/**
	 * Обрабатывает команду смены знака
	 */
	commandSwitchSign() {
		let {query} = this.state;

		return this.setState({query: this.queryProcessor.querySwitchLastOperandSign(query)});
	}

	/**
	 * Обрабатывает команду добавления точки
	 */
	commandAddPoint() {
		let {query} = this.state;

		return this.setState({query: this.queryProcessor.queryAddPoint(query, query.length - 1)});
	}

	/**
	 * Обрабатывает команду добавления операнда
	 *
	 * @param operand
	 */
	commandOperand(operand) {
		let {query} = this.state;

		return this.setState({query: this.queryProcessor.queryAddOperand(query, operand)});
	}

	/**
	 * Обрабатывает команду добавления оператора
	 *
	 * @param operator
	 */
	commandOperator(operator) {
		let {query} = this.state;

		return this.setState({query: this.queryProcessor.queryAddOperator(query, operator)});
	}
}