const TODO = artifacts.require("./TODO.sol");


module.exports = function (deployer) {
    deployer.deploy(TODO);
};
