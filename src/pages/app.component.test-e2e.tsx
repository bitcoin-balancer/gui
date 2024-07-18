// @vitest-environment jsdom
import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './app.component.tsx';

describe('FirstTest component', () => {
  beforeAll(() => { });

  afterAll(() => { });

  beforeEach(() => { });

  afterEach(() => { });

  test('renders correct heading', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('heading').textContent).toMatch('Balancer GUI: 0');

    const button = screen.getByRole('button', { name: '+1' });
    await user.click(button);

    expect(screen.getByRole('heading').textContent).toMatch('Balancer GUI: 1');
  });
});
