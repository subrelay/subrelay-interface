import { useFormatNumber, useDropdownFilter, useParseCamelCaseStr } from '@/composables';

describe('Test useDropdownFilter', () => {
  const option1 = {
    uuid: '01GYAC2F48YA6FDWNJB94QGMB4',
    name: 'Kusama',
    createdAt: '2023-04-18T14:25:04.661Z',
    version: '9381',
    imageUrl:
      'https://raw.githubusercontent.com/paritytech/polkadot-staking-dashboard/29c060c49518c060561b7bac008a0059bbf1145f/src/img/kusama_icon.svg',
    chainId: 'kusama',
  };
  const option2 = {
    uuid: '01GYAC2F61T2KXB62A7XJ2M5H6',
    name: 'Polkadot',
    createdAt: '2023-04-18T14:25:05.135Z',
    version: '9370',
    imageUrl:
      'https://raw.githubusercontent.com/paritytech/polkadot-staking-dashboard/29c060c49518c060561b7bac008a0059bbf1145f/src/img/polkadot_icon.svg',
    chainId: 'polkadot',
  };
  const option3 = {
    uuid: '01GYAC2FYB5MF66E66R7E3XJP5',
    name: 'Westend',
    createdAt: '2023-04-18T14:25:05.485Z',
    version: '9401',
    imageUrl:
      'https://raw.githubusercontent.com/paritytech/polkadot-staking-dashboard/29c060c49518c060561b7bac008a0059bbf1145f/src/img/westend_icon.svg',
    chainId: 'westend',
  };

  it('should return true when the string matches the option name', () => {
    expect(useDropdownFilter('Kusama', option1)).toBe(true);
    expect(useDropdownFilter('Polkadot', option2)).toBe(true);
    expect(useDropdownFilter('Westend', option3)).toBe(true);
  });

  it('should return true when the string partially matches the option name', () => {
    expect(useDropdownFilter('Kus', option1)).toBe(true);
    expect(useDropdownFilter('Polka', option2)).toBe(true);
    expect(useDropdownFilter('West', option3)).toBe(true);
  });

  it('should return false when the string does not match the option name', () => {
    expect(useDropdownFilter('Kusama Network', option1)).toBe(false);
    expect(useDropdownFilter('DOTA', option2)).toBe(false);
    expect(useDropdownFilter('Testnet', option3)).toBe(false);
  });

  it('should ignore case sensitivity', () => {
    expect(useDropdownFilter('kusama', option1)).toBe(true);
    expect(useDropdownFilter('polkadot', option2)).toBe(true);
    expect(useDropdownFilter('westend', option3)).toBe(true);
  });
});

describe('Test useParseCamelCaseStr', () => {
  it('Should parse a pascal case string correctly', () => {
    expect(useParseCamelCaseStr('helloWorld')).toBe('hello world');
  });

  it('Should return an empty string if the input is empty', () => {
    expect(useParseCamelCaseStr('')).toBe('');
  });

  it('Should handle single word pascal case strings', () => {
    expect(useParseCamelCaseStr('Test')).toBe('test');
  });

  it('should handle pascal case strings with multiple capital letters in a row', () => {
    expect(useParseCamelCaseStr('httpRequest')).toBe('http request');
  });
});

describe('Test useFormatNumber', () => {
  it('should format numbers correctly', () => {
    expect(useFormatNumber(1000)).toBe('1,000');
    expect(useFormatNumber(1000000)).toBe('1,000,000');
    expect(useFormatNumber(12345.67)).toBe('12,345.67');
  });

  it('should return an empty string for invalid numbers', () => {
    expect(useFormatNumber(null)).toBe('');
    expect(useFormatNumber(undefined)).toBe('');
    expect(useFormatNumber('not a number')).toBe('');
  });
});
