const { chai, it, should, jwtHelpers } = require("./setup");
const { app } = require("../app");
const REDIS_WRAPPER = require("../src/util/redis_connection_wrapper");



describe("GET /users", () => {
    it("fetches a user", async () => {
        const subscriptionsResponse = await chai.request(app)
            .get("/users")
            .set('token', jwtHelpers.create("testemail1@mail.com"))
            .send();
        
        subscriptionsResponse.status.should.eq(200);

        subscriptionsResponse.body.data.user.name.should.eq("usernamebob");
        subscriptionsResponse.body.data.organizations.length.should.eq(1);
        subscriptionsResponse.body.data.organizations[0].members.length.should.eq(2);
        
        subscriptionsResponse.body.data.organizations[0].members[0].name.should.eq("usernamedan");
        subscriptionsResponse.body.data.organizations[0].members[0].email.should.eq("testemail2@mail.com");
        subscriptionsResponse.body.data.organizations[0].members[0].role.should.eq("owner");

        subscriptionsResponse.body.data.organizations[0].members[1].name.should.eq("usernamebob");
        subscriptionsResponse.body.data.organizations[0].members[1].email.should.eq("testemail1@mail.com");
        subscriptionsResponse.body.data.organizations[0].members[1].role.should.eq("admin");

        subscriptionsResponse.body.data.organizations[0].projects.length.should.eq(2);
        subscriptionsResponse.body.data.organizations[0].projects[0].name.should.eq("org 2 10 per second");
        subscriptionsResponse.body.data.organizations[0].projects[0].creator.should.eq("usernamebob");
        subscriptionsResponse.body.data.organizations[0].projects[0].callLimit.should.eq(10);
        subscriptionsResponse.body.data.organizations[0].projects[0].timeFrame.should.eq("second");

        
    });
});


describe("POST /users", () => {

    it("should fail to create a new user with null request body attributes", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send();

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Unable to process request");
    });

    it("should fail to create a new user with a username which is too short", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "inval",
                email: "anemail@gmail.com",
                passwordInput: "aGood&Password*",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Username must be between 6 and 24 characters, and cannot include profanity");
    });

    it("should fail to create a new user with a username which is too long", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "this username is wayyyyyyyy too long why would anyone do this",
                email: "anemail@gmail.com",
                passwordInput: "aGood&Password*",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Username must be between 6 and 24 characters, and cannot include profanity");
    });

    it("should fail to create a new user with a username which has special characters", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "crazy&",
                email: "anemail@gmail.com",
                passwordInput: "aGood&Password*",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Username must be between 6 and 24 characters, and cannot include profanity");
    });

    it("should fail to create a new user with a username which is profane", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "asshole",
                email: "anemail@gmail.com",
                passwordInput: "aGood&Password*",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Username must be between 6 and 24 characters, and cannot include profanity");
    });

    it("should fail to create a new user with an email which is invalid", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "validUsername",
                email: "notanemail",
                passwordInput: "aGoo4&Password*",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Invalid email address");
    });

    it("should fail to create a new user with an email which is profane", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "validUsername",
                email: "asshole@gmail.com",
                passwordInput: "aGood&Password*",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Invalid email address");
    });

    it("should fail to create a new user with a password which is too short", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "abc",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Password must be between 8 and 32 characters, must contain a special character and number, and cannot contain profanity");
    });

    it("should fail to create a new user with a password which is too long", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Password must be between 8 and 32 characters, must contain a special character and number, and cannot contain profanity");
    });

    it("should fail to create a new user with a password which has no special characters", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "normal13",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Password must be between 8 and 32 characters, must contain a special character and number, and cannot contain profanity");
    });

    it("should fail to create a new user with a password which has no numeric characters", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "normal!!hihl",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Password must be between 8 and 32 characters, must contain a special character and number, and cannot contain profanity");
    });

    it("should fail to create a new user with a password which is profane", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "!asshole!52",
            });

        registrationResponse.status.should.eq(400);
        registrationResponse.body.message.should.eq("Password must be between 8 and 32 characters, must contain a special character and number, and cannot contain profanity");
    });

    it("should create a new user with a valid inputs", async () => {
        const registrationResponse = await chai.request(app)
            .post("/users")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "aV@lidPassw0rdxp!lidaiosjw0rd",
            });

        registrationResponse.status.should.eq(200);
        registrationResponse.body.data.userName.should.eq("aValidUsername");
        registrationResponse.body.data.email.should.eq("anemail@gmail.com");
        registrationResponse.body.data.password.should.not.eq("aV@lidPassw0rdxp!lidaiosjw0rd"); // pw should come back hashed
    });

    

});