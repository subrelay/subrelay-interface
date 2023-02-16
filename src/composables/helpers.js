import { isArray } from 'lodash';

export const useDropdownFilter = (string, option) => {
  option.name.toLowerCase().includes(string.toLowerCase());
};

export const useParsePascalCaseStr = (string) => {
  if (!string) return;
  string.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
};

export function useShowError(e) {
  console.error(e);

  let responseMsg = e.response?.data.message;

  if (isArray(responseMsg)) {
    responseMsg = responseMsg.join();
  }

  const displayMsg = responseMsg || e.message || e;

  if (displayMsg === 'Cancelled' || displayMsg === 'Workflow Not Found') return;
  window.$message.error(displayMsg);
}
