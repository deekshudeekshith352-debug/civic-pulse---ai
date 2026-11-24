import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CivicIssue } from '../types';
import { CIVIC_CATEGORIES } from '../data/seedReports';
import { Flame, Layers, MapPin, Navigation, Crosshair, Globe, Satellite, Moon, Compass, RefreshCw } from 'lucide-react';

interface Props {
  issues: CivicIssue[];
  selectedCategory: string;
  selectedStatus: string;
  onSelectIssue: (issue: CivicIssue) => void;
  userCoords?: { lat: number; lng: number } | null;
  userAccuracy?: number | null;
  isGpsTracking?: boolean;
  isLiveGpsFix?: boolean;
  gpsTrail?: [number, number][];
  onActivateGPS?: () => void;
  focusedIssueId?: string | null;
  heightClass?: string;
}

// Iconic Bengaluru Wards for rapid 1-tap map navigation
const BENGALURU_WARDS = [
  { name: 'Indiranagar', ward: 'Ward 12', lat: 12.9716, lng: 77.6412, zoom: 14 },
  { name: 'Koramangala', ward: 'Ward 45', lat: 12.9352, lng: 77.6245, zoom: 14 },
  { name: 'HSR Layout', ward: 'Ward 84', lat: 12.9121, lng: 77.6446, zoom: 14 },
  { name: 'Whitefield', ward: 'Ward 78', lat: 12.9698, lng: 77.7499, zoom: 13 },
  { name: 'Malleshwaram', ward: 'Ward 112', lat: 12.9982, lng: 77.5704, zoom: 14 },
  { name: 'MG Road CBD', ward: 'Ward 14', lat: 12.9754, lng: 77.6066, zoom: 15 },
  { name: 'Bellandur', ward: 'Ward 56', lat: 12.9304, lng: 77.6784, zoom: 14 },
  { name: 'Jayanagar', ward: 'Ward 102', lat: 12.9308, lng: 77.5838, zoom: 14 },
];

export const CityMapView: React.FC<Props> = ({
  issues,
  selectedCategory,
  selectedStatus,
  onSelectIssue,
  userCoords = { lat: 12.9716, lng: 77.6412 },
  userAccuracy = null,
  isGpsTracking = false,
  isLiveGpsFix = false,
  gpsTrail = [],
  onActivateGPS,
  focusedIssueId,
  heightClass = 'min-h-[440px] h-[520px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.LayerGroup | null>(null);
  const hasCenteredOnLiveFixRef = useRef(false);

  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'dark'>('streets');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedWardName, setSelectedWardName] = useState<string | null>(null);
  const [followGps, setFollowGps] = useState(true);

  // Filter issues
  const filteredIssues = issues.filter((item) => {
    const catMatch = selectedCategory === 'All' || item.category === selectedCategory;
    const statusMatch = selectedStatus === 'All' || item.status === selectedStatus;
    return catMatch && statusMatch;
  });

  // Base tile layer URLs
  const tileUrls = {
    streets: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = [userCoords?.lat || 12.9716, userCoords?.lng || 77.6412];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    tileLayerRef.current = L.tileLayer(tileUrls[mapStyle], {
      attribution: '&copy; OpenStreetMap contributors, Esri',
      maxZoom: 19,
      className: mapStyle === 'dark' ? 'invert hue-rotate-180 brightness-95 contrast-90' : '',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    heatLayerRef.current = L.layerGroup().addTo(map);
    userMarkerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Fix map render sizing
    const invalidate = () => map.invalidateSize();
    setTimeout(invalidate, 100);
    setTimeout(invalidate, 350);
    setTimeout(invalidate, 800);

    const resizeObserver = new ResizeObserver(() => {
      invalidate();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tile layer on style change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    tileLayerRef.current = L.tileLayer(tileUrls[mapStyle], {
      attribution: '&copy; OpenStreetMap contributors, Esri',
      maxZoom: 19,
      className: mapStyle === 'dark' ? 'invert hue-rotate-180 brightness-95 contrast-90' : '',
    }).addTo(map);
  }, [mapStyle]);

  // Render User's live GPS pulse marker, accuracy circle, and movement trail
  useEffect(() => {
    const map = mapInstanceRef.current;
    const userGroup = userMarkerRef.current;
    if (!userGroup || !userCoords) return;

    userGroup.clearLayers();

    // Draw GPS trace polyline if user has moved
    if (gpsTrail.length > 1) {
      const traceLine = L.polyline(gpsTrail, {
        color: '#10b981',
        weight: 4,
        opacity: 0.85,
        dashArray: '6, 6',
      });
      userGroup.addLayer(traceLine);
    }

    // Draw GPS accuracy radius circle when accuracy is known
    if (userAccuracy && userAccuracy > 0) {
      const accuracyCircle = L.circle([userCoords.lat, userCoords.lng], {
        radius: Math.min(userAccuracy, 500),
        color: '#0284c7',
        weight: 1.5,
        opacity: 0.5,
        fillColor: '#38bdf8',
        fillOpacity: 0.14,
      });
      userGroup.addLayer(accuracyCircle);
    }

    const userPulseIcon = L.divIcon({
      className: 'user-gps-pulse-marker',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: ${isLiveGpsFix ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)'}; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 18px; height: 18px; border-radius: 9999px; background: ${isLiveGpsFix ? '#10b981' : '#0284c7'}; border: 3px solid #ffffff; box-shadow: 0 0 10px rgba(2, 132, 199, 0.7);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const userMarker = L.marker([userCoords.lat, userCoords.lng], { icon: userPulseIcon });
    const tooltipText = isLiveGpsFix
      ? `📍 Live GPS Trace (${userCoords.lat.toFixed(5)}, ${userCoords.lng.toFixed(5)})${userAccuracy ? ` • ±${userAccuracy}m` : ''}`
      : `📍 City Center (Tap "Trace GPS" to lock your location)`;

    userMarker.bindTooltip(
      `<div style="font-weight: 700; color: ${isLiveGpsFix ? '#059669' : '#0284c7'}; font-size: 11px;">${tooltipText}</div>`,
      { direction: 'top', offset: [0, -14] }
    );
    userGroup.addLayer(userMarker);

    // Smoothly follow live GPS updates when followGps is enabled
    if (map && isLiveGpsFix && followGps) {
      if (!hasCenteredOnLiveFixRef.current) {
        hasCenteredOnLiveFixRef.current = true;
        map.flyTo([userCoords.lat, userCoords.lng], 15, { duration: 1.0 });
      } else {
        map.panTo([userCoords.lat, userCoords.lng], { animate: true, duration: 0.6 });
      }
    }
  }, [userCoords, userAccuracy, isLiveGpsFix, gpsTrail, followGps]);

  // Update markers when filtered issues or heatmap changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const heatGroup = heatLayerRef.current;
    if (!map || !markersGroup || !heatGroup) return;

    markersGroup.clearLayers();
    heatGroup.clearLayers();

    if (showHeatmap) {
      // Render density circles simulating heat clusters
      filteredIssues.forEach((issue) => {
        const radius = Math.max(220, issue.severity * 45);
        const color = issue.isEmergency ? '#ef4444' : issue.severity >= 8 ? '#f97316' : '#0284c7';
        const circle = L.circle([issue.lat, issue.lng], {
          color: 'transparent',
          fillColor: color,
          fillOpacity: 0.38,
          radius: radius,
        });
        heatGroup.addLayer(circle);
      });
    }

    // Render individual custom pin markers
    filteredIssues.forEach((issue) => {
      const getCategoryColor = () => {
        if (issue.isEmergency) return '#ef4444'; // Red
        switch (issue.category) {
          case 'Street Light': return '#f59e0b';
          case 'Garbage': return '#ec4899';
          case 'Potholes': return '#f97316';
          case 'Water Leakage': return '#0284c7';
          case 'Drainage Overflow': return '#10b981';
          default: return '#6366f1';
        }
      };

      const pinColor = getCategoryColor();
      const isResolved = issue.status === 'Resolved';
      const isFocused = issue.id === focusedIssueId;

      const iconHtml = `
        <div style="position: relative; width: 34px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; ${isFocused ? 'transform: scale(1.25); z-index: 1000;' : ''}">
          ${
            issue.isEmergency
              ? `<div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(239, 68, 68, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
              : ''
          }
          <div style="width: 30px; height: 30px; border-radius: 9999px; background: ${pinColor}; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 11px;">
            ${isResolved ? '✓' : issue.severity}
          </div>
          <div style="position: absolute; bottom: 0px; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid ${pinColor};"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-civic-pin',
        html: iconHtml,
        iconSize: [34, 40],
        iconAnchor: [17, 38],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([issue.lat, issue.lng], { icon: customIcon });

      // Rich popup with real photo thumbnail and quick action
      const popupHtml = document.createElement('div');
      popupHtml.className = 'civic-popup-content';
      popupHtml.style.cssText = 'width: 230px; font-family: inherit; color: #0f172a;';
      popupHtml.innerHTML = `
        <div style="border-radius: 12px; overflow: hidden; margin-bottom: 8px; height: 110px; background: #1e293b; position: relative;">
          <img src="${issue.images[0]}" style="width: 100%; height: 100%; object-fit: cover;" alt="${issue.title}" />
          <div style="position: absolute; top: 6px; right: 6px; background: rgba(15, 23, 42, 0.85); color: #f8fafc; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px;">
            Sev: ${issue.severity}/10
          </div>
          <div style="position: absolute; bottom: 6px; left: 6px; background: rgba(15, 23, 42, 0.85); color: #38bdf8; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px;">
            ${issue.ward}
          </div>
        </div>
        <div style="font-weight: 800; font-size: 12px; line-height: 1.3; margin-bottom: 4px; color: #0f172a;">${issue.title}</div>
        <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${issue.address}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 11px;">
          <span style="font-weight: 700; color: #0284c7;">${issue.nodalAgency || 'BBMP'}</span>
          <span style="font-weight: 800; color: #059669;">₹${(issue.estimatedCostINR || 4500).toLocaleString('en-IN')}</span>
        </div>
        <button id="view-issue-btn-${issue.id}" style="width: 100%; background: #0284c7; color: #ffffff; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 11px; cursor: pointer;">
          View Full Ticket & AI Audit →
        </button>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-issue-btn-${issue.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectIssue(issue);
          };
        }
      });

      marker.on('click', () => {
        // also call onSelectIssue if desired
      });

      markersGroup.addLayer(marker);
    });
  }, [filteredIssues, showHeatmap, focusedIssueId]);

  // Activate live GPS tracing & center map on user location
  const handleLocateMe = () => {
    setSelectedWardName(null);
    setFollowGps(true);
    if (onActivateGPS) {
      onActivateGPS();
    }
    const map = mapInstanceRef.current;
    if (!map || !userCoords) return;
    map.flyTo([userCoords.lat, userCoords.lng], 16, { duration: 1.1 });
  };

  // Fly to specific Bengaluru Ward
  const handleFlyToWard = (wardItem: typeof BENGALURU_WARDS[0]) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    setFollowGps(false);
    setSelectedWardName(wardItem.name);
    map.flyTo([wardItem.lat, wardItem.lng], wardItem.zoom, { duration: 1.4 });
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col ${heightClass}`}>
      {/* Top Bengaluru Ward Quick-Fly Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-3 py-2 flex items-center justify-between gap-2 z-20 backdrop-blur-md">
        <div className="flex items-center gap-1.5 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-bold text-white uppercase tracking-wider hidden sm:inline">
            Bengaluru Wards:
          </span>
        </div>

        {/* Scrollable ward chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 py-0.5">
          {BENGALURU_WARDS.map((w) => (
            <button
              key={w.name}
              type="button"
              onClick={() => handleFlyToWard(w)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 shrink-0 ${
                selectedWardName === w.name
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{w.name}</span>
              <span className="text-[9px] opacity-75 font-mono">({w.ward})</span>
            </button>
          ))}
        </div>

        {/* Trace Live GPS Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          className={`px-2.5 py-1.5 rounded-xl border transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
            isGpsTracking && followGps
              ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-sky-400 border-slate-700/80'
          }`}
          title="Activate GPS and trace current location"
        >
          <Crosshair className={`w-3.5 h-3.5 ${isGpsTracking ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] font-bold">
            {isLiveGpsFix ? (followGps ? 'Tracing GPS' : 'Center GPS') : 'Trace GPS'}
          </span>
        </button>
      </div>

      {/* Leaflet Map Canvas Container */}
      <div className="relative flex-1 w-full h-full min-h-[360px]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Map Controls: Tile Style, Heatmap, Visibility count */}
        <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-1.5">
          {/* Style Selector */}
          <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md p-1 rounded-xl flex items-center gap-1 shadow-lg text-xs">
            <button
              type="button"
              onClick={() => setMapStyle('streets')}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1 ${
                mapStyle === 'streets' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Streets</span>
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('satellite')}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1 ${
                mapStyle === 'satellite' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Satellite className="w-3 h-3" />
              <span>Satellite</span>
            </button>
            <button
              type="button"
              onClick={() => setMapStyle('dark')}
              className={`px-2 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1 ${
                mapStyle === 'dark' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Dark</span>
            </button>
          </div>

          {/* Heatmap Toggle */}
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition shadow-lg backdrop-blur-md cursor-pointer ${
              showHeatmap
                ? 'bg-rose-500 text-white shadow-rose-500/30'
                : 'bg-slate-900/90 text-slate-200 border border-slate-700/80 hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{showHeatmap ? 'Heatmap ON' : 'Heatmap'}</span>
          </button>

          {/* Visible count badge */}
          <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 flex items-center gap-1.5 shadow-lg">
            <Layers className="w-3 h-3 text-sky-400" />
            <span>{filteredIssues.length} Pins</span>
          </div>

          {/* Live GPS Trace Coordinate Badge */}
          {userCoords && (
            <div className="bg-slate-900/90 border border-slate-700/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold text-slate-200 flex items-center gap-1.5 shadow-lg">
              <span className={`w-2 h-2 rounded-full ${isLiveGpsFix ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span>
                {isLiveGpsFix
                  ? `${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}${userAccuracy ? ` (±${userAccuracy}m)` : ''}`
                  : 'Waiting for GPS'}
              </span>
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 border border-slate-700/80 backdrop-blur-md p-2.5 rounded-2xl text-[11px] shadow-xl hidden sm:block">
          <div className="font-bold text-slate-200 mb-1 flex items-center justify-between gap-3">
            <span>Bengaluru Civic Defects</span>
            <span className="text-[10px] text-sky-400 font-mono">BBMP • BESCOM • BWSSB</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>Potholes & Cratering</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>BESCOM Street Lights</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
              <span>BBMP Garbage (GVP)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>BWSSB Cauvery Leaks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Rajakaluve Drainage</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>Emergency Hazard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
