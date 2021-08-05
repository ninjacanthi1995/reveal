import React, { useEffect, useState } from "react";
import { List, Button, Input } from "antd";

export default function MyAccountScreen({user}) {
  const [edit, setEdit] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  
  useEffect(() => {
    const schoolId = window.localStorage.getItem("school_id");
    if(schoolId){
      fetch(`/get-school/?school_id=${schoolId}`)
      .then((res) => res.json())
      .then((data) => setSchoolName(data.school.name));
    }
    if(user._id){
      fetch(`/users/get-user/?userId=${user._id}`)
      .then((res) => res.json())
      .then((data) => {
        setFirstname(data.user.firstname);
        setEmail(data.user.email);
        //setPassword(data.user.password);
      });
    }
  }, [user]);

  const onValidate = async () => {
    setEdit(false);
    await fetch(`/users/edit-user/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `firstname=${firstname}&email=${email}&password=${password}`,
    });
    setPassword("");
  };

  return (
    <div>
      <List style={{ marginRight: "2%", marginLeft: "2%" }}>
        <List.Item style={styles.listItem}>
          Firstname:{" "}
          {edit ? (
            <Input
              placeholder={firstname}
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          ) : (
            firstname
          )}
        </List.Item>
        <List.Item style={styles.listItem}>
          Email:{" "}
          {edit ? (
            <Input
              placeholder={email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            email
          )}
        </List.Item>
        <List.Item style={styles.listItem}>
          Password:{" "}
          {edit && (
            <Input.Password
              placeholder='votre nouveau mot de passe'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </List.Item>
        
        {!user.role === "admin" && <List.Item style={styles.listItem}>School name: {schoolName}</List.Item>}
        {edit ? (
          <Button onClick={onValidate}>Validate</Button>
        ) : (
          <Button onClick={() => setEdit(true)}>Edit</Button>
        )}
      </List>
    </div>
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
