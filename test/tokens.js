const { chai, it, should, jwtHelpers } = require("./setup");
const { app } = require("../app");
const { models } = require("../src/db/connection");


describe("POST /tokens", () => {
    it("should throw an error given an invalid organization identifier", async () => {
        const org = await models.Organizations.findOne({ where: { identifier: "testidentifier1" } });

        const getAuthTokenResponse = await chai.request(app)
            .post("/tokens")
            .send({
                orgIdentifier: "testidentifiernonexistent",
                refreshToken: "testrefreshtoken1"
            });

        getAuthTokenResponse.status.should.eq(400);
        getAuthTokenResponse.body.message.should.eq("Invalid organization identifier");
    })
})