import React, {useState} from 'react';
import '../App.css';
import { Row, Col, Form, Input, Button, message } from 'antd';
import { Link, useHistory } from 'react-router-dom';

export default function NewUserRequest() {
  let history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const onFinish =  async (values) => {
    console.log('Success:', values);
    setIsLoading(true)
    const request = await fetch('/emails/demande-inscription', {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({values})
    })
    const response = await request.json()
    if(response.result){
      message.success(response.message)
      setIsLoading(false)
      history.push("/")
    }else{
      message.error(response.error)
      setIsLoading(false)
    }
  };

  return (
    <>
      <Row style={{borderBottom: "1px solid gray"}}>
        <Link to="/"><img src="/reveal.png" style={{ height: 80, margin: 10, marginLeft: 30 }} alt="Reveal" /></Link>
      </Row>
      <Row style={{height: "calc(100vh - 101px)"}} align='middle'>
        <Col span={8} offset={2} >
          <h1 style={{marginBottom: 30}}>DEMANDE D'INSCRIPTION</h1>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Prénom"
              name="firstname"
              rules={[{ required: true, message: 'Merci de renseigner votre prénom' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nom"
              name="name"
              rules={[{ required: true, message: 'Merci de renseigner votre nom' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Merci de renseigner votre email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Téléphone"
              name="phone"
              rules={[{ required: true, message: 'Merci de renseigner votre téléphone' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="École"
              name="school"
              rules={[{ required: true, message: 'Merci de renseigner votre école' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Fonction"
              name="fonction"
              rules={[{ required: true, message: 'Merci de renseigner votre fonction' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button loading={isLoading} type="primary" htmlType="submit">
                Envoyer une demande
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Link to="/">Retour à la page de connexion</Link>
            </Form.Item>
          </Form>
        </Col>
        <Col span={12} offset={2}>
          <div style={styles.backgroundImg}></div>
        </Col>
      </Row>
    </>
  );
}

const styles = {
  backgroundImg:{
    height: "calc(100vh - 101px)",
    backgroundImage: `url("/dashboard.png")`,
    backgroundPosition: 'center',
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }
}