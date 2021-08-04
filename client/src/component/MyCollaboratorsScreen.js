import React, { useEffect, useState } from "react";
import { Input, Modal, Button, Table, Space, Row } from "antd";

export default function MyCollaboratorsScreen() {
  const schoolId = window.localStorage.getItem("school_id");
  const [collaborators, setCollaborators] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputEditFirstname, setInputEditFirstname] = useState("");
  const [inputEditEmail, setInputEditEmail] = useState("");
  const [inputAddFirstname, setInputAddFirstname] = useState("");
  const [inputAddEmail, setInputAddEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => getCollaborators(), []);

  const getCollaborators = () => {
    fetch(`/users/get-collaborators/?school_id=${schoolId}`)
      .then((res) => res.json())
      .then((data) => setCollaborators(data.collaborators));
  };

  const showModal = (index) => {
    setSelectedIndex(index);
    setInputEditFirstname(collaborators[index].firstname);
    setInputEditEmail(collaborators[index].email);
    setIsEditModalVisible(true);
  };

  const handleOkEdit = () => {
    fetch(`/users/edit-user/${collaborators[selectedIndex]._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `firstname=${inputEditFirstname}&email=${inputEditEmail}&school_id=${schoolId}`,
    }).then(() => getCollaborators());
    setIsEditModalVisible(false);
  };

  const handleOkAdd = () => {
    fetch("/users/create-collaborator", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `firstname=${inputAddFirstname}&email=${inputAddEmail}&password=${inputPassword}&school_id=${schoolId}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.result) setMsg(data.msg);
        else {
          setInputAddFirstname("");
          setInputAddEmail("");
          setInputPassword("");
          setMsg("");
          getCollaborators();
        }
      });
    setIsAddModalVisible(false);
  };

  const handleDelete = (index) => {
    fetch(`/users/delete-collaborator/${collaborators[index]._id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.result) setMsg(data.msg);
        else getCollaborators();
      });
  };

  const columns = [
    {
      title: "Prénom",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Rôle",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {record.role !== "gérant" && (
            <Row style={{ gap: "16px" }}>
              {/* eslint-disable-next-line */}
              <a onClick={() => showModal(record.key)}>Editer</a>
              {/* eslint-disable-next-line */}
              <a onClick={() => handleDelete(record.key)}>Supprimer</a>
            </Row>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginRight: "2%", marginLeft: "2%" }}>
      <h2>{msg}</h2>

      <Table
        columns={columns}
        dataSource={collaborators.map((collaborator, index) => ({
          key: index,
          name: collaborator.firstname,
          role: collaborator.role,
          email: collaborator.email,
        }))}
      />

      <Button onClick={() => setIsAddModalVisible(true)}>
        Add Collaborator
      </Button>

      <Modal
        title="Editez votre collaborateur"
        visible={isEditModalVisible}
        onOk={handleOkEdit}
        onCancel={() => setIsEditModalVisible(false)}
      >
        Prénom
        <Input
          value={inputEditFirstname}
          onChange={(e) => setInputEditFirstname(e.target.value)}
        />
        Email
        <Input
          value={inputEditEmail}
          onChange={(e) => setInputEditEmail(e.target.value)}
        />
      </Modal>

      <Modal
        title="Ajouter votre collaborateur"
        visible={isAddModalVisible}
        onOk={handleOkAdd}
        onCancel={() => setIsAddModalVisible(false)}
      >
        Prénom
        <Input
          value={inputAddFirstname}
          onChange={(e) => setInputAddFirstname(e.target.value)}
        />
        Email
        <Input
          value={inputAddEmail}
          onChange={(e) => setInputAddEmail(e.target.value)}
        />
        Password
        <Input.Password
          placeholder="Password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
      </Modal>
    </div>
  );
}
