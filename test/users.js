const { it, getWebAgent } = require("./setup");
const { webApp } = require("../web");



describe("GET /users/show", () => {
    it("fetches a user", async () => {
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const subscriptionsResponse = await agent
            .get("/users/show")
            .send();
        
        subscriptionsResponse.status.should.eq(200);

        // subscriptionsResponse.body.data.user.name.should.eq("usernamebob");
        // subscriptionsResponse.body.data.organizations.length.should.eq(1);
        // subscriptionsResponse.body.data.organizations[0].members.length.should.eq(2);
        
        // subscriptionsResponse.body.data.organizations[0].members[0].name.should.eq("usernamedan");
        // subscriptionsResponse.body.data.organizations[0].members[0].email.should.eq("testemail2@mail.com");
        // subscriptionsResponse.body.data.organizations[0].members[0].role.should.eq("owner");

        // subscriptionsResponse.body.data.organizations[0].members[1].name.should.eq("usernamebob");
        // subscriptionsResponse.body.data.organizations[0].members[1].email.should.eq("testemail1@mail.com");
        // subscriptionsResponse.body.data.organizations[0].members[1].role.should.eq("admin");

        // subscriptionsResponse.body.data.organizations[0].projects.length.should.eq(2);
        // subscriptionsResponse.body.data.organizations[0].projects[0].name.should.eq("org 2 10 per second");
        // subscriptionsResponse.body.data.organizations[0].projects[0].creator.should.eq("usernamebob");
        // subscriptionsResponse.body.data.organizations[0].projects[0].callLimit.should.eq(10);
        // subscriptionsResponse.body.data.organizations[0].projects[0].timeFrame.should.eq("second");

        agent.close();
    });
});


