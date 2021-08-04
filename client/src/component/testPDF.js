import React, {useState, useEffect} from 'react';
import { PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    position: "absolute"
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
const MyDocument = () => (

  

  <PDFViewer style={{height: "100vh", width: "100vw", border: 0}}>
    <Document>
      <Page size="A4" layout="landscape" style={styles.page}>
          <Text>Section #1</Text>
        <View style={styles.section}>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  </PDFViewer>
);

export default MyDocument;


// const doc = new PDFDocument({ size: "A4", layout: "landscape" });
//   doc.pipe(fs.createWriteStream(pdfPath));

//   const pdfWidth = 841.89;
//   const pdfHeight = 595.28;
//   const ratio = pdfWidth / searchTemplate.template_dimensions.width;

//   const qrcodePath = "./client/public/qrcode.png";
//   QRCode.toDataURL(
//     `${process.env.DOMAIN_NAME}/diploma-student/${req.query.studentId}/${req.query.batchId}`,
//     async function (err, url) {
//       var base64Data = url.replace(/^data:image\/png;base64,/, "");
//       if (!fs.existsSync(qrcodePath))
//         fs.writeFileSync(qrcodePath, base64Data, "base64", function (err) {
//           console.log(err);
//         });
//     }
//   );

//   const bgImgField = searchTemplate.background_image_field;
//   const bgImgPath = "./client/public/backgroundImage.jpg";
//   if (!fs.existsSync(bgImgPath))
//     await downloadImg(bgImgField.imagePreview, bgImgPath);

//   const bgW = bgImgField.size.width;
//   const bgH = bgImgField.size.height;
//   doc.image(
//     bgImgPath,
//     bgImgField.position.x * ratio,
//     bgImgField.position.y * ratio,
//     {
//       width: (Number(bgW.slice(0, bgW.length - 1)) * pdfWidth) / 100,
//       height: (Number(bgH.slice(0, bgH.length - 1)) * pdfHeight) / 100,
//     }
//   );

//   const qrWidth = searchTemplate.qrcode_field.size.width;
//   const qrHeight = searchTemplate.qrcode_field.size.height;
//   doc.image(
//     qrcodePath,
//     searchTemplate.qrcode_field.position.x * ratio,
//     searchTemplate.qrcode_field.position.y * ratio,
//     {
//       width: parseFloat(qrWidth) * ratio,
//       height: parseFloat(qrHeight) * ratio,
//     }
//   );

//   const firstnameField = searchTemplate.firstname_field;
//   doc.fontSize(firstnameField.style.fontSize);
//   doc
//     .font(
//       `Courier${
//         firstnameField.style.bold || firstnameField.style.italic ? "-" : ""
//       }${firstnameField.style.bold ? "Bold" : ""}${
//         firstnameField.style.italic ? "Oblique" : ""
//       }`
//     )
//     .fillColor(firstnameField.style.color)
//     .text(
//       searchStudent.firstname,
//       firstnameField.position.x * ratio,
//       firstnameField.position.y * ratio,
//       {
//         underline: firstnameField.style.underline,
//       }
//     );

//   const lastnameField = searchTemplate.lastname_field;
//   doc.fontSize(lastnameField.style.fontSize);
//   doc
//     .font(
//       `Courier${
//         lastnameField.style.bold || lastnameField.style.italic ? "-" : ""
//       }${lastnameField.style.bold ? "Bold" : ""}${
//         lastnameField.style.italic ? "Oblique" : ""
//       }`
//     )
//     .fillColor(lastnameField.style.color)
//     .text(
//       searchStudent.lastname,
//       lastnameField.position.x * ratio,
//       lastnameField.position.y * ratio,
//       {
//         underline: lastnameField.style.underline,
//       }
//     );

//   const birthdayField = searchTemplate.birth_date_field;
//   doc
//     .font(
//       `Courier${
//         birthdayField.style.bold || birthdayField.style.italic ? "-" : ""
//       }${birthdayField.style.bold ? "Bold" : ""}${
//         birthdayField.style.italic ? "Oblique" : ""
//       }`
//     )
//     .fillColor(birthdayField.style.color)
//     .text(
//       searchStudent.birth_date,
//       birthdayField.position.x * ratio,
//       birthdayField.position.y * ratio,
//       {
//         underline: birthdayField.style.underline,
//       }
//     );

//   const curriculumField = searchTemplate.curriculum_field;
//   doc
//     .font(
//       `Courier${
//         curriculumField.style.bold || curriculumField.style.italic ? "-" : ""
//       }${curriculumField.style.bold ? "Bold" : ""}${
//         curriculumField.style.italic ? "Oblique" : ""
//       }`
//     )
//     .fillColor(curriculumField.style.color)
//     .text(
//       searchBatch.curriculum,
//       curriculumField.position.x * ratio,
//       curriculumField.position.y * ratio,
//       {
//         underline: curriculumField.style.underline,
//       }
//     );

//   const promoField = searchTemplate.promo_field;
//   doc
//     .font(
//       `Courier${promoField.style.bold || promoField.style.italic ? "-" : ""}${
//         promoField.style.bold ? "Bold" : ""
//       }${promoField.style.italic ? "Oblique" : ""}`
//     )
//     .fillColor(promoField.style.color)
//     .text(
//       searchBatch.promo,
//       promoField.position.x * ratio,
//       promoField.position.y * ratio,
//       {
//         underline: promoField.style.underline,
//       }
//     );

//   const yearField = searchTemplate.year_field;
//   doc
//     .font(
//       `Courier${yearField.style.bold || yearField.style.italic ? "-" : ""}${
//         yearField.style.bold ? "Bold" : ""
//       }${yearField.style.italic ? "Oblique" : ""}`
//     )
//     .fillColor(yearField.style.color)
//     .text(
//       searchBatch.year,
//       yearField.position.x * ratio,
//       yearField.position.y * ratio,
//       {
//         underline: yearField.style.underline,
//       }
//     );

//   const mentionField = searchTemplate.mention_field;
//   doc
//     .font(
//       `Courier${
//         mentionField.style.bold || mentionField.style.italic ? "-" : ""
//       }${mentionField.style.bold ? "Bold" : ""}${
//         mentionField.style.italic ? "Oblique" : ""
//       }`
//     )
//     .fillColor(mentionField.style.color)
//     .text(
//       searchDiploma.mention,
//       mentionField.position.x * ratio,
//       mentionField.position.y * ratio,
//       {
//         underline: mentionField.style.underline,
//       }
//     );

//   const textFields = await searchTemplate.static_fields.filter(
//     (field) => field.type === "text"
//   );
//   const imgFields = await searchTemplate.static_fields.filter(
//     (field) => field.type === "image"
//   );

//   textFields.forEach((field) =>
//     doc
//       .font(
//         `Courier${field.style.bold || field.style.italic ? "-" : ""}${
//           field.style.bold ? "Bold" : ""
//         }${field.style.italic ? "Oblique" : ""}`
//       )
//       .fillColor(field.style.color)
//       .text(field.value, field.position.x * ratio, field.position.y * ratio, {
//         underline: field.style.underline,
//       })
//   );

//   for (let i = 0; i < imgFields.length; i++) {
//     if (!fs.existsSync(`./client/public/image${i}.png`))
//       await downloadImg(
//         imgFields[i].imagePreview,
//         `./client/public/image${i}.png`
//       );
//   }

//   let fieldWidth;
//   let fieldHeight;
//   imgFields.forEach((field, i) => {
//     if (fs.existsSync(`./client/public/image${i}.png`)) {
//       fieldWidth = field.size.width;
//       fieldHeight = field.size.height;
//       doc.image(
//         `./client/public/image${i}.png`,
//         field.position.x,
//         field.position.y,
//         {
//           width: Number(fieldWidth.slice(0, fieldWidth.length - 2)) * ratio,
//           height: Number(fieldHeight.slice(0, fieldHeight.length - 2)) * ratio,
//         }
//       );
//     }
//   });

//   doc.end();

//   if (fs.existsSync(bgImgPath)) fs.unlinkSync(bgImgPath);
//   if (fs.existsSync(qrcodePath)) fs.unlinkSync(qrcodePath);
//   imgFields.forEach((field, i) => {
//     if (fs.existsSync(`./client/public/image${i}.png`))
//       fs.unlinkSync(`./client/public/image${i}.png`);
//   });