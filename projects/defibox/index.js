const axios = require("axios");
const utils = require("../helper/utils");

const eosEndpoint = "https://dapp.defibox.io/api/"
const bscEndpoint = "https://bsc.defibox.io/api/"

async function eos() {
  const eosPrice = (await utils.getPricesfromString("eos")).data.eos.usd;
  const swap = await utils.fetchURL(eosEndpoint + "swap/get24HInfo")
  const lend = await utils.fetchURL(eosEndpoint + "lend/getGlobalOpenPositionStat")
  const usn = await utils.fetchURL(eosEndpoint + "st/open/getGlobalOpenStat")
  const tvl = Number(swap.data.data.eosBalance) * eosPrice * 2 +
              lend.data.data.practicalBalance +
              usn.data.globalOpenStat.totalMortgage
  return tvl
}

async function bsc() {
  const bnbPrice = (await utils.getPricesfromString("binancecoin")).data.binancecoin.usd;
  const swap = await axios.default.post(bscEndpoint + "swap/get24HInfo", {}, { headers: { chainid: 56 }})
  const tvl = swap.data.data.usd_balance + swap.data.data.wbnb_balance * bnbPrice
  return tvl
}

async function fetch() {
  return await eos() + await bsc()
}

module.exports = {
  methodology: 'Defibox TVL is achieved by making a call to its API: https://dapp.defibox.io/api/.',
  name: 'Defibox',
  token: 'BOX',
  category: 'dexes',
  eos: {
    fetch: eos
  },
  bsc: {
    fetch: bsc
  },
  fetch
}
