const { chai, it, should } = require("./setup");
const { app } = require("../app");
const { models } = require("../src/db/connection");


describe("/sessions/create", () => {
    
    it("should fail to login user when no user with the input email is found", async () => {
        const loginResponse = await chai.request(app)
            .post("/sessions/create")
            .send({
                email: "nonexistantemail@mail.com",
                passwordInput: "unimportantPassword"
            });

        loginResponse.status.should.eq(400);
        loginResponse.body.message.should.eq("Unable to validate credentials");
    });

    it("should fail to login user with an incorrect password", async () => {
        const loginResponse = await chai.request(app)
            .post("/sessions/create")
            .send({
                email: "testemail1@mail.com",
                passwordInput: "incorrectPassword"
            });

        loginResponse.status.should.eq(400);
        loginResponse.body.message.should.eq("Unable to validate credentials");
    });

    it("should return a valid jwt when correct information is passed", async () => {
        const loginResponse = await chai.request(app)
            .post("/sessions/create")
            .send({
                email: "testemail1@mail.com",
                passwordInput: "password1!"
            });

        loginResponse.status.should.eq(200);
        should.exist(loginResponse.body.data.token);

    });

    it("should create a new session record when correct information is passed", async () => {
        const loginResponse = await chai.request(app)
            .post("/sessions/create")
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