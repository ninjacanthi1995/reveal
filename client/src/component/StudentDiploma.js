import React, { useEffect, useState } from "react";
import { Button } from 'antd';
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function StudentDiploma() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

//   useEffect(() => {
//     fetch("/get-student-diploma/?diplomaId=1")
//       .then((response) => response.json())
//       .then((data) => {
//         // Do something with response.
//       });
//   }, []);

  const handleDownload = () => {
    // fetch("/get-student-diploma/?studentId=1&batchId=1")
    fetch("/create-pdf")
      .then((response) => response.json())
      .then((data) => window.open(data.path, "_blank"));
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div style={{backgroundColor: 'gray'}}>
      <Button onClick={handleDownload}>Download</Button>
      <Document file="/output.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  );
}
