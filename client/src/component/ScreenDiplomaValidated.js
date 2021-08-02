import React, { useState, useEffect } from "react";
import "../App.css";
import { useParams, Link } from "react-router-dom";

export default function ScreenDiplomaValidated() {
  const { id_student, id_diploma } = useParams();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(
      `/validate-diploma/?id_student=${id_student}&id_diploma=${id_diploma}`
    )
      .then((res) => res.json())
      .then((data) => setMsg(data.msg));
  }, []);

  return (
    <div>
      <div className="header">
        <img
          src="/reveal.png"
          style={{ height: 80, margin: 10, marginLeft: 30 }}
          alt="Reveal"
        />
      </div>
      <div
        className="Login-page"
        style={{
          backgroundImage: "url('/backgroundColorReveal.png')",
          opacity: "75%",
        }}
      >
        <h1 style={{ color: "white" }}>{msg}</h1>
      </div>
    </div>
  );
}

