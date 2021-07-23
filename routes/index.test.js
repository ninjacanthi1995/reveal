var app = require("../app");
var request = require("supertest");

// test("generate diplome", async (done) => {
//   await request(app)
//     .post("/generateDiplome")
//     .send({ template: "template1", student: "student1" })
//     .expect(200)
//     .expect({ result: true });
//   done();
// });

test("Réservation d'un trajet - Body correct", async (done) => {
  await request(app).post('/orderRide')
    .send({ token: 1234, depart: "56 Boulevard Pereire 75017 Paris", destination: "145 Avenue de Villiers 75017 Paris" })
    .expect(200)
    .expect({ result: true, tempsAttente: 10 });
  done();
 });
