import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { selectIncident } from "../redux/slices/incidentSlice";

const MapController: React.FC = () => {
  const map = useMap();
  const dispatch = useDispatch();
  const { selectedIncidentId, list } = useSelector(
    (state: RootState) => state.incidents
  );

  useEffect(() => {
    if (selectedIncidentId) {
      const incident = list.find((i: any) => i.id === selectedIncidentId);
      if (incident) {
        map.setView([incident.latitude, incident.longitude], 12, {
          animate: true,
        });

        // Optional: reset selection after zooming
        setTimeout(() => {
          dispatch(selectIncident(null));
        }, 500);
      }
    }
  }, [selectedIncidentId, list, map, dispatch]);

  return null;
};

export default MapController;
