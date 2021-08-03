import React, { useEffect, useState } from "react";
import { List, Input, Modal } from "antd";

const user = JSON.parse(window.localStorage.getItem("user"));

export default function MyCollaboratorsScreen() {
  const [collaborators, setCollaborators] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputFirstname, setInputFirstname] = useState('');
  const [inputEmail, setInputEmail] = useState('');

  useEffect(() => {
    fetch(`/users/get-collaborators/?school_id=${user.school_id}`)
      .then((res) => res.json())
      .then((data) => setCollaborators(data.collaborators));
  }, [isModalVisible]);

  const showModal = (index) => {
    setSelectedIndex(index);
    setInputFirstname(collaborators[index].firstname);
    setInputEmail(collaborators[index].email);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    fetch(`/users/edit-user/${collaborators[selectedIndex]._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `firstname=${inputFirstname}&email=${inputEmail}`,
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (index) => {
    
  }

  return (
    <div>
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={collaborators}
        renderItem={(collaborator, index) => (
          <List.Item
            // eslint-disable-next-line
            actions={[<a onClick={() => showModal(index)}>éditer</a>, <a onClick={() => handleDelete(index)}>supprimer</a>]}
          >
            <span>Prénom: {collaborator.firstname}</span>
            <span>Email: {collaborator.email}</span>
          </List.Item>
        )}
      />
      <Modal
        title="Editez votre collaborator"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Prénom
        <Input value={inputFirstname} onChange={e => setInputFirstname(e.target.value)} />
        Email 
        <Input value={inputEmail} onChange={e => setInputEmail(e.target.value)} />
      </Modal>
    </div>
  );
}