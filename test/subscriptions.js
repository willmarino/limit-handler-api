const { chai, it, should, getWebAgent } = require("./setup");
const { webApp } = require("../web");


describe("GET /subscriptions", () => {
    it("fetches subscriptions", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const subscriptionsResponse = await agent
            .get("/subscriptions")
            .send();
        
        subscriptionsResponse.status.should.eq(200);
        subscriptionsResponse.body.data.length.should.eq(2);

        subscriptionsResponse.body.data[0].subscriptionTierId.should.eq(1);
        subscriptionsResponse.body.data[0].organizationId.should.eq(1);

        subscriptionsResponse.body.data[1].subscriptionTierId.should.eq(2);
        subscriptionsResponse.body.data[1].organizationId.should.eq(1);

        agent.close()
    });
});
