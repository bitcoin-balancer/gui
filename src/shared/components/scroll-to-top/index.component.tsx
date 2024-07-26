import { useState, useEffect } from 'react';
import { MoveUp } from 'lucide-react';
import { Button } from '../../shadcn/components/ui/button.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Scroll To Top
 * Component in charge of providing users a quick way of scrolling all the way up.
 */
const ScrollToTop = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [visible, setVisible] = useState(false);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Scroll Event Listener
   * Subscribes to the window's scroll event and shows the button when the user has scrolled down.
   */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  });





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Scrolls the window to the top of the app.
   */
  const scrollToTop = (): void => {
    window.scrollTo(0, 0);
  };





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Button className={`fixed bottom-5 right-5 z-10 bg-primary hover:bg-secondary rounded-full shadow-5 transition-transform duration-500 ${visible ? 'translate-y-0' : 'translate-y-20'}`}
            size='icon'
            onClick={scrollToTop}
            aria-label='Scroll to Top' >
      <MoveUp color='white' aria-hidden='true'/>
    </Button>
  );
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default ScrollToTop;
