const { chai, it, should, jwtHelpers } = require("./setup");
const { webApp } = require("../web");


describe("GET /subscription_tiers", () => {
    it("fetches subscription tiers", async () => {
        const subTiersResponse = await chai.request(webApp)
            .get("/subscription_tiers")
            .set('token', jwtHelpers.create("testemail1@mail.com", "$2b$10$P6Xs.d4j5njknHU.TQd97OF7pbYdSwuZmW7.DgkMXdsWbUpZhOFka"))
            .send();

        subTiersResponse.status.should.eq(200);
        subTiersResponse.body.data.length.should.eq(3);
        subTiersResponse.body.data[0].name.should.eq("Basic");
        subTiersResponse.body.data[1].name.should.eq("Advanced");
        subTiersResponse.body.data[2].name.should.eq("Premium");
    })
});
