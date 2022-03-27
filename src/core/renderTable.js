/* eslint-disable @typescript-eslint/no-invalid-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import _ from 'lodash';
import { style } from './style';
import BuiltinFormatsMap from './format';
import './reportTable.less';

export const renderTable = function (dataSource, suffix) {
	if (_.isEmpty(dataSource)) {
		return;
	}
	const { data, strategies } = dataSource;
	if (_.isEmpty(data)) {
		return;
	}
	const el = document.getElementById(`customTable-${suffix}`);
	const table = document.createElement('table');
	el.appendChild(table);
	creatStrategiesMap(data, strategies, this);
	timedProcessArray(data, table, this);
};

function renderRow(rowData, rowIndex, instance) {
	const tr = document.createElement('tr');

	for (let i = 0; i < rowData.length; i++) {
		const { format, className, colSpan, rowSpan, writeIcon } =
			instance.strategiesMap?.[rowIndex]?.[i] || {};
		if (
			(colSpan > 0 || colSpan === undefined) &&
			(rowSpan > 0 || rowSpan === undefined)
		) {
			const td = document.createElement('td');
			if (colSpan) {
				td.setAttribute('colSpan', colSpan);
			}
			if (rowSpan) {
				td.setAttribute('rowSpan', rowSpan);
			}
			if (writeIcon && writeIcon.shape) {
				const div = document.createElement('div');
				div.innerHTML = `
        <span
          class="excel-${writeIcon.shape} excel-bgc-${writeIcon.color}"
          style="background-color: ${writeIcon.colorValue}"
        ></span>
           ${
							format && (rowData[i] || rowData[i] === 0)
								? format(rowData[i])
								: rowData[i]
						}
        `;
				td.appendChild(div);
			} else {
				td.innerHTML =
					format && (rowData[i] || rowData[i] === 0)
						? format(rowData[i])
						: rowData[i];
			}
			if (className) {
				td.className = className;
			}
			tr.appendChild(td);
		}
	}

	return tr;
}
// function test(data, table, index, instance) {
// 	if (!instance || instance.isStoppingTask) {
// 		console.log('isStoppingTask');
// 		return;
// 	}
// 	const start = +new Date();
// 	let i = index;
// 	do {
// 		const rowData = data?.[i];
// 		if (rowData) {
// 			//   console.time('render');
// 			const tr = renderRow(rowData, i, instance);
// 			table.appendChild(tr);
// 			//   console.timeEnd('render');
// 			i++;
// 		}
// 	} while (data.length - index >= 0 && +new Date() - start < 16);
// 	console.log('timeRange', start, +new Date(), i);
// 	if (data[i] && data.length - index >= 0) {
// 		// eslint-disable-next-line no-caller
// 		window.requestIdleCallback(() => {
// 			test(data, table, i, instance);
// 		});
// 	}
// }
function asyncRender(data, table, instance) {
	const WAIT = 2;
	const len = data.length;
	let i = 0;
	const idleCallback = IdleDeadline => {
		while (IdleDeadline.timeRemaining() > WAIT && i < len) {
			const rowData = data?.[i];
			if (rowData) {
				const tr = renderRow(rowData, i, instance);
				table.appendChild(tr);
				i++;
			}
		}
		console.log('timeRange', i);
		if (i >= len) return;
		window.requestIdleCallback(idleCallback);
	};
	window.requestIdleCallback(idleCallback);
}
function timedProcessArray(data, table, instance) {
	// test(data, table, 0, instance);
	asyncRender(data, table, instance);
}
const getStrategy = (strategy1, strategy2) => {
	const attrArr = [
		'dataFormat',
		'writeFont',
		'hidden',
		'locked',
		'quotePrefix',
		'horizontalAlignment',
		'wrapped',
		'verticalAlignment',
		'rotation',
		'indent',
		'borderLeft',
		'borderRight',
		'borderTop',
		'borderBottom',
		'leftBorderColor',
		'rightBorderColor',
		'topBorderColor',
		'bottomBorderColor',
		'fillPatternType',
		'fillBackgroundColor',
		'fillForegroundColor',
		'shrinkToFit',
	];
	const returnObj = { ...strategy1 };

	attrArr.forEach(key => {
		if (
			(strategy2?.[key] !== undefined &&
				strategy2?.[key] !== null &&
				strategy2?.[key] !== '') ||
			returnObj?.[key] === undefined
		) {
			returnObj[key] = strategy2[key];
		}
	});

	return returnObj;
};
function creatStrategiesMap(data, strategies, instance) {
	_.forEach(strategies, strategy => {
		const {
			name,
			firstRowIndex,
			lastRowIndex,
			firstColumnIndex,
			lastColumnIndex,
			excelCellStyle = {},
			pageCellStyle = {},
			pageCustomCellStyle = {},
			columnIndex,
			relativeRowIndex,
		} = strategy;
		let rowIndex = 0;
		const {
			dataFormat,
			writeFont = {},
			horizontalAlignment,
			verticalAlignment,
			borderLeft,
			borderRight,
			borderTop,
			borderBottom,
			leftBorderColor,
			rightBorderColor,
			topBorderColor,
			bottomBorderColor,
			fillForegroundColor,
		} = getStrategy(excelCellStyle, pageCellStyle);
		let writeIcon = '';
		let format = '';
		let className = [];
		switch (name) {
			case 'AbsoluteMergeStrategy':
				instance.strategiesMap[firstRowIndex] = {
					...instance.strategiesMap[firstRowIndex],
					[firstColumnIndex]: {
						...instance.strategiesMap[firstRowIndex]?.[firstColumnIndex],
						colSpan: lastColumnIndex - firstColumnIndex + 1,
						rowSpan: lastRowIndex - firstRowIndex + 1,
					},
				};

				rowIndex = firstRowIndex;
				while (rowIndex <= lastRowIndex) {
					for (let i = firstColumnIndex + 1; i <= lastColumnIndex; i++) {
						instance.strategiesMap[rowIndex] = {
							...instance.strategiesMap[rowIndex],
							[i]: {
								...instance.strategiesMap[rowIndex]?.[i],
								colSpan: 0,
							},
						};
					}
					if (rowIndex > firstRowIndex) {
						instance.strategiesMap[rowIndex] = {
							...instance.strategiesMap[rowIndex],
							[firstColumnIndex]: {
								...instance.strategiesMap[rowIndex]?.[firstColumnIndex],
								rowSpan: 0,
							},
						};
					}
					rowIndex++;
				}
				break;
			case 'CellStyleStrategy':
			case 'ColumnCellStyleStrategy':
			case 'RegionCellStyleStrategy':
			case 'RowCellStyleStrategy':
				if (!_.isEmpty(pageCustomCellStyle)) {
					writeIcon = pageCustomCellStyle.writeIcon;
				}

				// 数据格式化
				if (dataFormat !== undefined && BuiltinFormatsMap[dataFormat]) {
					format = BuiltinFormatsMap[dataFormat];
				}

				// 根据style构造className
				if (fillForegroundColor) {
					if (fillForegroundColor !== null) {
						className.push(`excel-bgc-${fillForegroundColor}`);
					} else {
						className.push(`excel-bgc-default`);
					}
				} else {
					className.push(`excel-bgc-default`);
				}
				// 总觉得这种方式有点不优雅，less会自动生成许多无用的css选择器，遇到border: px soild color 这种属性复杂度就会变成n方
				// 尝试过style 来做处理，但是antd 不支持style 强行传也会被omit掉，
				if (leftBorderColor >= 0 && fillForegroundColor !== null) {
					className.push(`excel-border-left-color-${leftBorderColor}`);
				}
				if (rightBorderColor >= 0 && fillForegroundColor !== null) {
					className.push(`excel-border-right-color-${rightBorderColor}`);
				}
				if (topBorderColor >= 0 && fillForegroundColor !== null) {
					className.push(`excel-border-top-color-${topBorderColor}`);
				}
				if (bottomBorderColor >= 0 && fillForegroundColor !== null) {
					className.push(`excel-border-bottom-color-${bottomBorderColor}`);
				}
				if (borderLeft === 'NONE') {
					className.push(`excel-border-left-color-100`);
				}
				if (borderRight === 'NONE') {
					className.push(`excel-border-right-color-100`);
				}
				if (borderTop === 'NONE') {
					className.push(`excel-border-top-color-100`);
				}
				if (borderBottom === 'NONE') {
					className.push(`excel-border-bottom-color-100`);
				}
				if (verticalAlignment) {
					className.push(style.getVerticalAlign(verticalAlignment));
				}
				if (horizontalAlignment) {
					className.push(style.getHorizontalAlign(horizontalAlignment));
				}
				if (writeFont) {
					className.push(style.getFontStyle(writeFont));
				}
				className = className.join(' ');
				if (relativeRowIndex >= 0) {
					if (columnIndex >= 0) {
						instance.strategiesMap[relativeRowIndex] = {
							...instance.strategiesMap[relativeRowIndex],
							[columnIndex]: {
								...instance.strategiesMap[relativeRowIndex]?.[columnIndex],
								className,
								format,
								writeIcon,
							},
						};
					} else {
						for (let i = 0; i < data[relativeRowIndex]?.length; i++) {
							instance.strategiesMap[relativeRowIndex] = {
								...instance.strategiesMap[relativeRowIndex],
								[i]: {
									...instance.strategiesMap[relativeRowIndex]?.[i],
									className,
									format,
									writeIcon,
								},
							};
						}
					}
				} else if (
					firstRowIndex >= 0 &&
					lastRowIndex >= 0 &&
					firstColumnIndex >= 0 &&
					lastColumnIndex >= 0
				) {
					rowIndex = firstRowIndex;
					while (rowIndex <= lastRowIndex) {
						for (let i = firstColumnIndex; i <= lastColumnIndex; i++) {
							instance.strategiesMap[rowIndex] = {
								...instance.strategiesMap[rowIndex],
								[i]: {
									...instance.strategiesMap[rowIndex]?.[i],
									className,
									format,
									writeIcon,
								},
							};
						}
						rowIndex++;
					}
				} else if (columnIndex >= 0 && !relativeRowIndex) {
					for (let rowIndex = 0; rowIndex <= data.length; rowIndex++) {
						instance.strategiesMap[rowIndex] = {
							...instance.strategiesMap[rowIndex],
							[columnIndex]: {
								...instance.strategiesMap[rowIndex]?.[columnIndex],
								className,
								format,
								writeIcon,
							},
						};
					}
				}
				break;
			default:
				break;
		}
	});
}
