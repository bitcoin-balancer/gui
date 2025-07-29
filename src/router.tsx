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
 */
const Router = () => {
  const router = createBrowserRouter([
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
        },
        {
          path: 'positions',
          lazy: async () => {
            const Component = await import('@/pages/app/positions/index.component.tsx');
            return { Component: Component.default };
          },
        },
        {
          path: 'position/:id',
          lazy: async () => {
            const Component = await import('@/pages/app/positions/position/index.component.tsx');
            return { Component: Component.default };
          },
        },
        {
          path: 'server',
          lazy: async () => {
            const Component = await import('@/pages/app/server/index.component.tsx');
            return { Component: Component.default };
          },
        },
        {
          path: 'adjustments',
          lazy: async () => {
            const Component = await import('@/pages/app/adjustments/index.component.tsx');
            return { Component: Component.default };
          },
        },
        {
          path: 'ip-blacklist',
          lazy: async () => {
            const Component = await import('@/pages/app/ip-blacklist/index.component.tsx');
            return { Component: Component.default };
          },
        },
        {
          path: 'users',
          lazy: async () => {
            const Component = await import('@/pages/app/users/index.component.tsx');
            return { Component: Component.default };
          },
        },
        {
          path: 'platform-update',
          lazy: async () => {
            const Component = await import('@/pages/app/platform-update/index.component.tsx');
            return { Component: Component.default };
          },
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  return <RouterProvider router={router} />;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Router;
