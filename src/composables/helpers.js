export const useDropdownFilter = (string, option) => {
  return option.name.toLowerCase().includes(string);
};

export const useParsePascalCaseStr = (string) => {
  if (!string) return;
  return string.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
};
