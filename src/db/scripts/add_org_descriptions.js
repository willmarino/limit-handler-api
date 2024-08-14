const { sequelize, models } = require("../connection");
const { getRandomLoremIpsum } = require("../../helpers/lorem_ipsum");


(async () => {
    const orgs = await models.Organizations.findAll({
        // where: { description: null }
    });

    for(const org of orgs){
        const s = getRandomLoremIpsum(80);
        console.log(org.name);
        console.log(s);
        await org.update({ description: s });
    }

})();

