const { chai, it, should } = require("./setup");
const { models } = require("../src/db/connection");
const { webApp } = require("../web");


describe("POST /auth/login", () => {
    
    it("should fail to login user when no user with the input email is found", async () => {
        const loginResponse = await chai.request(webApp)
            .post("/auth/login")
            .send({
                email: "nonexistantemail@mail.com",
                passwordInput: "unimportantPassword"
            });

        loginResponse.status.should.eq(400);
        loginResponse.body.message.should.eq("Unable to validate credentials");
    });

    it("should fail to login user with an incorrect password", async () => {
        const loginResponse = await chai.request(webApp)
            .post("/auth/login")
            .send({
                email: "testemail1@mail.com",
                passwordInput: "incorrectPassword"
            });

        loginResponse.status.should.eq(400);
        loginResponse.body.message.should.eq("Unable to validate credentials");
    });

    // it("should return a valid jwt when correct information is passed", async () => {
    //     const loginResponse = await chai.request(webApp)
    //         .post("/auth/login")
    //         .send({
    //             email: "testemail1@mail.com",
    //             passwordInput: "password1!"
    //         });

    //     loginResponse.status.should.eq(200);
    //     should.exist(loginResponse.body.data.token);
    // });

    it("should create a new session record when correct information is passed", async () => {
        const loginResponse = await chai.request(webApp)
            .post("/auth/login")
            .send({
                email: "testemail1@mail.com",
                passwordInput: "password1!"
            });

        loginResponse.status.should.eq(200);

        const user = await models.Users.findOne({ where: { email: "testemail1@mail.com" } });
        const sessions = await models.Sessions.findAll({ where: { userId: user.id } });
        sessions.length.should.eq(1);
    });

})


describe("POST /auth/register", () => {

    it("should fail to create a new user with null request body attributes", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send();

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Unable to process request" }
        )
    });

    it("should fail to create a new user with a username which is too short", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "inval",
                email: "anemail@gmail.com",
                passwordInput: "aGood&Password*",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Username must be between 6 and 24 characters" }
        )
    });

    it("should fail to create a new user with a username which is too long", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "Username must be between 6 and 24 characters",
                email: "anemail@gmail.com",
                passwordInput: "aGood&Password*",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Username must be between 6 and 24 characters" }
        )
    });

    it("should fail to create a new user with a username which has special characters", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "crazy&",
                email: "anemail@gmail.com",
                passwordInput: "aGood&Password*",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Username cannot include special characters" }
        )
    });

    it("should fail to create a new user with a username which is profane", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "asshole",
                email: "anemail@gmail.com",
                passwordInput: "aGood&Password*",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Username cannot include profanity" }
        )
    });

    it("should fail to create a new user with an email which is invalid", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "validUsername",
                email: "notanemail",
                passwordInput: "aGoo4&Password*",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Invalid email address" }
        )
    });

    it("should fail to create a new user with an email which is profane", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "validUsername",
                email: "asshole@gmail.com",
                passwordInput: "aGood&Password*",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Invalid email address" }
        )
    });

    it("should fail to create a new user with a password which is too short", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "abc",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Password must be between 8 and 24 characters" }
        )
    });

    it("should fail to create a new user with a password which is too long", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3normal1!3",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Password must be between 8 and 24 characters" }
        )
    });

    it("should fail to create a new user with a password which has no special characters", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "normal13",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Password must include at least one special character" }
        )
    });

    it("should fail to create a new user with a password which has no numeric characters", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "normal!!hihl",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Password must include at least one number" }
        )
    });

    it("should fail to create a new user with a password which is profane", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "!asshole!52",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Password cannot include profanity" }
        )
    });

    it("should fail to create a new user with an email which is already in use", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "aValidUsername",
                email: "testemail1@mail.com",
                passwordInput: "abcccc123!",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Email already in use" }
        )
    });

    it("should fail to create a new user with a username which is already in use", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "usernamebob",
                email: "anemail@gmail.com",
                passwordInput: "abcccc123!",
            });

        registrationResponse.header["user-error"].should.eq('true');
        registrationResponse.should.have.html.selector(
            ".auth-form-error-message",
            { textContent: "Username is not available" }
        )
    });

    it("should create a new user with a valid inputs", async () => {
        const registrationResponse = await chai.request(webApp)
            .post("/auth/register")
            .send({
                userName: "aValidUsername",
                email: "anemail@gmail.com",
                passwordInput: "aV@lidPassw0rdxp!lidaiosjw0rd",
            });

        registrationResponse.status.should.eq(200);
        // registrationResponse.body.data.userName.should.eq("aValidUsername");
        // registrationResponse.body.data.email.should.eq("anemail@gmail.com");
        // registrationResponse.body.data.password.should.not.eq("aV@lidPassw0rdxp!lidaiosjw0rd"); // pw should come back hashed
    });

    

});