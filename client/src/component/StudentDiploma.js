import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

import { pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function StudentDiploma() {
  const { studentId, batchId } = useParams();
  const [student, setStudent] = useState({});
  const [batch, setBatch] = useState({});
  const [template, setTemplate] = useState({});
  const [diploma, setDiploma] = useState({});

  useEffect(() => {
    fetch(`/get-student/?studentId=${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setStudent(data.student);
          setDiploma(
            data.student.diplomas.find(
              (diploma) => diploma.id_batch === batchId
            )
          );
        }
      });
    fetch(`/get-batch/?batchId=${batchId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setBatch(data.batch);
          fetch(
            `/templates/get/${data.batch.schoolId}/${data.batch.templateName}`
          )
            .then((res) => res.json())
            .then((data) => {
              data.result && setTemplate(data.template);
            });
        }
      });
  }, []);

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
      <PDFDownloadLink
        document={
          <MyDoc
            {...template}
            {...student}
            {...batch}
            mention={diploma.mention}
          />
        }
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download now!"
        }
      </PDFDownloadLink>
      <MyDoc {...template} {...student} {...batch} mention={diploma.mention} />
    </div>
  );
}

const MyDoc = (props) => {
  const widthA4 = 595.28;
  const heightA4 = 841.89;
  // const ratioX = widthA4 / (props.template_dimensions ? props.template_dimensions.width : widthA4);
  // const ratioY = heightA4 / (props.template_dimensions ? props.template_dimensions.height : heightA4);
  if (!props.template_dimensions) {
    return (
      <Document>
        <Page></Page>
      </Document>
    );
  }
  return (
    <Document>
      <Page
        size={[
          props.template_dimensions.height,
          props.template_dimensions.width,
        ]}
        orientation="landscape"
        style={styles.page}
      >
        <Text
          style={{
            marginLeft: props.firstname_field.position.x,
            marginTop: props.firstname_field.position.y,
            position: "absolute",
            color: props.firstname_field.style.color,
            fontWeight: props.firstname_field.style.bold ? "bold" : "normal",
            fontStyle: props.firstname_field.style.italic ? "italic" : "normal",
            textDecoration: props.firstname_field.style.underline
              ? "underline"
              : "none",
            fontSize: props.firstname_field.style.fontSize,
          }}
        >
          {props.firstname}
        </Text>

        <Text
          style={{
            marginLeft: props.lastname_field.position.x,
            marginTop: props.lastname_field.position.y,
            position: "absolute",
            color: props.lastname_field.style.color,
            fontWeight: props.lastname_field.style.bold ? "bold" : "normal",
            fontStyle: props.lastname_field.style.italic ? "italic" : "normal",
            textDecoration: props.lastname_field.style.underline
              ? "underline"
              : "none",
            fontSize: props.lastname_field.style.fontSize,
          }}
        >
          {props.lastname}
        </Text>

        <Text
          style={{
            marginLeft: props.birth_date_field.position.x,
            marginTop: props.birth_date_field.position.y,
            position: "absolute",
            color: props.birth_date_field.style.color,
            fontWeight: props.birth_date_field.style.bold ? "bold" : "normal",
            fontStyle: props.birth_date_field.style.italic
              ? "italic"
              : "normal",
            textDecoration: props.birth_date_field.style.underline
              ? "underline"
              : "none",
            fontSize: props.birth_date_field.style.fontSize,
          }}
        >
          {props.birth_date}
        </Text>

        <Text
          style={{
            marginLeft: props.curriculum_field.position.x,
            marginTop: props.curriculum_field.position.y,
            position: "absolute",
            color: props.curriculum_field.style.color,
            fontWeight: props.curriculum_field.style.bold ? "bold" : "normal",
            fontStyle: props.curriculum_field.style.italic
              ? "italic"
              : "normal",
            textDecoration: props.curriculum_field.style.underline
              ? "underline"
              : "none",
            fontSize: props.curriculum_field.style.fontSize,
          }}
        >
          {props.curriculum}
        </Text>

        <Text
          style={{
            marginLeft: props.promo_field.position.x,
            marginTop: props.promo_field.position.y,
            position: "absolute",
            color: props.promo_field.style.color,
            fontWeight: props.promo_field.style.bold ? "bold" : "normal",
            fontStyle: props.promo_field.style.italic ? "italic" : "normal",
            textDecoration: props.promo_field.style.underline
              ? "underline"
              : "none",
            fontSize: props.promo_field.style.fontSize,
          }}
        >
          {props.promo}
        </Text>

        <Text
          style={{
            marginLeft: props.year_field.position.x,
            marginTop: props.year_field.position.y,
            position: "absolute",
            color: props.year_field.style.color,
            fontWeight: props.year_field.style.bold ? "bold" : "normal",
            fontStyle: props.year_field.style.italic ? "italic" : "normal",
            textDecoration: props.year_field.style.underline
              ? "underline"
              : "none",
            fontSize: props.year_field.style.fontSize,
          }}
        >
          {props.year}
        </Text>

        <Text
          style={{
            marginLeft: props.mention_field.position.x,
            marginTop: props.mention_field.position.y,
            position: "absolute",
            color: props.mention_field.style.color,
            fontWeight: props.mention_field.style.bold ? "bold" : "normal",
            fontStyle: props.mention_field.style.italic ? "italic" : "normal",
            textDecoration: props.mention_field.style.underline
              ? "underline"
              : "none",
            fontSize: props.mention_field.style.fontSize,
          }}
        >
          {props.mention}
        </Text>

        <Image
          src={{uri: props.background_image_field.imagePreview, method: "GET"}}
          style={{
            marginLeft: props.background_image_field.position.x,
            marginTop: props.background_image_field.position.y,
            zIndex: -1,
            width: parseFloat(props.background_image_field.size.width) * props.template_dimensions.width / 100,
            height: parseFloat(props.background_image_field.size.height) * props.template_dimensions.height / 100,
            position: "absolute",
            backgroundImage: `url(${props.background_image_field.imagePreview})`,
            backgroundSize: "cover"
          }}
        />        
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    // flexDirection: "row",
    backgroundColor: "gray",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});
