import React, { useState } from "react";

export default function CreateDiplomas() {
  const [name, setName] = useState("");
  const [year, setYear] = useState(2021);
  const [curriculum, setCurriculum] = useState("");
  const [promo, setPromo] = useState(1);
  // const [schoolId, setSchoolId] = useState('123');

  const handleSubmit = async () => {
    await fetch("/create-diploma", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `name=${name}&year=${year}&curriculum=${curriculum}&promo=${promo}`,
    });
  };

  return (
    <div>
      <h1>Creez vos diplomes</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
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
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
