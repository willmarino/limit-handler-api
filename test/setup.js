const { JSDOM } = require("jsdom");
const RED = require("../src/util/redis_connection_wrapper");
const { sequelize, namespace } = require("../src/db/connection");
const jwtHelpers = require("../src/helpers/jwt");

const chai = require("chai");
const chaiHttp = require("chai-http");
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

chai.Assertion.addProperty("html", function(){
    // Where 'this' is equal to the assertion,
    // this._obj is equal to the object that the assertion is being run on,
    // and the text is the stringified html which is an attribute of the _obj (response from my API)
    chai.util.flag(this, "html", new JSDOM(this._obj.text));
});

chai.Assertion.addMethod("selector", function(queryString, options){
    
    // Set a default count of 1 when testing how many elements are found
    options = Object.assign({}, { count: 1 }, options);

    // This is the resulting JSDOM object
    const DOM = chai.util.flag(this, "html");
    
    // Grab all elements in the DOM which match the query string by tag type, id, or class
    const selectedElements = DOM.window.document.querySelectorAll(queryString);

    // run assertion
    this.assert(
        selectedElements.length === options.count,
        `Expected ${options.count} elements using selector (${queryString}), instead found ${selectedElements.length}`
    );

    // check text content of html elements, all elements selected must match given options.textContent value
    if(options.textContent){
        for(const e of selectedElements){
            this.assert(
                e.textContent === options.textContent,
                `Expected element ${e} to have textContent: \n\t ${options.textContent}\n\t instead found: \n\t ${e.textContent}`
            )
        }
    }

})



module.exports = {
    chai,
    it,
    should: chai.should(),
    jwtHelpers,
    RED
};
