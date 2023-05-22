import isNumber from 'lodash/isNumber';

const formatter = new Intl.NumberFormat('en-US');
export default (number) => {
  if (!isNumber(number)) return '';
  return formatter.format(number);
};
