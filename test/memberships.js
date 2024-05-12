const { chai, it, should, jwtHelpers } = require("./setup");
const { webApp } = require("../web");


describe("GET /memberships/:id", () => {
    it("should fetch a membership", async () => {
        const membershipResponse = await chai.request(webApp)
            .get("/memberships/2")
            .set('token', jwtHelpers.create("testemail1@mail.com", "$2b$10$P6Xs.d4j5njknHU.TQd97OF7pbYdSwuZmW7.DgkMXdsWbUpZhOFka"))
            .send();

        membershipResponse.status.should.eq(200);
        membershipResponse.body.data.organizationId.should.eq(1);
        membershipResponse.body.data.userId.should.eq(4);
    })
});