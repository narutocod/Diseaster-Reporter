import { message, Splitter } from "antd";
import MapView from "./components/MapView";
import IncidentList from "./components/IncidentList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getIncidentsThunk } from "./redux/slices/incidentSlice";
import type { AppDispatch, RootState } from "./redux/store";

const App = () => {
  const [msgApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector((state: RootState) => state.incidents.error);

  useEffect(() => {
    dispatch(getIncidentsThunk({}));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      msgApi.error(`Failed to load incidents: ${error}`);
    }
  }, [error, msgApi]);
 
  return (
    <>
      {contextHolder}
      <Splitter
        style={{ height: "100vh", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel
          defaultSize="30%"
          min="25%"
          max="50%"
          style={{ overflowY: "auto", padding: "1rem" }}
        >
          <IncidentList />
        </Splitter.Panel>
        <Splitter.Panel>
          <MapView />
        </Splitter.Panel>
      </Splitter>
    </>
  );
};

export default App;
