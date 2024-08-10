import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { AccessJWTService } from '@/shared/backend/api/access-jwt.service.ts';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import GlobalLoader from '../global-loader/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Auth Component
 * Component that serves as the parent of the authentication related pages.
 */
const Auth = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const authenticated = useBoundStore((state) => state.authenticated);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Access JWT
   * Checks if the user is currently logged in, in case authentication has not been initialized.
   */
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        await AccessJWTService.accessJWTChanged(null);
      } catch (e) {
        errorToast(e);
      }
    };
    if (authenticated === undefined) {
      loadAuthState();
    }
  }, [authenticated]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (authenticated) {
    return <Navigate to={NavService.dashboard()} />;
  }
  if (authenticated === undefined) {
    return <GlobalLoader />;
  }
  return <Outlet />;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Auth;
