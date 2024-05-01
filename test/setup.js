// const { webServer } = require("../web");
// const { serviceServer } = require("../service");
const RED = require("../src/util/redis_connection_wrapper");
const { sequelize, models, namespace } = require("../src/db/connection");
const chai = require("chai");
const chaiHttp = require("chai-http");
const jwtHelpers = require("../src/helpers/jwt");

chai.use(chaiHttp);

// Initialize redis connection
before(async () => {
    await RED.setClient();
});

beforeEach(async () => {
    await RED.storeOrganizations();
    await RED.storeProjects();
})

// Shutdown server (why?) and redis client after all tests. This is required to have
// mocha exit successfully.
after(async () => {
    await RED.closeClient();
    await sequelize.close();
});

// Clear out redis storage
afterEach(async () => {
    await RED.clear();
});


// This replaces mocha's default 'it' function,
// this wraps all DB calls made within an 'it' block's callback in a transaction,
// and rolls them back once the callback is complete.
// This means that we don't have to wipe the DB each test run.
// Still allows seed data to exist.
function it(title, fn) {
    return global.it(title, async () => {
        const transaction = await sequelize.transaction();
        const context = namespace.createContext();

        namespace.enter(context);
        namespace.set('transaction', transaction);

        try {
            await fn();
        } catch (e) {
            throw e;
        } finally {
            await transaction.rollback();
        }
    });
}



module.exports = {
    chai,
    it,
    should: chai.should(),
    jwtHelpers,
    RED
};
