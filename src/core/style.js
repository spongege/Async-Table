/**
 * 样式
 */

// 垂直位置枚举
const VERTICAL_ALIGN_MAP = {
  TOP: 'top',
  CENTER: 'middle',
  BOTTOM: 'bottom',
  // JUSTIFY: '',
  // DISTRIBUTED: '',
};

// 水平位置枚举
const HORIZONTAL_ALIGN_MAP = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  // JUSTIFY: '',
  // DISTRIBUTED: '',
};

export const style = {
  getFontStyle: (writeFont) => {
    const className = [];
    Object.keys(writeFont).forEach((key) => {
      switch (key) {
        case 'fontName':
          // className.push(`excel-font-name-${writeFont[key]}`);
          break;
        case 'fontHeightInPoints':
          // className.push(`excel-font-height-in-points-${writeFont[key]}`);
          break;
        // italic
        // strikeout
        case 'color':
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          writeFont[key] && className.push(`excel-color-${writeFont[key]}`);
          break;
        case 'bold':
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          writeFont[key] && className.push(`excel-bold-${writeFont[key]}`);
          break;
        default:
          break;
      }
    });
    return className.join(' ');
  },
  getVerticalAlign: (verticalAlignment) => {
    return `excel-vertical-align-${VERTICAL_ALIGN_MAP[verticalAlignment]}`;
  },
  getHorizontalAlign: (horizontalAlignment) => {
    return `excel-horizontal-align-${HORIZONTAL_ALIGN_MAP[horizontalAlignment]}`;
  },
};
