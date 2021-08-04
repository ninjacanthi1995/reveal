import React, { useEffect } from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function StudentDiploma() {
  const { studentId, batchId } = useParams();

  const createPdf = () => {
    fetch(`/create-pdf/?studentId=${studentId}&batchId=${batchId}`);
  };
  
  useEffect(() => {
    createPdf();
    // eslint-disable-next-line
  }, [studentId, batchId]);


  const deletePdf = () => {
    fetch(`/delete-pdf/?studentId=${studentId}&batchId=${batchId}`);
  };

  const handleDownload = () => {
    createPdf();
    setTimeout(window.open(`/diploma_student${studentId}_batch${batchId}.pdf`, "_blank"), 1000);
    setTimeout(deletePdf, 2000);
  };

  function onDocumentLoadSuccess() {
    setTimeout(deletePdf, 2000);
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
