import axios from "axios";
import type { Incident, IncidentPayload } from "../types/incident";
import qs from "qs";

const BASE_URL = "http://localhost:8500/api/incidents";

export const fetchIncidents = async (filters?: {
  type?: string[];
  severity?: string[];
  startDate?: string;
  endDate?: string;
}): Promise<Incident[]> => {
  const res = await axios.get(BASE_URL, {
    params: filters,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  });
  return res.data;
};

export const postIncident = async (
  incident: IncidentPayload
): Promise<string> => {
  const res = await axios.post(BASE_URL, incident);
  return res.data.id;
};
