import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/landing/index.component.tsx';
import App from './pages/app/index.component.tsx';
import SignIn from './pages/sign-in/index.component.tsx';
import UpdatePassword from './pages/update-password/index.component.tsx';
import Error from './pages/error/index.component.tsx';
import NotFound from './pages/not-found/index.component.tsx';

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
      path: '/sign-in',
      element: <SignIn />,
    },
    {
      path: '/update-password',
      element: <UpdatePassword />,
    },
    {
      path: '/app',
      element: <App />,
      children: [
        {
          index: true,
          lazy: async () => {
            const Component = await import('./pages/app/dashboard/index.component.tsx');
            return { Component: Component.default };
          },
        },
        {
          path: 'users',
          lazy: async () => {
            const Component = await import('./pages/app/users/index.component.tsx');
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
