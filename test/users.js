const { chai, it, should } = require("./setup");
const { app } = require("../app");


describe("/users", () => {
    it("fetches users", async () => {
        const subscriptionsResponse = await chai.request(app)
            .get("/users/1")
            .send();
        
        subscriptionsResponse.status.should.eq(200);
        subscriptionsResponse.body.data.username.should.eq("bob");
        subscriptionsResponse.body.data.password.should.eq("placeholder");
    });
});
