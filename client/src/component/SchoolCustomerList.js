import React, { useEffect, useState } from "react";
import { List, Button, Typography, message} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function SchoolCustomerList({tab}) {

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const request = await fetch(`/schools/${tab}/users`)
      const response = await request.json()
      if(response.result){
        setUsers(response.users)
      }else{
        message.error(response.error)
      }
    }
    getUsers()
  }, [tab]);

  return (
    <>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
        <Title style={{marginBottom: 0, marginLeft: "2%"}} level={4}>{`Liste des utilisateurs de ${tab}`}</Title>
        <Button type="primary" shape="circle" icon={<PlusOutlined />} />
      </div>
      <List style={{ marginLeft: "2%", marginTop: 30 }}>
        {users.length > 0 && users.map((user, i) => {
          return (
            <List.Item key={i} style={styles.listItem}>
              {user.email}
              <div>
                <Button type="primary" size='small' shape="circle" style={{marginRight: 10}} icon={<EditOutlined />} />
                <Button type="primary" danger size='small' shape="circle" icon={<DeleteOutlined />} />
              </div>
            </List.Item>
          )
        })}
      </List>
    </>
    
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
  listItem: {
    display: "flex",
    justifyContent: "space-between",
  },
};