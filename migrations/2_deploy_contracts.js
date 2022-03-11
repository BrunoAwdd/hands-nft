const Hand = artifacts.require("./Hand.sol");
const HandFactory = artifacts.require("./HandFactory.sol");

const setupHandAccessories = require("../lib/setupHandAccessories.js");

// If you want to hardcode what deploys, comment out process.env.X and use
// true/false;
const DEPLOY_ALL = process.env.DEPLOY_ALL;
const DEPLOY_HANDS_SALE = process.env.DEPLOY_HANDS_SALE || DEPLOY_ALL;
// Note that we will default to this unless DEPLOY_ACCESSORIES is set.
// This is to keep the historical behavior of this migration.
const DEPLOY_HANDS = process.env.DEPLOY_HANDS || DEPLOY_HANDS_SALE || DEPLOY_ALL || (! DEPLOY_ACCESSORIES);

module.exports = async (deployer, network, addresses) => {
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress = "";
  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }

  if (DEPLOY_HANDS) {
    await deployer.deploy(Hand, proxyRegistryAddress, {gas: 5000000});
  }

  if (DEPLOY_HANDS_SALE) {
    await deployer.deploy(HandFactory, proxyRegistryAddress, Hand.address, {gas: 7000000});
    const hand = await Hand.deployed();
    await hand.transferOwnership(HandFactory.address);
  }
};
