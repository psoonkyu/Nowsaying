import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import type { Post } from '../App';
import 'leaflet/dist/leaflet.css';
import './MapTab.css';

// Fix standard leaflet icon path issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create Red Marker Icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom component to set map view dynamically
function UpdateCenter({ position, focusOffset }: { position: [number, number], focusOffset?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (focusOffset) {
      map.flyTo([position[0] + focusOffset[0], position[1] + focusOffset[1]], 16);
    } else {
      map.flyTo(position, 16);
    }
  }, [map, position, focusOffset]);
  return null;
}

function RecenterButton({ position }: { position: [number, number] | null }) {
  const map = useMap();
  if (!position) return null;
  return (
    <div className="recenter-btn-container">
      <button className="recenter-btn" onClick={() => map.flyTo(position, 16, { animate: true })}>
        <LocateFixed size={20} color="var(--toss-blue)" />
      </button>
    </div>
  );
}

export default function MapTab({ 
  userName = '나', 
  posts = [],
  gender = 'male',
  exploreDistance = '1Km'
}: { 
  userName?: string; 
  posts?: Post[];
  gender?: 'male' | 'female';
  exploreDistance?: '500m' | '1Km' | '3Km';
}) {
  const location = useLocation();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [focusOffset] = useState<[number, number] | undefined>(
    location.state && typeof location.state.focusLatOffset === 'number'
      ? [location.state.focusLatOffset, location.state.focusLngOffset]
      : undefined
  );
  const focusPostIdFromNav = location.state?.focusPostId || null;

  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const myLatestPost = posts.find((p) => p.author === userName);
  const otherPosts = posts.filter(p => p.author !== userName);
  
  const radiusMeters = exploreDistance === '500m' ? 500 : exploreDistance === '1Km' ? 1000 : 3000;
  
  const visiblePosts = otherPosts.filter(p => {
    if (!p.latOffset && !p.lngOffset) return true;
    const distMeters = Math.sqrt((p.latOffset||0)**2 + (p.lngOffset||0)**2) * 111000;
    return distMeters <= radiusMeters;
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => setErrorMsg(`위치 정보를 불러올 수 없습니다 (${err.message})`),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setErrorMsg('지원하지 않는 기기입니다');
    }
  }, []);

  return (
    <div className="page-container map-container">
      <header className="home-header">
        <h2>내 주변</h2>
      </header>
      <div className="map-view">
        {errorMsg ? (
          <div className="map-msg">{errorMsg}</div>
        ) : !position ? (
          <div className="map-msg">위치 탐색 중...</div>
        ) : (
          <MapContainer center={position} zoom={16} zoomControl={false} doubleClickZoom={false} className="leaflet-map-root">
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <UpdateCenter position={position} focusOffset={focusOffset} />
            
            <Circle 
              center={position} 
              radius={radiusMeters} 
              pathOptions={{ fillColor: 'var(--toss-blue)', color: 'var(--toss-blue)', weight: 1.5, fillOpacity: 0.1 }}
            />

              <Marker position={position} icon={redIcon} zIndexOffset={1000}>
                {myLatestPost ? (
                  <Tooltip 
                    direction="top" 
                    offset={[0, -35]} 
                    opacity={1} 
                    permanent={myLatestPost.id === focusPostIdFromNav}
                    className={`toss-map-tooltip ${gender === 'female' ? 'female' : ''}`}
                  >
                    <div className="tooltip-clickable-area">
                      <strong style={{ display: 'block', marginBottom: '4px' }}>{userName}</strong>
                      {myLatestPost.content}
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip 
                    direction="top" 
                    offset={[0, -35]} 
                    opacity={1} 
                    className={`toss-map-tooltip ${gender === 'female' ? 'female' : ''}`}
                  >
                    <div className="tooltip-clickable-area" style={{ textAlign: 'center' }}>
                      <strong style={{ display: 'block', marginBottom: '4px' }}>{userName}</strong>
                      현재 나의 위치
                    </div>
                  </Tooltip>
                )}
              </Marker>

            {visiblePosts.map(p => (
              <Marker 
                key={p.id} 
                position={[position[0] + (p.latOffset || 0), position[1] + (p.lngOffset || 0)]}
                icon={L.icon({
                  iconUrl: p.gender === 'female' 
                    ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
                    : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Tooltip 
                  direction="right" 
                  permanent={p.id === focusPostIdFromNav}
                  className={`other-post-tooltip ${p.gender === 'female' ? 'female' : ''}`} 
                  opacity={0.9}
                >
                  <div className="tooltip-clickable-area">
                    <strong style={{ color: p.gender === 'female' ? '#f7729b' : 'var(--toss-blue)', marginRight: '4px' }}>{p.author}</strong>
                    {p.content}
                  </div>
                </Tooltip>
              </Marker>
            ))}

            <RecenterButton position={position} />
          </MapContainer>
        )}
      </div>
    </div>
  );
}
