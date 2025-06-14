import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message, Typography } from "antd";
import { useDispatch } from "react-redux";
import type { IncidentPayload } from "../types/incident";
import Map from "./MiniMap";
import { addIncidentThunk } from "../redux/slices/incidentSlice";
import type { AppDispatch } from "../redux/store";

const { TextArea } = Input;
const { Title } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const INCIDENT_TYPES = ["Fire", "Flood", "Explosion"];
export const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"];

const IncidentFormModal: React.FC<Props> = ({ open, onClose }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (!coordinates) {
          messageApi.error("Please select a location on the map.");
          return;
        }

        const newIncident: IncidentPayload = {
          incidentType: values.incidentType,
          severity: values.severity,
          description: values.description,
          latitude: coordinates[0],
          longitude: coordinates[1],
          reporterName: values.reporterName,
        };

        dispatch(addIncidentThunk(newIncident));
        messageApi.success("Incident reported!");
        form.resetFields();
        setCoordinates(null);
        onClose();
      })
      .catch(() => {});
  };

  const handleClose = () => {
    form.resetFields();
    setCoordinates(null);
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Report a Disaster Incident"
        open={open}
        onCancel={handleClose}
        footer={null}
        width={800}
        centered
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="incidentType"
            label="Incident Type"
            rules={[{ required: true, message: "Please select incident type" }]}
          >
            <Select placeholder="Select incident type">
              {INCIDENT_TYPES.map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="severity"
            label="Severity"
            rules={[{ required: true, message: "Please select severity" }]}
          >
            <Select placeholder="Select severity level">
              {SEVERITY_LEVELS.map((level) => (
                <Select.Option key={level} value={level}>
                  {level}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={3} placeholder="Describe the incident..." />
          </Form.Item>

          <Form.Item name="reporterName" label="Reporter Name (Optional)">
            <Input placeholder="Your name (optional)" />
          </Form.Item>

          <div style={{ marginBottom: 12 }}>
            <Title level={5}>Click on the map below to select location</Title>
            <Map
              height={300}
              onSelect={(lat, lng) => setCoordinates([lat, lng])}
              selected={coordinates}
            />
          </div>

          <Form.Item>
            <Button type="primary" onClick={handleSubmit} block>
              Submit Incident
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default IncidentFormModal;
