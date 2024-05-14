const { chai, it, getWebAgent } = require("./setup");
const { webApp } = require("../web");


describe("GET /memberships/:id", () => {
    it("should fetch a membership", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        
        const membershipResponse = await agent.get("/memberships/2");

        membershipResponse.status.should.eq(200);
        membershipResponse.body.data.organizationId.should.eq(1);
        membershipResponse.body.data.userId.should.eq(4);

        agent.close();
    })
});