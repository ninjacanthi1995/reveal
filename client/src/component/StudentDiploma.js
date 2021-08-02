import React, { useEffect } from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function StudentDiploma() {
  const { studentId, batchId } = useParams();

  useEffect(() => {
    fetch(`/create-pdf/?studentId=${studentId}&batchId=${batchId}`);
  }, [studentId, batchId]);

  const handleDownload = async () => {
    await fetch(`/create-pdf/?studentId=${studentId}&batchId=${batchId}`).then(
      async (res) => {
        window.open(
          `/diploma_student${studentId}_batch${batchId}.pdf`,
          "_blank"
        );
        fetch(`/delete-pdf/?studentId=${studentId}&batchId=${batchId}`);
      }
    );
  };

  function onDocumentLoadSuccess() {
    fetch(`/delete-pdf/?studentId=${studentId}&batchId=${batchId}`);
  }

  return (
    <div style={styles.container}>
      <Button
        onClick={handleDownload}
        icon={<DownloadOutlined />}
        style={styles.button}
      >
        Download
      </Button>
      <Document
        file={`/diploma_student${studentId}_batch${batchId}.pdf`}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page pageNumber={1} />
      </Document>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "gray",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginBottom: "16px",
  },
};
