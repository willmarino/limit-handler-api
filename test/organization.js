const { chai, it, should } = require("./setup");
const { app } = require("../app");

describe("/organizations/", () => {
    it("should return organization objects", async () => {
        const organizationsResponse = await chai.request(app)
            .get("/organizations")
            .send();

        const [ firstOrg, secondOrg ] = organizationsResponse.body.data;

        organizationsResponse.body.data.length.should.eq(2);
        firstOrg.name.should.eq("test org 1");
        secondOrg.name.should.eq("test org 2");

    })
})