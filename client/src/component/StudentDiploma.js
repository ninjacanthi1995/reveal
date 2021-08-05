import React, { useEffect, useState } from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import { pdfjs } from "react-pdf";
import { useParams } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function StudentDiploma() {
  const { student_name, batch_curriculum_year } = useParams();
  const [student, setStudent] = useState({});
  const [batch, setBatch] = useState({});
  const [template, setTemplate] = useState({});
  const [diploma, setDiploma] = useState({});

  const handleRequest = async request => {
    const response = await request.json()
    if(response.result){
      return response
    }else{
      message.error(response.msg)
    }
  }

  useEffect(() => {
    const getDatas = async () => {
      const requestBatch = await fetch(`/get-batch/?batch_curriculum_year=${batch_curriculum_year}`)
      const responseBatch = await handleRequest(requestBatch)
      setBatch(responseBatch.batch);
      
      const requestTemplate = await fetch(`/templates/get/${responseBatch.batch.schoolId}/${responseBatch.batch.templateName}`)
      const responseTemplate = await handleRequest(requestTemplate)
      setTemplate(responseTemplate.template)
      
      const requestStudent = await fetch(`/get-student/?student_name=${student_name}`)
      const responseStudent = await handleRequest(requestStudent)
      setStudent(responseStudent.student)
      setDiploma(
        responseStudent.student.diplomas.find(
          diploma => diploma.id_batch === responseBatch.batch._id
        )
      );
    }
    getDatas()
  }, [student_name, batch_curriculum_year]);

  return (
    <div style={styles.container}>
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
          <Button style={{marginTop: 20}} type="primary" icon={<DownloadOutlined />}>
            {loading ? "Loading document..." : "Download"}
          </Button>
        }
      </PDFDownloadLink>
      <MyDoc {...template} {...student} {...batch} mention={diploma.mention} />
    </div>
  );
}

const MyDoc = (props) => {
  if (!props.template_dimensions) {
    return (
      <Document>
        <Page></Page>
      </Document>
    );
  }else{
    console.log(`props.template_dimensions.width`, props.template_dimensions.width)
    return (
      <Document style={{position: "absolute", top: 70, left: "50%", transform: `translateX(-${props.template_dimensions.width/2}px)`}}>
        <Page
          size={[
            props.template_dimensions.height,
            props.template_dimensions.width,
          ]}
          orientation="landscape"
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
              zIndex: 1
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
              zIndex: 1
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
              zIndex: 1
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
              zIndex: 1
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
              zIndex: 1
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
              zIndex: 1
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
              zIndex: 1
            }}
          >
            {props.mention}
          </Text>

          <Image
            src={{uri: props.background_image_field.imagePreview, method: "GET"}}
            style={{
              marginLeft: props.background_image_field.position.x,
              marginTop: props.background_image_field.position.y,
              zIndex: 0,
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
  }
};

const styles = StyleSheet.create({
  container:{
    backgroundColor: "gray",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    height: "100vh"
  },
});
