const { chai, it, should } = require("./setup");
const { app } = require("../app");


describe("/subscription_tiers", () => {
    it("fetches subscription tiers", async () => {
        const subTiersResponse = await chai.request(app)
            .get("/subscription_tiers")
            .send();

        subTiersResponse.status.should.eq(200);
        subTiersResponse.body.data.length.should.eq(3);
        subTiersResponse.body.data[0].name.should.eq("Basic");
        subTiersResponse.body.data[1].name.should.eq("Advanced");
        subTiersResponse.body.data[2].name.should.eq("Premium");
    })
});
