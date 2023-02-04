export const useDropdownFilter = (string, option) => {
  return option.name.toLowerCase().includes(string.toLowerCase());
};

export const useParsePascalCaseStr = (string) => {
  if (!string) return;
  return string.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
};

export function useShowMessage(type, msg) {
  window.$message[type](msg);
}
