import ns from 'number-string';
import moment from 'moment';

export default {
  // 0: "General"
  0: (data) => data,

  // 1: 0
  1: (data) => data,

  // 2: 0.00 【保留两位小数】
  2: (data) =>
    ns.toClean(data, {
      maxPrecision: 2,
      minPrecision: 2,
      thousandSeparator: '',
    }),

  // 3: #,##0 【千分逗号】
  3: (data) =>
    ns.toClean(data, {
      thousandSeparator: ',',
    }),

  // 4: #,##0.00 【保留2位小数，千分逗号】
  4: (data) =>
    ns.toClean(data, {
      maxPrecision: 2,
      minPrecision: 2,
      thousandSeparator: ',',
    }),

  // 5: \"￥\"#,##0_);(\"￥\"#,##0)
  5: (data) =>
    ns.toMoney(data, {
      symbol: '¥',
      maxPrecision: 0,
      minPrecision: 0,
      thousandSeparator: ',',
    }),

  // 6: \"￥\"#,##0_);[Red](\"￥\"#,##0)

  // 7: \"￥\"#,##0.00_);(\"￥\"#,##0.00)
  7: (data) =>
    ns.toMoney(data, {
      symbol: '¥',
      maxPrecision: 2,
      minPrecision: 2,
      thousandSeparator: ',',
    }),

  // 8: \"￥\"#,##0.00_);[Red](\"￥\"#,##0.00)

  // 9: 0%【加百分号】 加百分号？？跟excel保持一致
  9: (data) => `${Number(data) * 100}%`,

  // 10: 0.00% 【加百分号保留两位小数】
  10: (data) =>
    ns.toClean(Number(data) * 100, {
      maxPrecision: 2,
      minPrecision: 2,
    }) + '%',

  // 11: 0.00E+00 【科学计数法】
  // 12: # ?/?
  // 13: # ??/??

  14: (data) => moment(data).format('YYYY/MM/DD'),

  // 15 "d-mmm-yy",
  // 16 "d-mmm",
  // 17 "mmm-yy",

  // 18 "h:mm AM/PM"
  18: (data) => {
    const hh = moment(data).get('hour');
    const suffix = Math.floor(hh / 12) > 0 ? 'PM' : 'AM';
    return `${hh % 12}:${moment(data).get('minute')} ${suffix}`;
  },

  // 19 "h:mm:ss AM/PM"
  19: (data) => {
    const hh = moment(data).get('hour');
    const suffix = Math.floor(hh / 12) > 0 ? 'PM' : 'AM';
    return `${hh % 12}:${moment(data).get('minute')}:${moment(data).get(
      'second',
    )} ${suffix}`;
  },

  // 20 "h:mm"
  20: (data) => moment(data).format('HH:mm'),

  // 21 "h:mm"
  21: (data) => moment(data).format('HH:mm:ss'),

  // 22 yyyy-m-d h:mm
  22: (data) => moment(data).format('YYYY-MM-DD HH:mm'),

  // 27 yyyy\"年\"m\"月
  27: (data) => moment(data).format('YYYY年MM月'),

  // 28 29 "m\"月\"d\"日\"",
  28: (data) => moment(data).format('MM月DD日'),
  29: (data) => moment(data).format('MM月DD日'),

  // 30 m-d-yy
  30: (data) => moment(data).format('MM-DD-YYYY'),

  // 31 yyyy\"年\"m\"月\"d\"日
  31: (data) => moment(data).format('YYYY年MM月DD日'),

  // 32 "h\"时\"mm\"分\"",
  32: (data) => moment(data).format('HH时mm分'),

  // 33 "h\"时\"mm\"分\"ss\"秒\""
  33: (data) => moment(data).format('HH时mm分ss秒'),

  /**
    // 34 上午/下午h\"时\"mm\"分\"
    // 35 上午/下午h\"时\"mm\"分\"ss\"秒\"
    // 36
    "yyyy\"年\"m\"月\"",
    // 37
    "#,##0_);(#,##0)",
    // 38
    "#,##0_);[Red](#,##0)",
    // 39
    "#,##0.00_);(#,##0.00)",
    // 40
    "#,##0.00_);[Red](#,##0.00)",
    // 41
    "_(* #,##0_);_(* (#,##0);_(* \"-\"_);_(@_)",
    // 42
    "_(\"￥\"* #,##0_);_(\"￥\"* (#,##0);_(\"￥\"* \"-\"_);_(@_)",
    // 43
    "_(* #,##0.00_);_(* (#,##0.00);_(* \"-\"??_);_(@_)",
    // 44
    "_(\"￥\"* #,##0.00_);_(\"￥\"* (#,##0.00);_(\"￥\"* \"-\"??_);_(@_)",
    // 45
    "mm:ss",
    // 46
    "[h]:mm:ss",
    // 47
    "mm:ss.0",
    // 48
    "##0.0E+0",
    // 49
    "@",
    // 50
    "yyyy\"年\"m\"月\"",
    // 51
    "m\"月\"d\"日\"",
    // 52
    "yyyy\"年\"m\"月\"",
    // 53
    "m\"月\"d\"日\"",
    // 54
    "m\"月\"d\"日\"",
    // 55
    "上午/下午h\"时\"mm\"分\"",
    // 56
    "上午/下午h\"时\"mm\"分\"ss\"秒\"",
    // 57
    "yyyy\"年\"m\"月\"",
    // 58
    "m\"月\"d\"日\"",
    // 59
    "t0",
    // 60
    "t0.00",
    // 61
    "t#,##0",
    // 62
    "t#,##0.00",
    // 63-66 No specific correspondence found in the official documentation.
    // 63
    null,
    // 64
    null,
    // 65
    null,
    // 66
    null,
    // 67
    "t0%",
    // 68
    "t0.00%",
    // 69
    "t# ?/?",
    // 70
    "t# ??/??",
    // 71
    "ว/ด/ปปปป",
    // 72
    "ว-ดดด-ปป",
    // 73
    "ว-ดดด",
    // 74
    "ดดด-ปป",
    // 75
    "ช:นน",
    // 76
    "ช:นน:ทท",
    // 77
    "ว/ด/ปปปป ช:นน",
    // 78
    "นน:ทท",
    // 79
    "[ช]:นน:ทท",
    // 80
    "นน:ทท.0",
    // 81
    "d/m/bb",
   */

  164: (data) =>
    ns.toMoney(data, {
      symbol: '$',
      maxPrecision: 0,
      minPrecision: 0,
      thousandSeparator: ',',
    }),
  165: (data) =>
    ns.toMoney(data, {
      symbol: '$',
      maxPrecision: 2,
      minPrecision: 0,
      thousandSeparator: ',',
    }),
};
