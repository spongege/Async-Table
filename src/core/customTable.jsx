import React, { memo } from 'react';
import { useEffect } from 'react';
import { renderTable } from './renderTable';

// autoColumnWidth : 不采用后端的ColumnWidthStrategy 策略
// renderTheComplete : 渲染完成的函数
// scroll {
  // y:滚动区域，
  // fixedRowNum:固定表头的行数
//}
const CustomTable = ({ data, suffix = '',renderTheComplete,scroll,autoColumnWidth }) => {
  console.log(autoColumnWidth)
  const obj = {
    renderTable,
    isStoppingTask: false,
    strategiesMap: {},
    columnWidthMap: {},
    renderTheComplete,
    splitTableArr:[-1],
    scroll,
    autoColumnWidth,
  };

  useEffect(() => {
    const el = document.getElementById(`customTable-${suffix}`);
    if (el) {
      obj.renderTable(data, suffix,scroll);
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
export default memo(CustomTable);
