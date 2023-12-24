const { chai, it, should } = require("./setup");
const { app } = require("../app");

describe("/organizations", () => {
    it("should return organization objects", async () => {
        const organizationsResponse = await chai.request(app)
            .get("/organizations")
            .send();

            
        organizationsResponse.status.should.eq(200);
        organizationsResponse.body.data.length.should.eq(2);
        
        const [ orgOne, orgTwo ] = organizationsResponse.body.data;
        
        const { name: orgOneName, memberships: orgOneMemberships } = orgOne;
        const { name: orgTwoName, memberships: orgTwoMemberships } = orgTwo;
        
        orgOneName.should.eq("test org 1");
        orgTwoName.should.eq("test org 2");

        orgOneMemberships.length.should.eq(3);
        orgOneMemberships.forEach((mem) => should.exist(mem.user));

        orgTwoMemberships.length.should.eq(2);
        orgTwoMemberships.forEach((mem) => should.exist(mem.user));
        

    })
});

describe("/organizations/create", () => {
    it("should create a new organization object", async () => {
        const creationResponse = await chai.request(app)
            .post("/organizations/create")
            .send({ name: "new test org" });

        creationResponse.status.should.eq(200);
        creationResponse.body.data.name.should.eq("new test org");
    })
});

