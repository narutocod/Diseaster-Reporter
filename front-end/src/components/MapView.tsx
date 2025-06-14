import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import L from "leaflet";
import type { Incident } from "../types/incident";
import MapController from "./MapController";
import FloodIcon from "../assets/water-wave-svgrepo-com.svg";
import FireIcon from "../assets/fire-svgrepo-com.svg";
import ExplosionIcon from "../assets/collision.svg";
import { Radio } from "antd";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapView: React.FC = () => {
  const incidents = useSelector((state: RootState) => state.incidents.list);
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets");

  const getIcon = (type: string, isCritical: boolean) => {
    let iconUrl: string;

    switch (type) {
      case "Flood":
        iconUrl = FloodIcon;
        break;
      case "Fire":
        iconUrl = FireIcon;
        break;
      case "Explosion":
        iconUrl = ExplosionIcon;
        break;
      default:
        iconUrl = FloodIcon;
    }

    return L.icon({
      iconUrl,
      iconSize: isCritical ? [38, 38] : [24, 24],
      iconAnchor: [12, 12],
      className: "",
    });
  };

  // Define tile layer URLs
  const tileLayers: Record<"streets" | "satellite", string> = {
    streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite:
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <Radio.Group
        value={mapStyle}
        onChange={(e) => setMapStyle(e.target.value)}
        style={{
          position: "absolute",
          zIndex: 1000,
          top: 10,
          right: 10,
          background: "white",
          padding: "4px 8px",
          borderRadius: 4,
          boxShadow: "0 1px 6px rgba(0,0,0,0.2)",
        }}
        optionType="button"
        buttonStyle="solid"
        size="small"
      >
        <Radio.Button value="streets">Streets</Radio.Button>
        <Radio.Button value="satellite">Imagery</Radio.Button>
      </Radio.Group>

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={5}
        // maxZoom={18}
        minZoom={3}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url={tileLayers[mapStyle]} />

        <MapController />

        {incidents.map((incident: Incident) => {
          const isCritical = incident.severity === "Critical";

          return (
            <Marker
              key={incident.id}
              position={[incident.latitude, incident.longitude]}
              icon={getIcon(incident.incidentType, isCritical)}
            >
              <Popup>
                <strong>{incident.incidentType}</strong> <br />
                Severity: {incident.severity} <br />
                {incident.description}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
