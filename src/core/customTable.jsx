import React from 'react';
import { useEffect } from 'react';
import { renderTable } from './renderTable';
const CustomTable = ({ data, suffix = '' }) => {
	const obj = {
		renderTable,
		isStoppingTask: false,
		strategiesMap: {},
	};

	useEffect(() => {
		const el = document.getElementById(`customTable-${suffix}`);
		if (el) {
			obj.renderTable(data, suffix);
		}
		return () => {
			console.log('useEffect = ', obj.isStoppingTask);
			obj.isStoppingTask = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div
			style={{ overflowX: 'scroll', background: 'white' }}
			id={`customTable-${suffix}`}
			className="customTable"
		></div>
	);
};
export default CustomTable;
