/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Remove default icon URL to avoid conflicts
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create red icon instance
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Props interface
interface LiveLocationMapProps {
  searchedPosition: [number, number] | null;
}

// Component to update map view when coords change
const ChangeMapView: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();

  React.useEffect(() => {
    map.setView(coords, 14);
  }, [coords, map]);

  return null;
};

const LiveLocationMap: React.FC<LiveLocationMapProps> = ({ searchedPosition }) => {
  const defaultPosition: [number, number] = [23.685, 90.3563]; // Bangladesh

  return (
    <>
      <MapContainer
        center={searchedPosition || defaultPosition}
        zoom={searchedPosition ? 14 : 6}
        scrollWheelZoom={true}
        style={{ height: "600px", width: "100%" }}
        attributionControl={false} // Hide attribution in map
       
      >
        <TileLayer
          attribution='' // You can keep this empty if you hide attributionControl
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {searchedPosition && (
          <>
            <ChangeMapView coords={searchedPosition} />
            <Marker position={searchedPosition} icon={redIcon} />
          </>
        )}
      </MapContainer>

      {/* Show legal attribution outside map */}
      <div className="text-xs text-gray-500 mt-2 text-center">
        Map data &copy;{" "}
        <a
          href="https://openstreetmap.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </div>
    </>
  );
};

export default LiveLocationMap;
