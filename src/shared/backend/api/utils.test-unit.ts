import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect, vi } from 'vitest';
import { IEnvironment } from '@/environment/types.ts';
import * as ENVIRONMENT from '@/environment/environment.ts';
import { __buildAPIBaseURL } from './utils.ts';

/* ************************************************************************************************
 *                                             MOCKS                                              *
 ************************************************************************************************ */

// environment mock
const mockEnvironment = (value: Partial<IEnvironment>) => vi.spyOn(
  ENVIRONMENT,
  'ENVIRONMENT',
  'get',
).mockReturnValue(<IEnvironment>value);

// window location mock
const mockWindowLocation = (url?: string) => {
  mockEnvironment({ production: typeof url === 'string' });
  vi.stubGlobal('window', { location: new URL(typeof url === 'string' ? url : 'http://localhost:5173/') });
};



/* ************************************************************************************************
 *                                             TESTS                                              *
 ************************************************************************************************ */
describe('__buildAPIBaseURL', () => {
  beforeAll(() => { });

  afterAll(() => { });

  beforeEach(() => { });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('can build the API\'s URL in development mode', () => {
    mockWindowLocation();
    expect(__buildAPIBaseURL()).toBe('http://localhost:5075');
  });

  test.each([
    ['http://balancer.com', 'http://balancerapi.balancer.com'],
    ['https://balancer.com', 'https://balancerapi.balancer.com'],
    ['https://www.balancer.com', 'https://www.balancerapi.balancer.com'],
    ['http://www.balancer.com', 'http://www.balancerapi.balancer.com'],
    ['https://jesusgraterol.dev', 'https://balancerapi.jesusgraterol.dev'],
    ['https://www.jesusgraterol.dev', 'https://www.balancerapi.jesusgraterol.dev'],
    ['https://balancer.jesusgraterol.dev', 'https://balancerapi.jesusgraterol.dev'],
    ['https://www.balancer.jesusgraterol.dev', 'https://www.balancerapi.jesusgraterol.dev'],
  ])('__buildAPIBaseURL(%s) -> %s', (a, expected) => {
    mockWindowLocation(a);
    expect(__buildAPIBaseURL()).toBe(expected);
  });
});