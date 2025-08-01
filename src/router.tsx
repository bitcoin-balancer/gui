import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from '@/pages/landing/index.component.tsx';
import App from '@/pages/app/index.component.tsx';
import Auth from './pages/auth/index.component.tsx';
import SignIn from '@/pages/auth/sign-in/index.component.tsx';
import UpdatePassword from '@/pages/auth/update-password/index.component.tsx';
import Error from '@/pages/error/index.component.tsx';
import NotFound from '@/pages/not-found/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Router
 * The router context that will be used to manage the navigation throughout the app.
 *
 * @IMPORTANT
 * The version of react-router-dom used in this project is the one used right before Remix decided
 * to fallback to react-router-dom and deprecate the Remix framework. Unfornately, during the
 * transition, the team accidentally included warnings that are very verbose and polute the console.
 * In order to silence them, we had to include the `future` property in the router configuration and
 * an empty callback for `HydrateFallback` in the lazy routes. For more informatino, visit:
 * - https://github.com/remix-run/react-router/issues/12245
 * - https://github.com/remix-run/react-router/issues/12563
 */
const Router = () => {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Landing />,
        errorElement: <Error />,
      },
      {
        path: '/auth',
        element: <Auth />,
        errorElement: <Error />,
        children: [
          {
            path: 'sign-in',
            element: <SignIn />,
          },
          {
            path: 'update-password',
            element: <UpdatePassword />,
          },
        ],
      },
      {
        path: '/app',
        element: <App />,
        errorElement: <Error />,
        children: [
          {
            index: true,
            lazy: async () => {
              const Component = await import('@/pages/app/dashboard/index.component.tsx');
              return { Component: Component.default };
            },
            HydrateFallback: () => null,
          },
          {
            path: 'positions',
            lazy: async () => {
              const Component = await import('@/pages/app/positions/index.component.tsx');
              return { Component: Component.default };
            },
            HydrateFallback: () => null,
          },
          {
            path: 'position/:id',
            lazy: async () => {
              const Component = await import('@/pages/app/positions/position/index.component.tsx');
              return { Component: Component.default };
            },
            HydrateFallback: () => null,
          },
          {
            path: 'server',
            lazy: async () => {
              const Component = await import('@/pages/app/server/index.component.tsx');
              return { Component: Component.default };
            },
            HydrateFallback: () => null,
          },
          {
            path: 'adjustments',
            lazy: async () => {
              const Component = await import('@/pages/app/adjustments/index.component.tsx');
              return { Component: Component.default };
            },
            HydrateFallback: () => null,
          },
          {
            path: 'ip-blacklist',
            lazy: async () => {
              const Component = await import('@/pages/app/ip-blacklist/index.component.tsx');
              return { Component: Component.default };
            },
            HydrateFallback: () => null,
          },
          {
            path: 'users',
            lazy: async () => {
              const Component = await import('@/pages/app/users/index.component.tsx');
              return { Component: Component.default };
            },
            HydrateFallback: () => null,
          },
          {
            path: 'platform-update',
            lazy: async () => {
              const Component = await import('@/pages/app/platform-update/index.component.tsx');
              return { Component: Component.default };
            },
            HydrateFallback: () => null,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
    {
      future: {
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    },
  );
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Router;
