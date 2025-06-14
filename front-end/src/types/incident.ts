export interface Incident {
  id: string;
  incidentType: string;
  severity: string;
  description: string;
  latitude: number;
  longitude: number;
  reporterName?: string;
  timestamp: string;
}

// For POSTing new incidents — no ID or timestamp needed
export type IncidentPayload = Omit<Incident, "id" | "timestamp">;
