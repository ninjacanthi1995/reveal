import React, { useEffect, useState } from "react";
import { List, Button, Input, Table } from "antd";

const user = JSON.parse(window.localStorage.getItem("user"));

export default function SchoolCustomerList() {
  const [edit, setEdit] = useState(false);
  const [firstname, setFirstname] = useState(user.firstname);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [schoolName, setSchoolName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetch(`/get-school/?school_id=${user.school_id}`)
      .then((res) => res.json())
      .then((data) => setSchoolName(data.school.name));
  }, []);

  const onValidate = () => {
    setEdit(false);
    fetch(`/users/edit-user/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `firstname=${firstname}&email=${email}&password=${password}`,
    });
  };

  return (
    <div>
        <List style={{ marginRight: "2%", marginLeft: "2%" }}>
        <List.Item style={styles.listItem}>
        Nom de l'établissement:{" "}
        {edit ? (
            <Input
                placeholder={schoolName}
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
            />
            ) : (
            schoolName
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
            Mot de passe:{" "}
            {edit ? (
            <Input
                placeholder={password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            ) : (
            password
            )}
        </List.Item>
        <List.Item style={styles.listItem}>
            Numero de téléphone: {""}
            {edit ? (
            <Input
                placeholder={phoneNumber}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            ) : (
                phoneNumber
            )}
        </List.Item>
        {edit ? (
            <Button onClick={onValidate}>Valider</Button>
        ) : (
            <Button className='Button-connect' onClick={() => setEdit(true)} style={{ borderRadius: 6, fontWeight: "bold" }}>Modifier</Button>
        )}
        </List>
        <List style={{ marginRight: "2%", marginLeft: "2%" }}>
        <List.Item style={styles.listItem}>
        Nom de l'établissement:{" "}
        {edit ? (
            <Input
                placeholder={schoolName}
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
            />
            ) : (
            schoolName
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
            Mot de passe:{" "}
            {edit ? (
            <Input
                placeholder={password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            ) : (
            password
            )}
        </List.Item>
        <List.Item style={styles.listItem}>
            Numero de téléphone: {""}
            {edit ? (
            <Input
                placeholder={phoneNumber}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            ) : (
                phoneNumber
            )}
        </List.Item>
        {edit ? (
            <Button onClick={onValidate}>Valider</Button>
        ) : (
            <Button className='Button-connect' onClick={() => setEdit(true)} style={{ borderRadius: 6, fontWeight: "bold" }}>Modifier</Button>
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