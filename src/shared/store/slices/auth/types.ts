

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Authenticated Slice
 * Slice in charge of managing the state of the user's authentication.
 */
type IAuthenticatedSlice = {
  // if undefined, the auth state has not yet been loaded. true means the user is authenticated
  authenticated: boolean | undefined;

  // the slice's controller
  setAuthenticated: (authState: boolean) => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IAuthenticatedSlice,
};
