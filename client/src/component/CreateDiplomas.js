import React, { useEffect, useState } from "react";
import { Input, Select } from "antd";
import Navbar from './Navbar';

const { Option } = Select;

export default function CreateDiplomas() {
  const [name, setName] = useState("");
  const [year, setYear] = useState(2021);
  const [curriculum, setCurriculum] = useState("");
  const [promo, setPromo] = useState(1);
  // const [schoolId, setSchoolId] = useState('123');

  useEffect(() => {
    fetch("/send-diploma");
  }, []);

  const handleSubmit = async () => {
    await fetch("/create-diploma", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${name}&year=${year}&curriculum=${curriculum}&promo=${promo}`,
    });
  };

  return (
    <div>
      <Navbar></Navbar>
      <h1>Créez vos diplômes</h1>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        {/* <label>
          Name:
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label> */}
        <label>
          Year:
          <input
            type="number"
            name="year"
            onChange={(e) => setYear(e.target.value)}
            value={year}
          />
        </label>
        <label>
          Curriculum:
          <input
            type="text"
            name="curriculum"
            onChange={(e) => setCurriculum(e.target.value)}
            value={curriculum}
          />
        </label>
        <label>
          Promo:
          <input
            type="number"
            name="promo"
            onChange={(e) => setPromo(e.target.value)}
            value={promo}
          />
        </label>
        <Input.Group compact>
          <Select style={{ width: "30%" }} defaultValue="Home">
            <Option value="Home">Home</Option>
            <Option value="Company">Company</Option>
          </Select>
        </Input.Group>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
