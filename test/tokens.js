const { chai, it, should, RED } = require("./setup");
const { models } = require("../src/db/connection");
const { reqUtilApp } = require("../req_util");


describe("POST /tokens", () => {

    it("should throw an error given an invalid organization identifier", async () => {

        const getAuthTokenResponse = await chai.request(reqUtilApp)
            .post("/tokens")
            .send({
                orgIdentifier: "testidentifiernonexistent",
                refreshToken: "testrefreshtoken1"
            });

        getAuthTokenResponse.status.should.eq(400);
        getAuthTokenResponse.body.message.should.eq("Invalid organization identifier");
    })

    it("should throw an error given an invalid refresh token", async () => {

        const getAuthTokenResponse = await chai.request(reqUtilApp)
            .post("/tokens")
            .send({
                orgIdentifier: "testidentifier1",
                refreshToken: "testrefreshtokenincorrect"
            });

        getAuthTokenResponse.status.should.eq(400);
        getAuthTokenResponse.body.message.should.eq("Invalid refresh token");
    })

    it("should return a new auth token if info is valid", async () => {

        const getAuthTokenResponse = await chai.request(reqUtilApp)
            .post("/tokens")
            .send({
                orgIdentifier: "testidentifier1",
                refreshToken: "testrefreshtoken1"
            });

        getAuthTokenResponse.status.should.eq(200);
        getAuthTokenResponse.body.message.should.eq("Success generating auth token");
        should.exist(getAuthTokenResponse.body.data.authToken);
    })
    
    it("should cache a new auth token if info is valid", async () => {
        const org = await models.Organizations.findOne({ where: { identifier: "testidentifier1" } });

        await chai.request(reqUtilApp)
            .post("/tokens")
            .send({
                orgIdentifier: "testidentifier1",
                refreshToken: "testrefreshtoken1"
            });

        
        const cachedAuthToken = await RED.client.get(`authtoken:org:testidentifier1`);
        should.exist(cachedAuthToken);
    })


})