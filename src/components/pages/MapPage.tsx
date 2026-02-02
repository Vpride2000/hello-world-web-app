import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapPage: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Coordinates for center of Russia
    const russiaCenter: [number, number] = [61.5240, 105.3188];

    // Create map
    const map = L.map(mapContainerRef.current).setView(russiaCenter, 4);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Add marker at center
    L.marker(russiaCenter).addTo(map)
      .bindPopup('<b>Центр России</b><br/>Россия')
      .openPopup();

    // Add markers for Tyumen and Ekaterinburg
    const tyumenCoords: [number, number] = [57.1522, 65.5272];
    L.marker(tyumenCoords).addTo(map)
      .bindPopup('<b>Тюмень</b><br/>Россия');

    const ekaterinburgCoords: [number, number] = [56.8389, 60.6057];
    L.marker(ekaterinburgCoords).addTo(map)
      .bindPopup('<b>Екатеринбург</b><br/>Россия');

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const goToCity = (lat: number, lng: number, zoomLevel: number = 10) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], zoomLevel);
    }
  };

  return (
    <>
      <h2>Объекты работ Общества</h2>
      <div className="cities-list">
        <button className="city-btn" onClick={() => goToCity(61.5240, 105.3188, 4)}>Вся Россия</button>
        <button className="city-btn" onClick={() => goToCity(57.1522, 65.5272, 10)}>Тюмень</button>
        <button className="city-btn" onClick={() => goToCity(56.8389, 60.6057, 10)}>Екатеринбург</button>
      </div>
      <div ref={mapContainerRef} id="map" style={{ height: '500px', width: '100%' }}></div>
    </>
  );
};

export default MapPage;
