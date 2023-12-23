const { chai, it, should } = require("./setup");
const { app } = require("../app");
// const { sequelize, models } = require("")

describe("/organizations", () => {
    it("should return organization objects", async () => {
        const organizationsResponse = await chai.request(app)
            .get("/organizations")
            .send();

            
        organizationsResponse.status.should.eq(200);
        organizationsResponse.body.data.length.should.eq(2);
        
        const [ firstOrg, secondOrg ] = organizationsResponse.body.data;
        firstOrg.name.should.eq("test org 1");
        secondOrg.name.should.eq("test org 2");

    })
});

describe("/organizations/create", () => {
    it("should create a new organization object", async () => {
        const creationResponse = await chai.request(app)
            .post("/organizations/create")
            .send({ name: "new test org" });

        creationResponse.status.should.eq(200);
        creationResponse.body.data.name.should.eq("new test org");
    })
});

