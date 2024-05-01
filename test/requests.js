const { chai, it, should, jwtHelpers, RED } = require("./setup");
const { models } = require("../src/db/connection");
const { serviceApp } = require("../service");

describe("POST /requests", () => {

    const setAuthToken = async (refreshToken) => {
        const tokenResponse = await chai.request(serviceApp)
            .post("/tokens")
            .send({ refreshToken, orgIdentifier: "testidentifier2" })
        
        return tokenResponse.body.data.authToken;
    };
    
    it("correctly calculates wait time correctly when there is no need to wait", async () => {
        const authToken = await setAuthToken("testrefreshtoken2")

        const project = await models.Projects.findOne({
            where: { id: 3 },
            include: { model: models.Users, as: "creator" }
        });

        const mockRequestTimestamps = [ 1704000280894, 1704000280944, 1704000280954, 1704000280964 ];

        for(let i = 0; i < mockRequestTimestamps.length; i++){
            const response = await chai.request(serviceApp)
                .post("/requests")
                .set("orgidentifier", "testidentifier2")
                .set("authtoken", authToken)
                .send({
                    projectIdentifier: project.identifier,
                    requestTimestamp: mockRequestTimestamps[i]
                });

            response.status.should.eq(200);
            response.body.data.waitTime.should.eq(0);
        }

    });


    it("correctly calculates wait time correctly when there is a non-zero wait time", async () => {
        const authToken = await setAuthToken("testrefreshtoken2")

        const project = await models.Projects.findOne({
            where: { id: 3 },
            include: { model: models.Users, as: "creator" }
        });

        const mockRequestTimestamps = [ 1704000280894, 1704000280944, 1704000280954, 1704000280964, 1704000281494 ];
        const expectedWaitTimes = [ 0, 0, 0, 0, 400 ];

        for(let i = 0; i < mockRequestTimestamps.length; i++){
            const response = await chai.request(serviceApp)
                .post("/requests")
                .set("orgidentifier", "testidentifier2")
                .set("authtoken", authToken)
                .send({
                    projectIdentifier: project.identifier,
                    requestTimestamp: mockRequestTimestamps[i]
                });

            response.status.should.eq(200);
            response.body.data.waitTime.should.eq(expectedWaitTimes[i]);
        }

    });

    it("correctly calculates wait time correctly when there is are several non-zero wait times", async () => {
        const authToken = await setAuthToken("testrefreshtoken2")

        const project = await models.Projects.findOne({
            where: { id: 3 },
            include: { model: models.Users, as: "creator" }
        });

        const mockRequestTimestamps = [ 1704000280894, 1704000280944, 1704000280954, 1704000280964, 1704000281494, 1704000281656 ];
        const expectedWaitTimes = [ 0, 0, 0, 0, 400, 288 ];

        for(let i = 0; i < mockRequestTimestamps.length; i++){
            const response = await chai.request(serviceApp)
                .post("/requests")
                .set("orgidentifier", "testidentifier2")
                .set("authtoken", authToken)
                .send({
                    projectIdentifier: project.identifier,
                    requestTimestamp: mockRequestTimestamps[i]
                });

            response.status.should.eq(200);
            response.body.data.waitTime.should.eq(expectedWaitTimes[i]);
        }

    });

});

