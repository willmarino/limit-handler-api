const { it, should, getWebAgent } = require("./setup");
const { webApp } = require("../web");
const { models } =  require("../src/db/connection");

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
        const orgResponse = await agent.get("/organizations/show/1")

        orgResponse.status.should.eq(200);

        orgResponse.should.have.html.selector(
            ".org-name",
            { textContent: "test org 1" }
        );
        
        agent.close();
    })

});

describe("POST /organizations", () => {
    it("should create a new organization object", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const creationResponse = await agent
            .post("/organizations/create")
            .send({ name: "new test org", selectedSubTier: "Basic" });

        creationResponse.status.should.eq(200);

        const orgs = await models.Organizations.findAll({ where: { name: "new test org" } });
        orgs.length.should.eq(1);

        agent.close();
    });

    it("should error out with no subscription tier selection in the request body", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const creationResponse = await agent
            .post("/organizations/create")
            .send({ name: "new test org" });

        creationResponse.should.have.html.selector(
            ".form-error-message",
            { textContent: "Please select a subscription tier" }
        )

        agent.close();
    });

    it("should error out with no name in the request body", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const creationResponse = await agent
            .post("/organizations/create")
            .send({ selectedSubTier: "Basic" });

        creationResponse.should.have.html.selector(
            ".form-error-message",
            { textContent: "Please enter an organization name" }
        )

        agent.close();
    });

    it("should error out with an empty string as the name input", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const creationResponse = await agent
            .post("/organizations/create")
            .send({ name: "",selectedSubTier: "Basic" });

        creationResponse.should.have.html.selector(
            ".form-error-message",
            { textContent: "Please enter an organization name" }
        )

        agent.close();
    });

    it("should error out when a name is repeated", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        await agent
            .post("/organizations/create")
            .send({ name: "new test org", description: "filler description", selectedSubTier: "Basic" });

        const creationResponse = await agent
            .post("/organizations/create")
            .send({ name: "new test org", description: "filler description", selectedSubTier: "Basic" });
        
        creationResponse.should.have.html.selector(
            ".form-error-message",
            { textContent: "That name is already taken" }
        )

        agent.close();
    })
});

