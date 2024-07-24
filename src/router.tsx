import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/landing/index.component.tsx';
import SignIn from './pages/sign-in/index.component.tsx';
import UpdatePassword from './pages/update-password/index.component.tsx';
import App from './pages/app/index.component.tsx';
import Error from './pages/app/error/index.component.tsx';
import NotFoundError from './pages/not-found-error/index.component.tsx';

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
      errorElement: <Error />,
      children: [
        {
          index: true,
          lazy: async () => {
            const Dashboard = await import('./pages/app/dashboard/index.component.tsx');
            return { Component: Dashboard.default };
          },
        },
        {
          path: 'users',
          lazy: async () => {
            const Users = await import('./pages/app/users/index.component.tsx');
            return { Component: Users.default };
          },
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundError />,
    },
  ]);
  return <RouterProvider router={router} />;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Router;
