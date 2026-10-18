import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders BugHunt Web header', () => {
    render(<App />);
    expect(screen.getByText(/BugHunt Web/i)).toBeInTheDocument();
  });
});
