const { chai, it, should } = require("./setup");
const { app } = require("../app");


describe("/users/:id", () => {
    it("fetches a user", async () => {
        const subscriptionsResponse = await chai.request(app)
            .get("/users/1")
            .send();
        
        subscriptionsResponse.status.should.eq(200);

        subscriptionsResponse.body.data.user.name.should.eq("bob");
        subscriptionsResponse.body.data.organizations.length.should.eq(1);
        subscriptionsResponse.body.data.organizations[0].members.length.should.eq(2);
        subscriptionsResponse.body.data.organizations[0].members[0].name.should.eq("dan");
        subscriptionsResponse.body.data.organizations[0].members[0].role.should.eq("owner");
        subscriptionsResponse.body.data.organizations[0].members[1].name.should.eq("bob");
        subscriptionsResponse.body.data.organizations[0].members[1].role.should.eq("admin");
        
    });
});
