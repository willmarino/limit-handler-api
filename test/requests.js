const { chai, it, should, jwtHelpers, RED } = require("./setup");
const { app } = require("../app");
const { models } = require("../src/db/connection");

describe("POST /requests", () => {
    
    it("correctly calculates wait time correctly when there is no need to wait", async () => {

        const project = await models.Projects.findOne({
            where: { id: 3 },
            include: { model: models.Users, as: "creator" }
        });

        const mockRequestTimestamps = [ 1704000280894, 1704000280944, 1704000280954, 1704000280964 ];

        for(let i = 0; i < mockRequestTimestamps.length; i++){
            const response = await chai.request(app)
                .post("/requests")
                .set("token", jwtHelpers.create(project.creator.email))
                .send({
                    projectId: project.id,
                    requestTimestamp: mockRequestTimestamps[i]
                });

            response.status.should.eq(200);
            response.body.data.waitTime.should.eq(0);
        }

    });


    it("correctly calculates wait time correctly when there is a non-zero wait time", async () => {

        const project = await models.Projects.findOne({
            where: { id: 3 },
            include: { model: models.Users, as: "creator" }
        });

        const mockRequestTimestamps = [ 1704000280894, 1704000280944, 1704000280954, 1704000280964, 1704000281494 ];
        const expectedWaitTimes = [ 0, 0, 0, 0, 400 ];

        for(let i = 0; i < mockRequestTimestamps.length; i++){
            const response = await chai.request(app)
                .post("/requests")
                .set("token", jwtHelpers.create(project.creator.email))
                .send({
                    projectId: project.id,
                    requestTimestamp: mockRequestTimestamps[i]
                });

            response.status.should.eq(200);
            response.body.data.waitTime.should.eq(expectedWaitTimes[i]);
        }

    });

    it("correctly calculates wait time correctly when there is are several non-zero wait times", async () => {

        const project = await models.Projects.findOne({
            where: { id: 3 },
            include: { model: models.Users, as: "creator" }
        });

        const mockRequestTimestamps = [ 1704000280894, 1704000280944, 1704000280954, 1704000280964, 1704000281494, 1704000281656 ];
        const expectedWaitTimes = [ 0, 0, 0, 0, 400, 288 ];

        for(let i = 0; i < mockRequestTimestamps.length; i++){
            const response = await chai.request(app)
                .post("/requests")
                .set("token", jwtHelpers.create(project.creator.email))
                .send({
                    projectId: project.id,
                    requestTimestamp: mockRequestTimestamps[i]
                });

            response.status.should.eq(200);
            response.body.data.waitTime.should.eq(expectedWaitTimes[i]);
        }

    });

});

