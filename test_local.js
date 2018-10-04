const clc = require("cli-color");
const  flowFactory = require ('promiseflow');
const  Promise     = require ('nd-promise');

const WavesAPI = require('@waves/waves-api');

const runFlow = flowFactory(Promise);

var error     = clc.red.bold;
var warn      = clc.yellowBright;
var notice    = clc.cyan.bold;
var show      = clc.white.bold;

console.log(clc.greenBright("-∆- PONGO NETWORK >>>"));

const TESTNET_BYTE = 'L'.charCodeAt(0);

const newLocalConfig = {

    // The byte allowing to distinguish networks (mainnet, testnet, devnet, etc)
    networkByte: TESTNET_BYTE,

    // Node and Matcher addresses, no comments here
    nodeAddress: 'http://localhost:6861',
    matcherAddress: 'http://localhost:6866',

    // If a seed phrase length falls below that value an error will be thrown
    minimumSeedLength: 50

};

console.log(newLocalConfig);

//Change the configuration here.
const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

Waves.config.set(newLocalConfig);

const PONGO = 'PONGO';

console.log(notice("»»---------------------►"));
console.log(warn("»» CREATING WALLET ------►"));

const seed = Waves.Seed.create();

console.log(show("   SEED:\n") + seed.phrase);
console.log(show("   ADDRESS:\n") + seed.address);
console.log(show("   KEYPAIR:\n") + JSON.stringify(seed.keyPair));

const password = '0123456789';
const encrypted = seed.encrypt(password);

/*          {recipient: "3JhF7aMPXBYtJ84iwX5e3N9W5JmZRSgHPy9", amount: 1000000000000000},
          {recipient: "3JqAYiRnuiJxdMVmdTUsxuTV39LXHR5JWXk", amount: 5000000000000000},
          {recipient: "3JeXZJAU1onkoiMCKT2i5LxMXWe7aRB7daL", amount: 1000000000000000},
          {recipient: "3Jf2GXsAExpfhbcPg6NJAdaF7EhX176rb4B", amount: 1000000000000000},
          {recipient: "3JzWq595aZxaU2Jkexsb8N6XWDPYoi1wzCL", amount: 1000000000000000},
          {recipient: "3JjJuwvTcQKCq7H53H1XZXNy7Up1syjrRng", amount: 1000000000000000}
 */


//const walletAddress = '3JhF7aMPXBYtJ84iwX5e3N9W5JmZRSgHPy9';
//const walletAddress = '3Mt5tapQNq11J8AjE7DBqWvuWHGAtzNuNqz'
const walletAddress = '3JvWVsG8aGKuzXS7HYm3N6KiqLMbxKKgWrZ'
const balanceFn = function (data) {
console.log(notice("»»---------------------►"));
console.log(warn("»» GET /addresses/balance/" + walletAddress  +  " ------►"));
  return Waves.API.Node.v1.addresses.balance(walletAddress).then((balance) => {
    console.log(show(JSON.stringify(balance, null, 2)));
  });
};

const assetBalancesFn = function (data) {
console.log(notice("»»---------------------►"));
console.log(warn("»» GET /assets/balances/" + walletAddress  +  " ------►"));
  return Waves.API.Node.v1.assets.balances(walletAddress).then((balancesList) => {
   console.log(show(JSON.stringify(balancesList,null,2)));
  });
};

/*const assetsDistributionFn = function (data) {
console.log(notice("»»---------------------►"));
console.log(warn("»» GET /assets/PONGO/distribution"  +  " ------►"));
     Waves.API.Node.v1.assets.distribution("PONGO").then((distributionMap) => {
      console.log(show(JSON.stringify(distributionMap, null, 2)));
    });
};*/

const balanceDetailsFn = function (data) {
console.log(notice("»»---------------------►"));
console.log(warn("»» GET /addresses/balance/details/" + walletAddress  +  " ------►"));
  return Waves.API.Node.v1.addresses.balanceDetails(walletAddress).then((balance) => {
    console.log(show(JSON.stringify(balance, null, 2)));
  });
};

const transactionsFn = function (data) {
  console.log(notice("»»---------------------►"));
  console.log(warn("»» GET /transactions/getList/" + walletAddress  +  " ------►"));
  return Waves.API.Node.v1.transactions.getList('3PMgh8ra7v9USWUJxUCxKQKr6PM3MgqNVR8').then((txList) => {
    console.log(JSON.stringify(txList));
  });
};

const transactionsUnconfirmedFn = function (data) {
  console.log(notice("»»---------------------►"));
  console.log(warn("»» GET /transactions/unconfirmed"  +  " ------►"));
  return Waves.API.Node.v1.transactions.utxGetList().then((utxList) => {
    console.log(utxList);
  });
};


//const issueFn = function(data) {

const issueData = {
    name: 'AWESTRUCK WMB',
    description: 'The awesome waves morph token',

    // With given options you'll have 100000.00000 tokens
    quantity: 100000000,
    precision: 5,

    // This flag defines whether additional emission is possible
    reissuable: 'false',

    fee: 1000000000000,
    timestamp: Date.now()

};


  console.log(notice("»»---------------------►"));
  console.log(warn("»» POST /assets/issue"  +  " ------►"));
  const seedy = Waves.Seed.fromExistingPhrase('foo0 is een domme koe ei gaat kapot boot de maloot azerrty');

  Waves.API.Node.v1.assets.issue(issueData, seedy.keyPair).then((responseData) => {
    console.log(responseData);
  }).catch(function(e) {
    console.error('error: issue =>' + e);
  });

//};

const transferFn = function(data) {
const transferData = {

    // An arbitrary address; mine, in this example
    recipient: '3NXnVFkpGgoNwRTgF9nfKocEaTFvbbuqRg5',

    // ID of a token, or PONGO
    assetId: PONGO,

    // The real amount is the given number divided by 10^(precision of the token)
    amount: 10000000,

    // The same rules for these two fields
    feeAssetId: PONGO,
    fee: 100000,

    // 140 bytes of data (it's allowed to use Uint8Array here)
    attachment: '',

    timestamp: Date.now()

};

  console.log(notice("»»---------------------►"));
  console.log(warn("»» POST /transactions/transfer"  +  " ------►"));
  const seedi = Waves.Seed.fromExistingPhrase('foo0 is een domme koe ei gaat kapot boot de maloot azerrty');
  console.log(JSON.stringify(seedi.keyPair));
  issueData.signature  = seedi.address;

  return Waves.API.Node.transactions.broadcast(Waves.constants.TRANSFER_TX_NAME, issueData, seedi.keyPair).then((responseData) => {
    console.log(responseData);
  }).catch(function(e) {
    console.error('error: issue =>' + e);
  });

};  


const all = [balanceFn,  assetBalancesFn,  /* assetsDistributionFn*/, balanceDetailsFn, /*issueFn, */ transferFn, transactionsUnconfirmedFn ];


runFlow(all, {}).then(data => {
   console.log(data);
   console.log(clc.greenBold("-⎦˚◡˚⎣ -------- END  ----------"));
  done();
});


