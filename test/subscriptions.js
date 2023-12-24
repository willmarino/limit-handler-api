const { chai, it, should } = require("./setup");
const { app } = require("../app");


describe("/subscriptions", () => {
    it("fetches subscriptions", async () => {
        const subscriptionsResponse = await chai.request(app)
            .get("/subscriptions")
            .send();
        
        subscriptionsResponse.status.should.eq(200);
        subscriptionsResponse.body.data.length.should.eq(2);

        subscriptionsResponse.body.data[0].subscriptionTierId.should.eq(1);
        subscriptionsResponse.body.data[0].organizationId.should.eq(1);

        subscriptionsResponse.body.data[1].subscriptionTierId.should.eq(2);
        subscriptionsResponse.body.data[1].organizationId.should.eq(1);

    });
});
