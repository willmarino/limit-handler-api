'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.addColumn(
            "invitations",
            "unsent",
            {
                type: Sequelize.DataTypes.BOOLEAN,
                field: "unsent",
                allowNull: false,
                defaultValue: false
            }
        )
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn("invitations", "unsent");
    }
};
