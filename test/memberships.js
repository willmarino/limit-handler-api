const { chai, it, should } = require("./setup");
const { app } = require("../app");


describe("/memberships", () => {
    it("should fetch a membership", async () => {
        const membershipResponse = await chai.request(app)
            .get("/memberships/2")
            .send();

        membershipResponse.status.should.eq(200);
        membershipResponse.body.data.organizationId.should.eq(1);
        membershipResponse.body.data.userId.should.eq(4);
    })
});