import { Outlet } from 'react-router-dom';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * App
 * Component that serves as the parent of the application itself for authenticated users.
 */
const App = () => (
  <>
    <h1 className="text-5xl">App Component</h1>
    <Outlet />
  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default App;
