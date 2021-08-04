import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

import { pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function StudentDiploma() {
  const { studentId, batchId } = useParams();
  const [student, setStudent] = useState({});

  useEffect(() => {
    fetch(`/get-student/?studentId=${studentId}`)
      .then(res => res.json())
      .then(data => {
        data.result && setStudent(data.student);
      }) 
  }, [])

  // const createPdf = () => {
  //   fetch(`/create-pdf/?studentId=${studentId}&batchId=${batchId}`)
  //     .then((res) => res.json())
  //     .then((data) => setSrc(data.src));
  // };

  // useEffect(() => {
  //   createPdf();
  //   // eslint-disable-next-line
  // }, [studentId, batchId]);

  // const deletePdf = () => {
  //   fetch(`/delete-pdf/?studentId=${studentId}&batchId=${batchId}`);
  // };

  // const handleDownload = () => {
  //   createPdf();
  //   setTimeout(
  //     window.open(`/diploma_student${studentId}_batch${batchId}.pdf`, "_blank"),
  //     1000
  //   );
  //   setTimeout(deletePdf, 2000);
  // };

  function onDocumentLoadSuccess() {
    console.log("ok");
  }

  return (
    <div style={styles.container}>
      {/* <Button
        onClick={handleDownload}
        icon={<DownloadOutlined />}
        style={styles.button}
      >
        Download
      </Button> */}
      <PDFDownloadLink document={<MyDoc />} >
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download now!'
      }
    </PDFDownloadLink>
    <MyDoc/>
    </div>
  );
}

const MyDoc = () => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={{marginLeft: 100, marginTop: 100}}>111111</Text>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: {
    // flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});
