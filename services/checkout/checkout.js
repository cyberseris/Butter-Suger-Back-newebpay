const crypto = require('crypto');
const config = require('../../config/index');

function padToLength(str, len) {
  return str.padEnd(len, '\0');
}

const HASHKEY = config.get('newebpay.HASHKEY');
const HASHIV = config.get('newebpay.HASHIV');
const HASHKEY_32 = padToLength(HASHKEY, 32);
const HASHIV_16 = padToLength(HASHIV, 16);
const MerchantID = config.get('newebpay.MerchantID');
const Version = config.get('newebpay.Version');
const NotifyUrl = config.get('newebpay.NotifyUrl');
const ReturnUrl = config.get('newebpay.ReturnUrl');
const RespondType = 'JSON';

function genDataChain(order) {
  return `MerchantID=${MerchantID}&TimeStamp=${order.TimeStamp}&Version=${Version}&RespondType=${RespondType}&MerchantOrderNo=${order.MerchantOrderNo}&Amt=${order.Amt}&NotifyURL=${encodeURIComponent(NotifyUrl)}&ReturnURL=${encodeURIComponent(ReturnUrl)}&ItemDesc=${encodeURIComponent(order.ItemDesc)}&Email=${encodeURIComponent(order.Email)}`;
}

function createAesEncrypt(TradeInfo) {
  const encrypt = crypto.createCipheriv('aes-256-cbc', HASHKEY_32, HASHIV_16);
  let enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex');
  enc += encrypt.final('hex');
  return enc;
}

function createShaEncrypt(aesEncrypt) {
  const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;
  const sha = crypto.createHash('sha256');
  return sha.update(plainText).digest('hex').toUpperCase();
}

function createAesDecrypt(TradeInfo) {
  const decrypt = crypto.createDecipheriv('aes-256-cbc', HASHKEY_32, HASHIV_16);
  let text = decrypt.update(TradeInfo, 'hex', 'utf8');
  text += decrypt.final('utf8');
  return JSON.parse(text);
}

module.exports = {
  genDataChain,
  createAesEncrypt,
  createShaEncrypt,
  createAesDecrypt
};
