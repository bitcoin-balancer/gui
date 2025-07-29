import { useState, useEffect } from 'react';
import { SWService } from 'sw-service';

/* **********************************************************************************************
 *                                           CONSTANTS                                          *
 ********************************************************************************************** */

// the number of ms the installer can be displayed for
const DURATION: number = 3 * 1000;

// the app's host name
const APP_URL = new URL(window.location.href).hostname.replace('www.', '');

/* **********************************************************************************************
 *                                            HELPERS                                           *
 ********************************************************************************************** */

/**
 * Calculates the width% of the progress bar based on the remaining time.
 * @param remaining
 * @returns string
 */
const getProgressBarWidth = (remaining: number): string =>
  `${((remaining * 100) / DURATION).toFixed(2)}%`;

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * App Installer Component
 * Component in charge of providing the user an easy way to install the PWA on their device.
 */
const AppInstaller = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [visible, setVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(DURATION);

  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * App Installer Button
   * Side effect in charge of displaying the installer for the established duration.
   */
  useEffect(() => {
    // init the installers duration
    let remaining: number = DURATION;

    // allow a small delay so the service worker is properly registered
    let intervalKey: NodeJS.Timeout;
    const timeoutKey: NodeJS.Timeout = setTimeout(() => {
      // if the app can be installed, show the install button and init the visibility count down
      if (SWService.installer && SWService.installer.canAppBeInstalled()) {
        setVisible(true);
        intervalKey = setInterval(() => {
          remaining -= 1;
          setRemainingTime(remaining);
          if (remaining === 0) {
            setVisible(false);
            clearInterval(intervalKey);
          }
        }, 1);
      }
    }, SWService.registrationDurationSeconds * 1000);
    return () => {
      clearInterval(timeoutKey);
      clearInterval(intervalKey);
    };
  }, []);

  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  const installApp = () => {
    setVisible(false);
    if (SWService.installer?.canAppBeInstalled()) {
      SWService.installer.installApp();
    }
  };

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (!visible) {
    return <></>;
  }
  return (
    <button
      aria-label="Install Application"
      role="alert"
      onClick={installApp}
      className="fixed bottom-5 inset-x-0 z-20 w-64 md:w-72 mx-auto text-left bg-white shadow-md rounded-md border border-slate-200 hover:bg-gray-200 animate-in fade-in zoom-in duration-500"
    >
      {/* **************
       * PROGRESS BAR *
       ************** */}
      <div
        className="h-1 bg-primary rounded-t-md"
        style={{ width: getProgressBarWidth(remainingTime) }}
        role="progressbar"
      ></div>

      {/* *********
       * CONTENT *
       ********* */}
      <div className="flex justify-start items-center p-3">
        <img
          src="/installer/mobile-installer.png"
          alt="App Installer Icon"
          className="w-11 md:hidden"
          width="44"
          height="44"
        />

        <img
          src="/installer/desktop-installer.png"
          alt="App Installer Icon"
          className="w-11 hidden md:block"
          width="44"
          height="44"
        />

        <div className="ml-2">
          <p className="font-semibold">Install app</p>
          <p className="text-slate-500 text-sm">{APP_URL}</p>
        </div>
      </div>
    </button>
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default AppInstaller;
