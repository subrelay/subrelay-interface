import { useIsCorrectEmailFormat } from '@/composables';
import { describe } from 'vitest';

describe('Email validation', () => {
  it('should return true for valid email formats', () => {
    expect(useIsCorrectEmailFormat('test@example.com')).toBe(true);
    expect(useIsCorrectEmailFormat('another.email@example.co.uk')).toBe(true);
    expect(useIsCorrectEmailFormat('john.doe1234@example123.edu')).toBe(true);
  });

  it('Validate correct email', () => {
    expect(useIsCorrectEmailFormat('thi@gmail.com')).toBe(true);
    expect(useIsCorrectEmailFormat('not an email')).toBe(false);
    expect(useIsCorrectEmailFormat('invalid@format@')).toBe(false);
    console.log('foo', useIsCorrectEmailFormat('email.without@domain'));
    expect(useIsCorrectEmailFormat('email.without@domain')).toBe(false);
    expect(useIsCorrectEmailFormat('missing@tld.')).toBe(false);
  });

  it('Validate correct email with alias', () => {
    expect(useIsCorrectEmailFormat('thi+demo@gmail.com')).toBe(true);
  });
});
