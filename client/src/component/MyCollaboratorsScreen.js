import React, { useState } from "react";
import { List, Button, Input } from "antd";

export default function MyCollaboratorsScreen() {
  const [edit, setEdit] = useState(false);
  const [firstname, setFirstname] = useState(user.firstname);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);

  const onValidate = () => {
    setEdit(false);
    fetch("/users/edit-my-account/60ffda648dac09e6d540eb27", {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `firstname=${firstname}&email=${email}&password=${password}`,
    });
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
          School ID: {user.school_id}
        </List.Item>
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
