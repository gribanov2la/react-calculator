import mathJs from 'mathjs/dist/math';

export default class QueryProcessor {
	constructor(config) {
		let {point, operators, leftUnaryOperators, maxOperands, digitsAfterPoint} = config;

		this.point = point;
		this.digitsAfterPoint = digitsAfterPoint;
		this.operators = operators;
		this.leftUnaryOperators = leftUnaryOperators;
		this.maxOperands = maxOperands;
	}

	/**
	 * Возвращает вычисление переданной query
	 *
	 * @param query
	 * @returns {String|null}
	 */
	calculate(query) {
		if (!this._canQueryBeCalculated(query)) {
			return null;
		}
		let result = mathJs.eval(this.queryNormalizePercentages(query).join(' '));

		return this.optimizeCalculatedResult(result).toString();
	}

	/**
	 * Добавляет точку в targetIndex элемент переданной query
	 *
	 * @param query
	 * @param targetIndex
	 * @returns {Array}
	 */
	queryAddPoint(query, targetIndex) {
		let lastValue = this._getLastQueryValue(query);

		if (!this._isOperand(lastValue) || this._operandHavePoint(lastValue)) {
			return query;
		}

		return this._splice(query, targetIndex, 1, [query[targetIndex] + this.point]);
	}

	/**
	 * Возвращает пустую query
	 *
	 * @returns {Array}
	 */
	queryClear() {
		return [];
	}

	/**
	 * Рекурсивно преабразует операнды процентов (%) в формат, который сможет вычислить библиотека mathJs.
	 *
	 * @param query
	 * @returns {Array}
	 */
	queryNormalizePercentages(query) {
		let percentIndex = query.indexOf('%');
		let nextIsOperand;

		if (percentIndex === -1) {
			return query;
		}
		nextIsOperand = this._isOperand(query[percentIndex + 1]);
		if (nextIsOperand) {
			return this.queryNormalizePercentages(this._splice(query, percentIndex, 1, ['*', '0.01', '*']));
		}

		return this.queryNormalizePercentages(this._splice(query, percentIndex, 1, ['*', '0.01']));
	}

	/**
	 * Вставляет в query новый операнд, либо увеличивыет последний (если последний элемент операнд)
	 *
	 * @param query
	 * @param operand
	 * @returns {Array}
	 */
	queryAddOperand(query, operand) {
		let lastValue = this._getLastQueryValue(query);

		if (this._isOperand(lastValue) && !this.isInfinite(lastValue)) {
			return this.queryIncreaseLastOperand(query, operand);
		}
		if (this._checkQueryLimit(query)) {
			return query;
		}
		if (this._isOperator(lastValue) || typeof lastValue === 'undefined') {
			return [...query, operand];
		}

		return query;
	}

	/**
	 * Увеличивает последний операнд в query
	 *
	 * @param query
	 * @param operand
	 * @returns {Array}
	 */
	queryIncreaseLastOperand(query, operand) {
		return this._splice(query, query.length - 1, 1, [query[query.length - 1] + operand]);
	}

	/**
	 * Меняет знак у последнего операнда
	 *
	 * @param query
	 * @returns {Array}
	 */
	querySwitchLastOperandSign(query) {
		let lastOperandIndex = this._getLastQueryOperandIndex(query);
		let lastOperand = query[lastOperandIndex];
		let targetSign;
		let sign;

		if (lastOperandIndex === null) {
			return query;
		}

		sign = mathJs.sign(lastOperand);
		targetSign = sign === 1 ? '-' : '';

		return this._splice(query, lastOperandIndex, 1, [targetSign + mathJs.abs(lastOperand)]);
	}

	/**
	 * Вставляет в query новый оператор, либо меняет посдений (если последний элемент оператор).
	 * В случае, если последний оператор является левосторонним унарным, то не заменяет его.
	 *
	 * @param query
	 * @param operator
	 */
	queryAddOperator(query, operator) {
		let lastValue = this._getLastQueryValue(query);

		if (this._isOperand(lastValue) && !this._checkQueryLimit(query)) {
			return [...query, operator];
		}
		if (this._isOperator(lastValue)) {
			if (this._isUnaryLeftOperator(lastValue) && lastValue !== operator && !this._checkQueryLimit(query)) {
				return [...query, operator]
			}

			return this.queryReplaceLastElement(query, operator);
		}

		return query;
	}

	/**
	 * Заменяет последний элемент query
	 *
	 * @param query
	 * @param operator
	 * @returns {Array}
	 */
	queryReplaceLastElement(query, operator) {
		return this._splice(query, query.length - 1, 1, [operator]);
	}

	/**
	 * Убираем лишние нули и цифры после точки
	 * @param result
	 * @returns {string}
	 */
	optimizeCalculatedResult(result) {
		return result.toFixed(this.digitsAfterPoint)
			.replace(/0+$/, "")
			.replace(new RegExp(`\\${this.point}+$`), "");
	}

	/**
	 * Возвращает количество операндов в query
	 *
	 * @param query
	 * @returns {Number}
	 */
	_getQueryOperandsCount(query) {
		return query.reduce((count, value) => count + (this._isOperand(value) ? 1 : 0), 0);
	}

	/**
	 * Возвращает количество операторов в query
	 *
	 * @param query
	 * @returns {Number}
	 */
	_getQueryOperatorsCount(query) {
		return query.reduce((count, value) => count + (this._isOperator(value) ? 1 : 0), 0);
	}

	/**
	 * Проверяет, можно ли добавлять в query новые элементы
	 *
	 * @param query
	 * @returns {boolean}
	 */
	_checkQueryLimit(query) {
		return this._getQueryOperandsCount(query) === this.maxOperands;
	}

	/**
	 * Проверяет, может ли быть вычесленно значение query (по факту, проверяет наличие операндов)
	 *
	 * @param query
	 * @returns {boolean}
	 */
	_canQueryBeCalculated(query) {
		return (this._getQueryOperandsCount(query) > 1 && this._getQueryOperatorsCount(query) > 0)
			|| (this._getQueryOperandsCount(query) === 1 && this._isUnaryLeftOperator(query[1]));
	}

	/**
	 * Возвращает последний элемент query
	 *
	 * @param query
	 * @returns {*}
	 * @private
	 */
	_getLastQueryValue(query) {
		return query[query.length - 1];
	}

	isInfinite(operand) {
		return this._isOperand(operand) && isFinite(parseFloat(operand)) === false;
	}

	/**
	 *
	 * @param query
	 * @returns {null|number}
	 * @private
	 */
	_getLastQueryOperandIndex(query) {
		let reversedIndex = [...query].reverse().findIndex(element => this._isOperand(element));
		return typeof reversedIndex === 'undefined' ? null : [query.length - 1] - reversedIndex;
	}

	/**
	 * @param operator
	 * @returns {boolean}
	 * @private
	 */
	_isUnaryLeftOperator(operator) {
		return this.leftUnaryOperators.includes(operator);
	}

	/**
	 * @param value
	 * @returns {boolean|*}
	 * @private
	 */
	_isOperand(value = '') {
		return value !== '' && mathJs.isNumeric(parseFloat(value)) && !mathJs.isNaN(parseFloat(value));
	}

	/**
	 * @param value
	 * @returns {boolean}
	 * @private
	 */
	_isOperator(value) {
		return this.operators.includes(value);
	}

	/**
	 * @param value
	 * @returns {boolean}
	 * @private
	 */
	_operandHavePoint(value) {
		return value.indexOf(this.point) !== -1;
	}

	/**
	 * Иммутабельный splice
	 *
	 * @param array
	 * @param start
	 * @param deleteCount
	 * @param items
	 * @returns {Array}
	 * @private
	 */
	_splice(array, start, deleteCount = 0, items = []) {
		return [...array.slice(0, start), ...items, ...array.slice(start + deleteCount)]
	}
}

