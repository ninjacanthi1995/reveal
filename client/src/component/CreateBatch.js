import React, { useState, useEffect } from "react";
import { Input, InputNumber, Select, Layout, Form, Button, message } from "antd";
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
  const [school_id, setSchool_id] = useState("");
  const [templateList, setTemplateList] = useState([]);
  useEffect(() => {
    const school_id = "6101c0b6208679b2ab7f0884"
    // const school_id = window.localStorage.getItem('school_id')
    setSchool_id(school_id)
    const getTemplates = async ()=>{
      const request = await fetch(`/templates/get-templates/${school_id}`)
      const response = await request.json()
      if(response.result){
        setTemplateList(response.templateList)
      }else{
        message.error(response.error)
      }
    }
    getTemplates()
  }, []);

  console.log(`school_id`, school_id)

  const onFinish = async () => {
    const request = await fetch("/create-batch", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `year=${year}&curriculum=${curriculum}&promo=${promo}&templateName=${templateName}&school_id=${school_id}`,
    });
    const response = await request.json()
    if(response.result){
      message.success(response.msg)
    }else {
      message.error(response.msg)
    }
    setYear(null);
    setCurriculum("");
    setPromo(null);
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
              value={year}
              onChange={(value) => setYear(value)}
              defaultValue={year}
              required
            />
          </Form.Item>

          <Form.Item>
            <Input
              style={styles.input}
              placeholder="Cursus"
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
              required
            />
          </Form.Item>

          <Form.Item>
            <InputNumber
              style={styles.input}
              placeholder="Promo"
              value={promo}
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
                value={templateName}
                onSelect={(value) => setTemplateName(value)}
              >
                {templateList.map(template => {
                  return <Option key={template.template_name} value={template.template_name}>{template.template_name}</Option>
                })}
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
