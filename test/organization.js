const { chai, it, should, jwtHelpers } = require("./setup");
const { app } = require("../app");

describe("/organizations/:id", () => {
    it("should return organization objects", async () => {
        const organizationsResponse = await chai.request(app)
            .get("/organizations/1")
            .set('token', jwtHelpers.create("testemail1@mail.com"))
            .send();

        organizationsResponse.status.should.eq(200);

        const org = organizationsResponse.body.data;
        org.name.should.eq("test org 1");
        org.memberships.length.should.eq(3);
        org.memberships.forEach((mem) => should.exist(mem.user));
    })
});

describe("/organizations/create", () => {
    it("should create a new organization object", async () => {
        const creationResponse = await chai.request(app)
            .post("/organizations/create")
            .set('token', jwtHelpers.create("testemail1@mail.com"))
            .send({ name: "new test org" });

        creationResponse.status.should.eq(200);
        creationResponse.body.data.name.should.eq("new test org");
    })
});

