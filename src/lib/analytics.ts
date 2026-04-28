import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db, auth } from './firebase';

export function useAnalytics() {
  const location = useLocation();

  const trackEvent = async (type: string, data: any = {}) => {
    try {
      const sessionId = getSessionId();
      await addDoc(collection(db, 'analytics_events'), {
        type,
        path: location.pathname,
        timestamp: serverTimestamp(),
        userId: auth.currentUser?.uid || 'anonymous',
        displayName: auth.currentUser?.displayName || 'Guest',
        sessionId,
        ...data
      });
    } catch (e) {
      console.error("Event tracking error:", e);
    }
  };

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const defaultLocation = {
          lat: 0,
          lng: 0,
          city: 'Unknown',
          country: 'Global',
          countryCode: 'UN',
          country_name: 'Global',
          country_code: 'UN'
        };

        let locationData = JSON.parse(sessionStorage.getItem('visitor_location') || 'null');
        if (!locationData) {
          try {
            const res = await fetch('https://ipwho.is/');
            const data = await res.json();
            if (data && data.success) {
              locationData = {
                city: data.city,
                country_name: data.country,
                country_code: data.country_code,
                latitude: data.latitude,
                longitude: data.longitude,
                lat: data.latitude,
                lng: data.longitude,
                country: data.country,
                countryCode: data.country_code
              };
              sessionStorage.setItem('visitor_location', JSON.stringify(locationData));
            }
          } catch (e) {
            console.warn("Location fetch failed", e);
          }
        }

        const finalLocation = locationData || defaultLocation;
        
        // Detect device/browser info
        const ua = navigator.userAgent;
        let device = 'Desktop';
        if (/tablet|ipad|playbook|silk/i.test(ua)) device = 'Tablet';
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua)) device = 'Mobile';

        const referrer = document.referrer || 'Direct';
        const sessionId = getSessionId();

        // Detect Browser
        let browser = 'Unknown';
        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('SamsungBrowser')) browser = 'Samsung Browser';
        else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
        else if (ua.includes('Trident')) browser = 'Internet Explorer';
        else if (ua.includes('Edge')) browser = 'Edge';
        else if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Safari')) browser = 'Safari';

        // Internal Tracking
        await addDoc(collection(db, 'analytics_events'), {
          type: 'page_view',
          path: location.pathname,
          timestamp: serverTimestamp(),
          userId: auth.currentUser?.uid || 'anonymous',
          displayName: auth.currentUser?.displayName || 'Guest',
          sessionId,
          userAgent: ua,
          device,
          browser,
          referrer,
          location: {
            city: finalLocation.city,
            country: finalLocation.country_name || finalLocation.country || 'Global',
            countryCode: finalLocation.country_code || finalLocation.countryCode || 'UN',
            lat: finalLocation.latitude || finalLocation.lat || 0,
            lng: finalLocation.longitude || finalLocation.lng || 0
          }
        });

        // Optional: Google Analytics 4 Integration
        // if (process.env.VITE_GA_MEASUREMENT_ID) {
        //   (window as any).gtag('event', 'page_view', {
        //     page_path: location.pathname,
        //     page_title: document.title,
        //     user_id: auth.currentUser?.uid || 'anonymous'
        //   });
        // }
      } catch (e) {
        console.error("Tracking error:", e);
      }
    };

    trackPageView();
  }, [location.pathname]);

  useEffect(() => {
    let heartbeatInterval: any;

    const updateHeartbeat = async () => {
      const sessionId = getSessionId();
      try {
        const defaultLocation = {
          lat: 0,
          lng: 0,
          city: 'Unknown',
          country: 'Global',
          countryCode: 'UN'
        };

        let locationData = JSON.parse(sessionStorage.getItem('visitor_location') || 'null');
        
        if (!locationData) {
          try {
            const res = await fetch('https://ipwho.is/');
            const data = await res.json();
            if (data && data.success) {
              locationData = {
                lat: data.latitude,
                lng: data.longitude,
                city: data.city,
                country: data.country,
                countryCode: data.country_code
              };
            } else {
              throw new Error('IP API failed');
            }
          } catch (e) {
            locationData = defaultLocation;
          }
          if (locationData) sessionStorage.setItem('visitor_location', JSON.stringify(locationData));
        }

        const finalLocation = locationData || defaultLocation;

        const ua = navigator.userAgent;
        let device = 'Desktop';
        if (/tablet|ipad|playbook|silk/i.test(ua)) device = 'Tablet';
        else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua)) device = 'Mobile';

        await setDoc(doc(db, 'active_sessions', sessionId), {
          userId: auth.currentUser?.uid || 'anonymous',
          lastActive: serverTimestamp(),
          path: location.pathname,
          device,
          location: {
            lat: finalLocation.lat || 0,
            lng: finalLocation.lng || 0,
            city: finalLocation.city || 'Unknown',
            country: finalLocation.country || 'Global',
            countryCode: finalLocation.countryCode || 'UN'
          },
          displayName: auth.currentUser?.displayName || 'Guest'
        }, { merge: true });
      } catch (e) {
        console.error("Heartbeat error:", e);
      }
    };

    updateHeartbeat();
    heartbeatInterval = setInterval(updateHeartbeat, 60000); // Every minute

    return () => clearInterval(heartbeatInterval);
  }, [location.pathname]);

  return { trackEvent };
}

function getSessionId() {
  let sessionId = sessionStorage.getItem('visitor_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('visitor_session_id', sessionId);
  }
  return sessionId;
}
