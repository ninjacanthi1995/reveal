import React, { useEffect, useState } from "react";
import { Table, List } from "antd";

export default function MySchoolScreen() {
  const [collaborators, setCollaborators] = useState([]);
  const [schoolName, setSchoolName] = useState("");
  
  useEffect(() => {
    const schoolId = window.localStorage.getItem("school_id");
    fetch(`/get-school/?school_id=${schoolId}`)
      .then((res) => res.json())
      .then((data) => setSchoolName(data.school.name));
    fetch(`/users/get-collaborators/?school_id=${schoolId}`)
      .then((res) => res.json())
      .then((data) => setCollaborators(data.collaborators));
  }, []);

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
  ];

  return (
    <div style={{ marginRight: "2%", marginLeft: "2%" }}>
      <List>
        <List.Item>Nom de l'école: {schoolName}</List.Item>
        <List.Item>Mes collaborateurs: </List.Item>
      </List>
      <Table
        columns={columns}
        dataSource={collaborators.map((collaborator, index) => ({
          key: index,
          name: collaborator.firstname,
          role: collaborator.role,
          email: collaborator.email,
        }))}
      />
    </div>
  );
}
