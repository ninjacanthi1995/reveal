import React, { useState } from "react";
import { Input, InputNumber, Select, Layout, Form, Button } from "antd";
import Navbar from "./Navbar";
import { Typography } from "antd";

const { Title } = Typography;

const { Content } = Layout;

const { Option } = Select;

export default function CreateBatch() {
  const [year, setYear] = useState(null);
  const [curriculum, setCurriculum] = useState("");
  const [promo, setPromo] = useState(null);
  const [templateName, setTemplateName] = useState("");
  // const [schoolId, setSchoolId] = useState('123');

  const onFinish = async () => {
    await fetch("/create-batch", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `year=${year}&curriculum=${curriculum}&promo=${promo}&templateName=${templateName}`,
    });
    setYear(2021);
    setCurriculum("");
    setPromo(1);
    setTemplateName("");
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Navbar></Navbar>
      <Content style={styles.content}>
        <Title>Créez vos batchs</Title>
        <Form style={{ width: "50%" }}>
          <Form.Item>
            <InputNumber
              style={styles.input}
              placeholder="Year"
              onChange={(value) => setYear(value)}
              defaultValue={year}
              required
            />
          </Form.Item>

          <Form.Item>
            <Input
              style={styles.input}
              placeholder="Cursus"
              onChange={(e) => setCurriculum(e.target.value)}
              value={curriculum}
              required
            />
          </Form.Item>

          <Form.Item>
            <InputNumber
              style={styles.input}
              placeholder="Promo"
              onChange={(value) => setPromo(value)}
              defaultValue={promo}
              required
            />
          </Form.Item>

          <Form.Item>
            <Input.Group compact>
              <Select
                style={styles.input}
                placeholder="Select a template"
                onSelect={(value) => setTemplateName(value)}
              >
                <Option value="template 1">Template 1</Option>
                <Option value="template 2">Template 2</Option>
              </Select>
            </Input.Group>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={styles.input}
              onClick={onFinish}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
}

const styles = {
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
  },
};
