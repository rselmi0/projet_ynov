import React from 'react';
import { render } from '@testing-library/react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card correctly', () => {
      const { getByTestId } = render(
        <Card testID="card">
          <CardContent>Card content</CardContent>
        </Card>
      );
      expect(getByTestId('card')).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { getByTestId } = render(
        <Card className="custom-card" testID="card">
          Content
        </Card>
      );
      expect(getByTestId('card')).toBeTruthy();
    });
  });

  describe('CardHeader', () => {
    it('should render header correctly', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>Header Title</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(getByText('Header Title')).toBeTruthy();
    });
  });

  describe('CardContent', () => {
    it('should render content correctly', () => {
      const { getByText } = render(
        <Card>
          <CardContent>This is card content</CardContent>
        </Card>
      );
      expect(getByText('This is card content')).toBeTruthy();
    });
  });

  describe('CardTitle', () => {
    it('should render title correctly', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>My Title</CardTitle>
          </CardHeader>
        </Card>
      );
      expect(getByText('My Title')).toBeTruthy();
    });
  });
});