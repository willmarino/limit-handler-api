const { chai, it, getWebAgent } = require("./setup");
const { webApp } = require("../web");
const { models } = require("../src/db/connection");
const bcryptHelpers = require("../src/helpers/bcrypt");


describe("GET /invitations/accept", () => {
    
    it("should fail to accept an invitation with an invalid invd value", async () => {
        
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const invitation = await models.Invitations.create({
            organizationId: 2,
            senderId: 2,
            receiverId: 5,
            userRoleId: 2,
            expirationDate: new Date().getTime() + (1000 * 60 * 60 * 24)
        })
        
        const invitationAcceptanceResponse = await agent.get("/invitations/accept?invd=1234");

        invitationAcceptanceResponse.status.should.eq(200)
        invitationAcceptanceResponse.should.have.html.selector(
            ".message-modal",
            { textContent: "Failed to accept invitation" }
        );

        agent.close();
    });

    it("should fail to accept an invitation which has expired", async () => {
        
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const invitation = await models.Invitations.create({
            organizationId: 2,
            senderId: 2,
            receiverId: 5,
            userRoleId: 2,
            expirationDate: new Date().getTime() - 1000
        })
        
        const hash = await bcryptHelpers.createHash(invitation.id.toString());

        const invitationAcceptanceResponse = await agent.get(`/invitations/accept?invd=${hash}`);

        invitationAcceptanceResponse.status.should.eq(200)
        invitationAcceptanceResponse.should.have.html.selector(
            ".message-modal",
            { textContent: "Failed to accept invitation" }
        );

        agent.close();
    });

    it("should properly accept a valid invitation", async () => {
        
        const agent = await getWebAgent(webApp, "testemail1@mail.com", "password1!");
        const invitation = await models.Invitations.create({
            organizationId: 2,
            senderId: 2,
            receiverId: 5,
            userRoleId: 2,
            expirationDate: new Date().getTime() + (1000 * 60 * 60 * 24)
        })
        
        const hash = await bcryptHelpers.createHash(invitation.id.toString());

        const invitationAcceptanceResponse = await agent.get(`/invitations/accept?invd=${hash}`);

        invitationAcceptanceResponse.status.should.eq(200)
        invitationAcceptanceResponse.should.have.html.selector(
            ".message-modal",
            { textContent: "Successfully accepted invitation" }
        );

        agent.close();
    });

});