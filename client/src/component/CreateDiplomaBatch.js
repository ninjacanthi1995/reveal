import React, { useState } from "react";
import { Input, InputNumber, Select, Layout, Form, Button } from "antd";
import Navbar from "./Navbar";
import { Typography } from "antd";

const { Title } = Typography;

const { Content } = Layout;

const { Option } = Select;

export default function CreateDiplomaBatch() {
  const [name, setName] = useState("");
  const [year, setYear] = useState(2021);
  const [curriculum, setCurriculum] = useState("");
  const [promo, setPromo] = useState(1);
  const [templateName, setTemplateName] = useState("");
  // const [schoolId, setSchoolId] = useState('123');

  const onFinish = async () => {
    await fetch("/create-diploma-batch", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${name}&year=${year}&curriculum=${curriculum}&promo=${promo}&templateName=${templateName}`,
    });
    setName("");
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
        <Form onFinish={onFinish} style={{ width: "50%" }}>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Veuillez remplir le nom du diplome batch!",
              },
            ]}
          >
            <Input
              style={styles.input}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Veuillez remplir l'annne du diplome batch!",
              },
            ]}
          >
            <InputNumber
              style={styles.input}
              placeholder="Year"
              onChange={(value) => setYear(value)}
              defaultValue={year}
            />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Veuillez remplir le cursus du diplome batch!",
              },
            ]}
          >
            <Input
              style={styles.input}
              placeholder="Cursus"
              onChange={(e) => setCurriculum(e.target.value)}
              value={curriculum}
            />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Veuillez remplir le promo du diplome batch!",
              },
            ]}
          >
            <InputNumber
              style={styles.input}
              placeholder="Promo"
              onChange={(value) => setPromo(value)}
              defaultValue={promo}
            />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Veuillez choisir le template du diplome batch!",
              },
            ]}
          >
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
            <Button type="primary" htmlType="submit" style={styles.input}>
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
