import { Navigate, Outlet } from 'react-router-dom';
import { useBoundStore } from '../../shared/store/index.store';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * App
 * Component that serves as the parent of the application itself for authenticated users.
 */
const App = () => {
  const authenticated = useBoundStore((state) => state.authenticated);

  if (!authenticated) {
    return <Navigate to='/sign-in' />;
  }
  return (
    <>
      <h1 className="text-5xl">App Component</h1>
      <Outlet />
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default App;
