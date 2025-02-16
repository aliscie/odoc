import { useState, useEffect } from 'react';

export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    os: '',
    browser: ''
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      // OS Detection
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      const isMac = /macintosh|mac os x/.test(userAgent);
      const isWindows = /windows/.test(userAgent);
      const isLinux = /linux/.test(userAgent);

      // Browser Detection
      const isChrome = /chrome/.test(userAgent) && !/edge|edg/.test(userAgent);
      const isSafari = /safari/.test(userAgent) && !/chrome|chromium|edg/.test(userAgent);
      const isFirefox = /firefox/.test(userAgent);
      const isEdge = /edge|edg/.test(userAgent);

      // Device Type Detection
      const isMobileDevice = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent);
      const isTabletDevice = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(userAgent);

      let os = 'unknown';
      if (isIOS) os = 'iOS';
      else if (isAndroid) os = 'Android';
      else if (isMac) os = 'MacOS';
      else if (isWindows) os = 'Windows';
      else if (isLinux) os = 'Linux';

      let browser = 'unknown';
      if (isChrome) browser = 'Chrome';
      else if (isSafari) browser = 'Safari';
      else if (isFirefox) browser = 'Firefox';
      else if (isEdge) browser = 'Edge';

      setDeviceInfo({
        isMobile: isMobileDevice,
        isTablet: isTabletDevice,
        isDesktop: !isMobileDevice && !isTabletDevice,
        os,
        browser
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
    };
  }, []);

  return deviceInfo;
};

export default useDeviceDetection;
