import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './pages/landing/index.component.tsx';
import SignIn from './pages/sign-in/index.component.tsx';
import UpdatePassword from './pages/update-password/index.component.tsx';
import App from './pages/app/index.component.tsx';
import NotFoundError from './pages/not-found-error/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
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
      children: [
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
