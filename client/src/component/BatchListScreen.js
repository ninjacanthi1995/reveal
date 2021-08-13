import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import {
  Table,
  Space,
  Button,
  message,
  Input,
  InputNumber,
  Modal
} from "antd";
import { Link } from "react-router-dom";

export default function BatchListScreen() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState({});

  useEffect(() => {
    const schoolId = window.localStorage.getItem("school_id");
    const getBatches = async () => {
      const request = await fetch(`/batch/?school_id=${schoolId}`);
      const response = await request.json();
      if (response.success) {
        const batchList = response.batches.map((batch, i) => {
          return {
            key: i,
            ...batch,
          };
        });
        setBatches(batchList);
        setLoading(false);
      } else {
        message.error(response.error);
        setLoading(false);
      }
    };
    getBatches();
  }, []);

  const deleteBatch = async (record) => {
    const request = await fetch(`/delete-batch/${record._id}`, {
      method: "DELETE",
    });
    const response = await request.json();
    if (response.result) {
      message.success(response.message);
      setBatches(response.batches);
    } else {
      message.error(response.msg);
    }
  };

  const columns = [
    {
      title: "Modeles de nos batches",
      dataIndex: "curriculum",
      key: "curriculum",
      render: (text, record) => (
        <p>
          {record.curriculum} - {record.year}
        </p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Space size="middle">
            <p
              style={{ margin: 0, cursor: "pointer" }}
              onClick={() => showModal(record)}
            >
              Edit
            </p>
            <p style={styles.p} onClick={() => deleteBatch(record)}>
              Delete
            </p>
          </Space>
        </>
      ),
    },
  ];

  const MyButton = () => {
    return (
      <Button
        className="Button-connect"
        style={{
          marginLeft: 20,
          marginBottom: 10,
          borderRadius: 6,
          fontWeight: "bold",
        }}
      >
        {" "}
        +Ajouter un batch
      </Button>
    );
  };

  const showModal = (batch) => {
    setSelectedBatch(batch);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log(selectedBatch);
    fetch(`/edit-batch/${selectedBatch._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `year=${selectedBatch.year}&curriculum=${selectedBatch.curriculum}&promo=${selectedBatch.promo}`,
    })
      .then((res) => res.json())
      .then((data) => setBatches(data.batches));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Navbar />
      <h1>GESTIONNAIRE DES BATCHES</h1>
      <Link to="/create-batch">
        <MyButton />
      </Link>
      <Table columns={columns} loading={loading} dataSource={batches} />
      <Modal
        title="Editer votre batch"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        Année <br />
        <InputNumber
          value={selectedBatch.year}
          onChange={(value) =>
            setSelectedBatch({ ...selectedBatch, year: value })
          }
        />
        <br />
        Cursus <br />
        <Input
          value={selectedBatch.curriculum}
          onChange={(value) =>
            setSelectedBatch({ ...selectedBatch, curriculum: value })
          }
        />
        Promo <br />
        <InputNumber
          value={selectedBatch.promo}
          onChange={(value) =>
            setSelectedBatch({ ...selectedBatch, promo: value })
          }
        />
      </Modal>
    </>
  );
}

const styles = {
  p: {
    margin: 0,
    cursor: "pointer",
    color: "red",
  },
};
