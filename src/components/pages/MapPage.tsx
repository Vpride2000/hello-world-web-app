import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPage.css';

const MapPage: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [useOnlineMap, setUseOnlineMap] = useState(false);

  useEffect(() => {
    if (!useOnlineMap || !mapContainerRef.current || mapRef.current) return;

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
  }, [useOnlineMap]);

  const goToCity = (lat: number, lng: number, zoomLevel: number = 10) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], zoomLevel);
    }
  };

  const handleCityClick = (cityName: string, lat: number, lng: number, zoomLevel: number = 10) => {
    if (!useOnlineMap) {
      alert(`Переход к городу: ${cityName}`);
    } else {
      goToCity(lat, lng, zoomLevel);
    }
  };

  return (
    <>
      <h2>Объекты работ Общества</h2>
      
      <div className="map-mode-toggle">
        <button 
          className={`mode-btn ${!useOnlineMap ? 'active' : ''}`}
          onClick={() => setUseOnlineMap(false)}
        >
          📍 Оффлайн карта
        </button>
        <button 
          className={`mode-btn ${useOnlineMap ? 'active' : ''}`}
          onClick={() => setUseOnlineMap(true)}
        >
          🌐 Онлайн карта
        </button>
      </div>

      <div className="cities-list">
        <button className="city-btn" onClick={() => handleCityClick('Вся Россия', 61.5240, 105.3188, 4)}>Вся Россия</button>
        <button className="city-btn" onClick={() => handleCityClick('Тюмень', 57.1522, 65.5272, 10)}>Тюмень</button>
        <button className="city-btn" onClick={() => handleCityClick('Екатеринбург', 56.8389, 60.6057, 10)}>Екатеринбург</button>
      </div>

      {!useOnlineMap ? (
        <div className="offline-map">
          <div className="static-map-container">
            {/* Статическая карта России как фон */}
            <div className="russia-map-image">
              <svg viewBox="0 0 1400 700" className="russia-map-svg">
                {/* Используем готовый упрощенный контур */}
                <image 
                  href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 700'%3E%3Crect fill='%23b3d9ff' width='1400' height='700'/%3E%3Cpath fill='%23c8e6c9' stroke='%232e7d32' stroke-width='2' d='M200,350 Q250,320 300,310 T400,300 Q500,295 600,290 L650,250 Q700,240 750,235 T850,240 Q900,245 950,260 T1050,310 Q1100,340 1150,390 T1200,480 Q1220,520 1230,550 L1230,580 Q1220,610 1200,630 T1150,650 Q1100,660 1050,655 T950,640 Q900,630 850,620 T750,600 Q700,590 650,580 T550,570 Q500,568 450,570 T350,580 Q300,590 250,605 T150,640 Q130,660 120,685 L110,700 L100,685 Q90,650 85,620 T80,560 Q80,520 85,480 T100,410 Q110,380 130,360 T170,340 Q185,335 200,350Z'/%3E%3C/svg%3E"
                  x="0" y="0" width="1400" height="700"
                />
                
                {/* Города как SVG маркеры поверх карты */}
                
                {/* Москва - столица (красная) */}
                <g className="city-marker" onClick={() => handleCityClick('Москва', 55.7558, 37.6173, 10)}>
                  <circle cx="320" cy="370" r="10" fill="#e53935" stroke="#b71c1c" strokeWidth="2"/>
                  <text x="320" y="355" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#b71c1c">Москва ⭐</text>
                </g>
                
                {/* Санкт-Петербург */}
                <g className="city-marker" onClick={() => handleCityClick('Санкт-Петербург', 59.9343, 30.3351, 10)}>
                  <circle cx="280" cy="330" r="8" fill="#1976d2" stroke="#0d47a1" strokeWidth="2"/>
                  <text x="280" y="318" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0d47a1">Санкт-Петербург</text>
                </g>

                {/* Нижний Новгород */}
                <g className="city-marker" onClick={() => handleCityClick('Нижний Новгород', 56.2965, 43.9361, 10)}>
                  <circle cx="400" cy="380" r="6" fill="#1976d2" stroke="#0d47a1" strokeWidth="1"/>
                  <text x="400" y="400" textAnchor="middle" fontSize="12" fill="#424242">Н. Новгород</text>
                </g>

                {/* Казань */}
                <g className="city-marker" onClick={() => handleCityClick('Казань', 55.8304, 49.0661, 10)}>
                  <circle cx="460" cy="385" r="6" fill="#1976d2" stroke="#0d47a1" strokeWidth="1"/>
                  <text x="460" y="405" textAnchor="middle" fontSize="12" fill="#424242">Казань</text>
                </g>

                {/* Екатеринбург */}
                <g className="city-marker" onClick={() => handleCityClick('Екатеринбург', 56.8389, 60.6057, 10)}>
                  <circle cx="570" cy="390" r="8" fill="#1976d2" stroke="#0d47a1" strokeWidth="2"/>
                  <text x="570" y="378" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0d47a1">Екатеринбург</text>
                </g>
                
                {/* Тюмень */}
                <g className="city-marker" onClick={() => handleCityClick('Тюмень', 57.1522, 65.5272, 10)}>
                  <circle cx="620" cy="385" r="8" fill="#1976d2" stroke="#0d47a1" strokeWidth="2"/>
                  <text x="620" y="373" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0d47a1">Тюмень</text>
                </g>

                {/* Новосибирск */}
                <g className="city-marker" onClick={() => handleCityClick('Новосибирск', 55.0084, 82.9357, 10)}>
                  <circle cx="780" cy="410" r="7" fill="#1976d2" stroke="#0d47a1" strokeWidth="1"/>
                  <text x="780" y="430" textAnchor="middle" fontSize="13" fill="#424242">Новосибирск</text>
                </g>

                {/* Красноярск */}
                <g className="city-marker" onClick={() => handleCityClick('Красноярск', 56.0153, 92.8932, 10)}>
                  <circle cx="880" cy="400" r="6" fill="#1976d2" stroke="#0d47a1" strokeWidth="1"/>
                  <text x="880" y="420" textAnchor="middle" fontSize="12" fill="#424242">Красноярск</text>
                </g>

                {/* Иркутск */}
                <g className="city-marker" onClick={() => handleCityClick('Иркутск', 52.2897, 104.2806, 10)}>
                  <circle cx="980" cy="425" r="6" fill="#1976d2" stroke="#0d47a1" strokeWidth="1"/>
                  <text x="980" y="445" textAnchor="middle" fontSize="12" fill="#424242">Иркутск</text>
                </g>

                {/* Владивосток */}
                <g className="city-marker" onClick={() => handleCityClick('Владивосток', 43.1332, 131.9113, 10)}>
                  <circle cx="1180" cy="505" r="7" fill="#1976d2" stroke="#0d47a1" strokeWidth="1"/>
                  <text x="1180" y="493" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0d47a1">Владивосток</text>
                </g>

                {/* Хабаровск */}
                <g className="city-marker" onClick={() => handleCityClick('Хабаровск', 48.4827, 135.0838, 10)}>
                  <circle cx="1150" cy="465" r="6" fill="#1976d2" stroke="#0d47a1" strokeWidth="1"/>
                  <text x="1150" y="485" textAnchor="middle" fontSize="12" fill="#424242">Хабаровск</text>
                </g>

                {/* Якутск */}
                <g className="city-marker" onClick={() => handleCityClick('Якутск', 62.0355, 129.6755, 10)}>
                  <circle cx="1050" cy="360" r="6" fill="#1976d2" stroke="#0d47a1" strokeWidth="1"/>
                  <text x="1050" y="380" textAnchor="middle" fontSize="12" fill="#424242">Якутск</text>
                </g>

                {/* Ростов-на-Дону */}
                <g className="city-marker" onClick={() => handleCityClick('Ростов-на-Дону', 47.2357, 39.7015, 10)}>
                  <circle cx="360" cy="480" r="6" fill="#1976d2" stroke="#0d47a1" strokeWidth="1"/>
                  <text x="360" y="500" textAnchor="middle" fontSize="12" fill="#424242">Ростов-на-Дону</text>
                </g>

                {/* Сочи */}
                <g className="city-marker" onClick={() => handleCityClick('Сочи', 43.5855, 39.7231, 10)}>
                  <circle cx="350" cy="510" r="5" fill="#ff9800" stroke="#e65100" strokeWidth="1"/>
                  <text x="350" y="528" textAnchor="middle" fontSize="11" fill="#424242">Сочи</text>
                </g>

                {/* Легенда */}
                <g transform="translate(20, 20)">
                  <rect x="0" y="0" width="160" height="75" fill="white" opacity="0.9" stroke="#666" strokeWidth="1" rx="4"/>
                  <text x="10" y="18" fontSize="12" fontWeight="bold" fill="#212121">Легенда:</text>
                  <circle cx="20" cy="35" r="6" fill="#e53935"/>
                  <text x="35" y="40" fontSize="11" fill="#424242">Столица</text>
                  <circle cx="20" cy="55" r="5" fill="#1976d2"/>
                  <text x="35" y="60" fontSize="11" fill="#424242">Крупный город</text>
                </g>
              </svg>
            </div>
          </div>
          <p className="offline-note">🔒 Оффлайн режим: упрощенная карта работает без интернета. Нажмите на город для перехода.</p>
        </div>
      ) : (
        <div ref={mapContainerRef} id="map" style={{ height: '500px', width: '100%' }}></div>
      )}
    </>
  );
};

export default MapPage;
