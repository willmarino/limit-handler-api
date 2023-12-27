const { chai, it, should } = require("./setup");
const { app } = require("../app");


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

    it("should login a user when correct information is passed", async () => {
        const loginResponse = await chai.request(app)
            .post("/sessions/create")
            .send({
                email: "testemail1@mail.com",
                passwordInput: "password1!"
            });

        loginResponse.status.should.eq(200);
        should.exist(loginResponse.body.data.token);
    });

})