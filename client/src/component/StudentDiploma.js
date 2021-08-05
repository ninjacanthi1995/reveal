import React, { useEffect, useState } from "react";
import { PDFDownloadLink, Page, Text, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import { pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
var QRCode = require("qrcode");

export default function StudentDiploma() {
  const { student_name, batch_curriculum_year } = useParams();
  const [student, setStudent] = useState({});
  const [batch, setBatch] = useState({});
  const [template, setTemplate] = useState({});
  const [diploma, setDiploma] = useState({});
  const [qrUrl, setQrUrl] = useState("");

  const handleRequest = async (request) => {
    const response = await request.json();
    if (response.result) {
      return response;
    } else {
      message.error(response.msg);
      return false;
    }
  };

  useEffect(() => {
    const getDatas = async () => {
      const requestBatch = await fetch(
        `/get-batch/?batch_curriculum_year=${batch_curriculum_year}`
      );
      const responseBatch = await handleRequest(requestBatch);
      if (responseBatch) {
        setBatch(responseBatch.batch);

        const requestTemplate = await fetch(
          `/templates/get/${responseBatch.batch.schoolId}/${responseBatch.batch.templateName}`
        );
        const responseTemplate = await handleRequest(requestTemplate);
        setTemplate(responseTemplate.template);

        const requestStudent = await fetch(
          `/get-student/?student_name=${student_name}`
        );
        const responseStudent = await handleRequest(requestStudent);
        setStudent(responseStudent.student);
        const wantedDiploma = responseStudent.student.diplomas.find(
          (diploma) => diploma.id_batch === responseBatch.batch._id
        )
        setDiploma( wantedDiploma );
        QRCode.toDataURL(wantedDiploma.url_SmartContract, function (err, url) {
          setQrUrl(url);
        });
      }
    };
    getDatas();
  }, [student_name, batch_curriculum_year]);

  return (
    <div style={styles.container}>
      <PDFDownloadLink
        document={
          <MyDoc {...student} {...batch} {...template} mention={diploma.mention} url={qrUrl} />
        }
      >
        {({ blob, url, loading, error }) => (
          <Button style={{ marginTop: 20 }} type="primary" icon={<DownloadOutlined />} >
            {loading ? "Loading document..." : "Download"}
          </Button>
        )}
      </PDFDownloadLink>
      <MyDoc {...template} {...student} {...batch} mention={diploma.mention} url={qrUrl} />
    </div>
  );
}

const MyDoc = (props) => {
  if (!props.template_dimensions) return null;
  const textFields = props.static_fields.filter(
    (field) => field.type === "text"
  );
  const imgFields = props.static_fields.filter(
    (field) => field.type === "image"
  );
  const renderText = (entry) => {
    if(!props[`${entry}_field`]) return null
    return (
      <Text
        style={{
          left: props[`${entry}_field`].position.x,
          top: props[`${entry}_field`].position.y,
          position: "absolute",
          color: props[`${entry}_field`].style.color,
          fontWeight: props[`${entry}_field`].style.bold ? "bold" : "normal",
          fontStyle: props[`${entry}_field`].style.italic ? "italic" : "normal",
          textDecoration: props[`${entry}_field`].style.underline
            ? "underline"
            : "none",
          fontSize: props[`${entry}_field`].style.fontSize,
        }}
      >
        {props[entry]}
      </Text>
    );
  };

  return (
    <Document
      style={{ position: "absolute", top: 70, left: "50%", transform: `translateX(-${props.template_dimensions.width / 2}px)`,}} >
      <Page size={[ props.template_dimensions.height, props.template_dimensions.width, ]} orientation="landscape" >
        {renderText("firstname")}
        {renderText("lastname")}
        {renderText("birth_date")}
        {renderText("curriculum")}
        {renderText("promo")}
        {renderText("year")}
        {renderText("mention")}

        <Image
          src={{ uri: props.background_image_field.imagePreview, method: "GET", }}
          style={{
            marginLeft: props.background_image_field.position.x,
            marginTop: props.background_image_field.position.y,
            zIndex: -1,
            width: (parseFloat(props.background_image_field.size.width) *  props.template_dimensions.width) / 100,
            height: (parseFloat(props.background_image_field.size.height) * props.template_dimensions.height) / 100,
            position: "absolute",
            backgroundImage: `url(${props.background_image_field.imagePreview})`,
            backgroundSize: "cover",
          }}
        />

        <Image
          src={{ uri: props.url, method: "GET", }}
          style={{
            marginLeft: props.qrcode_field.position.x,
            marginTop: props.qrcode_field.position.y,
            width: parseFloat(props.qrcode_field.size.width),
            height: parseFloat(props.qrcode_field.size.height),
            position: "absolute",
            backgroundImage: `url(${props.url})`,
            backgroundSize: "cover",
          }}
        />

        {textFields.map((field) => (
          <Text
            style={{
              marginLeft: field.position.x,
              marginTop: field.position.y,
              position: "absolute",
              color: field.style.color,
              fontWeight: field.style.bold ? "bold" : "normal",
              fontStyle: field.style.italic ? "italic" : "normal",
              textDecoration: field.style.underline ? "underline" : "none",
              fontSize: field.style.fontSize,
            }}
          >
            {field.value}
          </Text>
        ))}

        {imgFields.map((field) => (
          <Image
            src={{ uri: field.imagePreview, method: "GET", }}
            style={{
              marginLeft: field.position.x,
              marginTop: field.position.y,
              width: parseFloat(field.size.width),
              height: parseFloat(field.size.height),
              position: "absolute",
              backgroundImage: `url(${field.imagePreview})`,
              backgroundSize: "cover",
            }}
          />
        ))}
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "gray",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
  },
});
