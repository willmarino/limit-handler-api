const { chai, it, should, getWebAgent } = require("./setup");
const { webApp } = require("../web");

describe("GET /organizations/show/:id", () => {
    it("should return an error message if a user is not a member of the organization", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const organizationsResponse = await agent.get("/organizations/show/1")

        organizationsResponse.status.should.eq(400);
        organizationsResponse.body.message.should.eq("Not a member of this organization");

        agent.close();
    })

    it("should return an organization object if the user is a member of the organization", async () => {
        const agent = await getWebAgent(webApp, "testemail4@mail.com", "password4$");
        const organizationsResponse = await agent.get("/organizations/show/1")

        organizationsResponse.status.should.eq(200);
        
        const org = organizationsResponse.body.data;

        org.name.should.eq("test org 1");
        org.members.length.should.eq(3);
        org.members.forEach((mem) => {
            should.exist(mem.name);
            should.exist(mem.email);
            should.exist(mem.role);
        });

        org.projects.length.should.eq(1);
        org.projects[0].name.should.eq("org 1 5 per min");
        org.projects[0].creator.should.eq("usernamebill");
        org.projects[0].callLimit.should.eq(5);
        org.projects[0].timeFrame.should.eq("minute");
        
        agent.close();
    })

});

describe("POST /organizations", () => {
    it("should create a new organization object", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const creationResponse = await agent
            .post("/organizations")
            .send({ name: "new test org" });

        creationResponse.status.should.eq(200);
        creationResponse.body.data.name.should.eq("new test org");

        agent.close();
    })
});

