export const useDropdownFilter = (string, option) => {
  return option.name.toLowerCase().includes(string);
};
