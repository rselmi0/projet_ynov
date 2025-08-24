import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('flex', 'items-center', 'justify-center');
      expect(result).toContain('flex');
      expect(result).toContain('items-center');
      expect(result).toContain('justify-center');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('should handle undefined and null values', () => {
      const result = cn('valid-class', undefined, null, 'another-class');
      expect(result).toContain('valid-class');
      expect(result).toContain('another-class');
    });

    it('should override conflicting classes', () => {
      const result = cn('p-4', 'p-2');
      expect(result).toContain('p-2');
      expect(result).not.toContain('p-4');
    });
  });
});