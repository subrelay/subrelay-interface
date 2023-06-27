import isArray from 'lodash/isArray';

export const useDropdownFilter = (string, option) => option.name.toLowerCase().includes(string.toLowerCase());

export const useParseCamelCaseStr = (string) => {
  if (!string) return '';
  return string.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
};

export function useShowError(e) {
  console.error(e);
  if (!window.$message) return;

  let responseMsg = e.response?.data.message;
  if (isArray(responseMsg)) {
    responseMsg = responseMsg.join();
  }

  const displayMsg = responseMsg || e.message;
  if (displayMsg === 'Cancelled' || displayMsg === 'Workflow Not Found') return;
  window.$message.error(displayMsg);
}

export function useTruncate({ address }) {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 5)} ... ${address.slice(-5)}`;
}
