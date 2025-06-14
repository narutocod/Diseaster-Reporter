import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { Table, Select, DatePicker, Space, Tag, Divider, Button } from "antd";
import dayjs from "dayjs";
import IncidentFormModal, {
  INCIDENT_TYPES,
  SEVERITY_LEVELS,
} from "./IncidentFormModal";
import {
  getIncidentsThunk,
  selectIncident,
} from "../redux/slices/incidentSlice";
import "./IncidentList.css";

const { RangePicker } = DatePicker;

const IncidentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: incidents, loading } = useSelector(
    (state: RootState) => state.incidents
  );
  const [open, setOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );

  useEffect(() => {
    dispatch(
      getIncidentsThunk({
        type: typeFilter,
        severity: severityFilter,
        startDate: dateRange?.[0]?.startOf("day").toISOString(),
        endDate: dateRange?.[1]?.endOf("day").toISOString(),
      })
    );
  }, [typeFilter, severityFilter, dateRange, dispatch]);

  const columns = [
    {
      title: "Type",
      dataIndex: "incidentType",
      key: "type",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity: string) => {
        const colorMap: any = {
          Low: "green",
          Medium: "gold",
          High: "orange",
          Critical: "red",
        };
        return <Tag color={colorMap[severity] || "default"}>{severity}</Tag>;
      },
    },
    {
      title: "Reported By",
      dataIndex: "reporterName",
      key: "reporter",
      render: (name: string) => name || "Anonymous",
    },
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (value: string) => dayjs(value).format("DD MMM YYYY"),
    },
  ];

  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
            alignItems: "center",
          }}
        >
          <b style={{ fontSize: "16px" }}>Incident List</b>
          <Button type="primary" onClick={() => setOpen(true)}>
            Report Incident
          </Button>
        </div>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Filter by Type"
            style={{ width: "100%" }}
            onChange={(values) => setTypeFilter(values)}
            options={INCIDENT_TYPES.map((t) => ({ label: t, value: t }))}
          />

          <Select
            mode="multiple"
            allowClear
            placeholder="Filter by Severity"
            style={{ width: "100%" }}
            onChange={(values) => setSeverityFilter(values)}
            options={SEVERITY_LEVELS.map((s) => ({ label: s, value: s }))}
          />

          <RangePicker
            style={{ width: "100%" }}
            onChange={(dates) =>
              setDateRange(dates ? [dates[0]!, dates[1]!] : null)
            }
          />
        </Space>

        <Divider />

        <Table
          rowKey="id"
          dataSource={incidents}
          columns={columns}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10 }}
          size="small"
          onRow={(record) => ({
            onClick: () => {
              dispatch(selectIncident(record.id));
            },
          })}
          rowClassName={() => "clickableRow"}
          loading={loading}
        />
      </div>
      <IncidentFormModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default IncidentList;
