import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './Home.css';

import { Plugins } from '@capacitor/core';
import {
  BackgroundGeolocationPlugin,
  Location,
} from '@capacitor-community/background-geolocation';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.react_app_api_token as string;

const Home: React.FC = () => {
  const BackgroundGeolocation = Plugins.BackgroundGeolocation as BackgroundGeolocationPlugin;
  const mapContainerRef = useRef(null);
  const watcherOpts = {
    backgroundMessage: 'Cancel to prevent battery drain.',
    backgroundTitle: 'Tracking You.',
    requestPermissions: true,
    stale: false,
  };

  const [lng, setLng] = useState<number>(5);
  const [lat, setLat] = useState<number>(34);
  const [zoom, setZoom] = useState<number>(1.5);

  useEffect(() => {
    // Add navigation control (the +/- zoom buttons)
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 15,
    });
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    function locationChange(location: any, _error: any) {
      map.panTo([ location.longitude, location.latitude])
      setLat(location.latitude);
      setLng(location.longitude);
    }
    const id = BackgroundGeolocation.addWatcher(watcherOpts, locationChange);
    return () => {
      map.remove();
      BackgroundGeolocation.removeWatcher({ id });
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <p>{lat}, {lng}</p>
        <div className="map-container" ref={mapContainerRef} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
