import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface Props {
  lat: number;
  lng: number;
  title?: string;
  address?: string;
  category?: string;
  severity?: number;
  height?: string;
}

export const MiniLeafletMap: React.FC<Props> = ({
  lat,
  lng,
  title,
  address,
  category = 'Potholes',
  severity = 7,
  height = 'h-48',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    const iconHtml = `
      <div style="position: relative; width: 32px; height: 36px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 38px; height: 38px; border-radius: 9999px; background: rgba(2, 132, 199, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 28px; height: 28px; border-radius: 9999px; background: #0284c7; border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 11px;">
          ${severity}
        </div>
        <div style="position: absolute; bottom: 0; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #0284c7;"></div>
      </div>
    `;

    const customIcon = L.divIcon({
      className: 'mini-map-pin',
      html: iconHtml,
      iconSize: [32, 36],
      iconAnchor: [16, 36],
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    if (title || address) {
      marker.bindTooltip(
        `<div style="font-size: 11px; font-weight: 700; color: #0f172a;">${title || 'Civic Issue'}</div><div style="font-size: 10px; color: #64748b;">${address || ''}</div>`,
        { direction: 'top', offset: [0, -32] }
      );
    }

    mapRef.current = map;

    const invalidate = () => map.invalidateSize();
    setTimeout(invalidate, 100);
    setTimeout(invalidate, 300);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, title, address, severity]);

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-inner group`}>
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating Coordinate & Satellite Quick Action */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none z-[400]">
        <div className="bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] text-slate-200 font-mono flex items-center gap-1.5 shadow-md">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{lat.toFixed(5)}, {lng.toFixed(5)}</span>
        </div>

        <a
          href={`https://www.google.com/maps?q=${lat},${lng}`}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto bg-slate-900/90 hover:bg-sky-600 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-bold flex items-center gap-1 transition shadow-md"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Satellite</span>
        </a>
      </div>
    </div>
  );
};
