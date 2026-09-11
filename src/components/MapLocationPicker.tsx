import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Technician } from '../types';

// Fix default leaflet marker icon assets
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapLocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  serviceRadiusMeters?: number;
  readOnly?: boolean;
  className?: string;
  technicians?: Technician[];
  onTechnicianSelect?: (tech: Technician) => void;
}

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  latitude = 18.5204,
  longitude = 73.8567,
  onLocationSelect,
  serviceRadiusMeters = 3000,
  readOnly = false,
  className = 'h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner',
  technicians = [],
  onTechnicianSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const techMarkersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapRef.current).setView([latitude, longitude], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      leafletMapRef.current = map;

      // Only add single user marker if no technician list is passed
      if (!technicians || technicians.length === 0) {
        const marker = L.marker([latitude, longitude], { draggable: !readOnly }).addTo(map);
        markerRef.current = marker;

        if (serviceRadiusMeters > 0) {
          const circle = L.circle([latitude, longitude], {
            radius: serviceRadiusMeters,
            color: '#10b981',
            fillColor: '#10b981',
            fillOpacity: 0.15,
          }).addTo(map);
          circleRef.current = circle;
        }

        if (!readOnly) {
          map.on('click', (e: L.LeafletMouseEvent) => {
            marker.setLatLng(e.latlng);
            if (circleRef.current) circleRef.current.setLatLng(e.latlng);
            onLocationSelect?.(e.latlng.lat, e.latlng.lng);
          });

          marker.on('dragend', () => {
            const pos = marker.getLatLng();
            if (circleRef.current) circleRef.current.setLatLng(pos);
            onLocationSelect?.(pos.lat, pos.lng);
          });
        }
      }
    }

    // Handle Technicians live pins
    if (leafletMapRef.current && technicians && technicians.length > 0) {
      // Clear previous tech markers
      techMarkersRef.current.forEach(m => m.remove());
      techMarkersRef.current = [];

      const bounds = L.latLngBounds([]);

      technicians.forEach((tech) => {
        const tLat = tech.latitude || (18.5204 + (Math.random() - 0.5) * 0.08);
        const tLng = tech.longitude || (73.8567 + (Math.random() - 0.5) * 0.08);

        bounds.extend([tLat, tLng]);

        const customHtml = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="
              width: 44px; 
              height: 44px; 
              border-radius: 50%; 
              border: 3px solid #10b981; 
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); 
              overflow: hidden; 
              background: #fff;
            ">
              <img src="${tech.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100'}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <span style="
              position: absolute; 
              bottom: -4px; 
              background: #10b981; 
              color: white; 
              font-size: 9px; 
              font-weight: 800; 
              padding: 2px 6px; 
              border-radius: 9999px;
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">🟢 LIVE</span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: customHtml,
          className: 'custom-tech-pin',
          iconSize: [44, 52],
          iconAnchor: [22, 52],
          popupAnchor: [0, -48]
        });

        const marker = L.marker([tLat, tLng], { icon: customIcon }).addTo(leafletMapRef.current!);

        const popupContent = document.createElement('div');
        popupContent.style.minWidth = '200px';
        popupContent.style.padding = '4px';
        popupContent.innerHTML = `
          <div style="font-family: inherit;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <img src="${tech.avatar_url || ''}" style="width: 36px; height: 36px; border-radius: 8px; object-fit: cover;" />
              <div>
                <strong style="font-size: 13px; color: #0f172a; display: block;">${tech.full_name}</strong>
                <span style="font-size: 11px; color: #10b981; font-weight: 600;">${tech.category_name || 'Specialist'}</span>
              </div>
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
              📍 ${tech.service_area || 'Pune'}<br/>
              ⭐ <strong>${tech.rating || 4.9}</strong> (${tech.total_reviews || 50}+ reviews) • ${tech.experience_years || 5} yrs exp
            </div>
            <button id="book-tech-${tech.id}" style="
              width: 100%; 
              background: #10b981; 
              color: white; 
              border: none; 
              border-radius: 8px; 
              padding: 6px 12px; 
              font-size: 11px; 
              font-weight: 700; 
              cursor: pointer;
            ">
              Book Technician Now →
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`book-tech-${tech.id}`);
          if (btn) {
            btn.onclick = () => onTechnicianSelect?.(tech);
          }
        });

        techMarkersRef.current.push(marker);
      });

      if (bounds.isValid()) {
        leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      // Map cleanup on unmount
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [latitude, longitude, readOnly, technicians]);

  return (
    <div className="relative">
      <div ref={mapRef} className={className} />
      {!readOnly && (!technicians || technicians.length === 0) && (
        <div className="absolute top-2 right-2 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 text-[11px] rounded-md shadow border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 pointer-events-none">
          Click map or drag pin to choose location
        </div>
      )}
    </div>
  );
};
