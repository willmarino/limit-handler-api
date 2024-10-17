const { it, getWebAgent } = require("./setup");
const { webApp } = require("../web");


describe("POST /projects/create", () => {

    it("throws an error if the creating user is not a member of the marked organization", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const projectResponse = await agent
            .post("/projects/create")
            .send({
                orgName: "test org 1",
                name: "bobs new project 20 calls per second",
                callLimit: 20,
                timeFrameName: "second"
            });

        projectResponse.should.have.html.selector(
            ".form-error-message",
            { textContent: "Cannot create project, you are not a member of that organization" }
        )

        agent.close();
    });

    it("throws an error if the creating user does not have a significant enough role in the organization", async () => {
        const agent = await getWebAgent(webApp, "testemail3@mail.com", "password3#");
        const projectResponse = await agent
            .post("/projects/create")
            .send({
                orgName: "test org 1",
                name: "gregs new project 20 calls per second",
                callLimit: 20,
                timeFrameName: "second"
            });
        
        projectResponse.should.have.html.selector(
            ".form-error-message",
            { textContent: "Insufficient permissions, you need to be an owner or admin to create projects" }
        )

        agent.close();
    });

    it("successfully creates a project with valid input", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const projectResponse = await agent
            .post("/projects/create")
            .send({
                orgName: "test org 2",
                name: "bobs new project 20 calls per second",
                callLimit: 20,
                timeFrameName: "second"
            });

        projectResponse.status.should.eq(200);

        agent.close();
    });
})