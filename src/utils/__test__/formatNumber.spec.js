import formatNumber from '@/utils/formatNumber';

describe('Test formatNumber', () => {
  it('should format numbers correctly', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(12345.67)).toBe('12,345.67');
  });

  it('should return an empty string for invalid numbers', () => {
    expect(formatNumber(null)).toBe('');
    expect(formatNumber(undefined)).toBe('');
    expect(formatNumber('not a number')).toBe('');
  });
});
