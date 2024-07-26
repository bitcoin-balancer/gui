import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AccessJWTService } from '../../shared/backend/api/access-jwt.service.ts';
import { useBoundStore } from '../../shared/store/index.store.ts';
import GlobalLoader from '../global-loader/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * App Component
 * Component that serves as the parent of the application itself for authenticated users.
 */
const App = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const authenticated = useBoundStore((state) => state.authenticated);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Access JWT
   * Checks if the user is currently logged in.
   */
  useEffect(() => {
    if (authenticated === undefined) {
      AccessJWTService.accessJWTChanged(null);
    }
  }, [authenticated]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (authenticated === false) {
    return <Navigate to='/sign-in' />;
  }
  if (authenticated === undefined) {
    return <GlobalLoader />;
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
