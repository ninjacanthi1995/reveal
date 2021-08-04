import React, { useEffect, useState } from "react";
import { 
  List, 
  Button, 
  Typography, 
  message, 
  Modal,
  Input,
  Popconfirm,
  Select
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const { Option } = Select
const { Title } = Typography;

export default function SchoolCustomerList({tab}) {
  const handleRequest = async request => {
    const response = await request.json()
    if(response.result){
      if(response.message) message.success(response.message)
      setUsers(response.users)
    }else{
      message.error(response.error)
    }
  }

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getUsers = async () => {
      const request = await fetch(`/schools/${tab}/users`)
      await handleRequest(request)
    }
    getUsers()
  }, [tab]);

  const [selectedUser, setSelectedUser] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = selectUser => {
    if(selectUser) {
      console.log(`selectUser`, selectUser)
      setSelectedUser(selectUser)
    }
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setSelectedUser({})
    setIsModalVisible(false);
  };
  const handleOk = async () => {
    const userFetch = async path => {
      const request = await fetch(path, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...selectedUser, school_name: tab})
      })
      await handleRequest(request)
    }
    if(selectedUser._id){
      // modif
      await userFetch(`/users/edit/${selectedUser._id}`)
    }else{
      await userFetch(`/users/sign-up`)
    }
    closeModal()
  };

  const deleteUser = async user => {
    console.log(`user`, user)
    const request = await fetch(`/users/delete/${user._id}`, {method: "DELETE"})
    await handleRequest(request)
  }

  return (
    <>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center'}}>
        <Title style={{marginBottom: 0, marginLeft: "2%"}} level={4}>{`Liste des utilisateurs de ${tab}`}</Title>
        <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => showModal(false)} />
      </div>
      <List style={{ marginLeft: "2%", marginTop: 30 }}>
        {users.length > 0 && users.map((user, i) => {
          return (
            <List.Item key={i} style={styles.listItem}>
              {user.email}
              <div>
                <Button type="primary" size='small' shape="circle" style={{marginRight: 10}} icon={<EditOutlined />} onClick={() => showModal(user)} />
                <Popconfirm
                  title="Voulez-vous supprimer cet utilisateur ?"
                  onConfirm={() => deleteUser(user)}
                  placement="topRight"
                  okText="Oui"
                  cancelText="Ouh là ! Non !"
                >
                  <Button type="primary" danger size='small' shape="circle" icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </List.Item>
          )
        })}
      </List>

      <Modal title={selectedUser._id ? `Modifier ${selectedUser.firstname}` : `Créer un utilisateur`} visible={isModalVisible} onOk={handleOk} onCancel={closeModal}>
        <label>Prénom</label>
        <Input
          autoFocus
          placeholder="Prénom" 
          value={selectedUser.firstname} 
          onChange={e => {
            const newUser = {...selectedUser}
            newUser.firstname = e.target.value
            setSelectedUser(newUser)
          }}
        />
        <label>Email</label>
        <Input
          autoFocus
          placeholder="Email" 
          value={selectedUser.email} 
          onChange={e => {
            const newUser = {...selectedUser}
            newUser.email = e.target.value
            setSelectedUser(newUser)
          }}
        />
        <label>Mot de passe</label>
        <Input
          autoFocus
          placeholder="Mot de passe" 
          value={selectedUser.password} 
          onChange={e => {
            const newUser = {...selectedUser}
            newUser.password = e.target.value
            setSelectedUser(newUser)
          }}
        />
        <label>Rôle</label>
        <Select value={selectedUser.role} placeholder="Choisissez un rôle" style={{ width: "100%" }} onChange={value => {
            const newUser = {...selectedUser}
            newUser.role = value
            setSelectedUser(newUser)
          }}>
          <Option value="gérant">Gérant</Option>
          <Option value="collaborateur">Collaborateur</Option>
        </Select>
      </Modal>
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