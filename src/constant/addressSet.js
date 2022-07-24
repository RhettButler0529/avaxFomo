const env = "local";
// const env = "prod";
const addressSet = {
    _arcContract: env == "local"?'0xA7557A35FD52cd6B09ec71DB2E3BFD76b5455a9c':'0x3f73532fEec1036e7DF22ec201B9BAFFDC4b5079',
    _arcToken: env == "local"?'0xAF94A767EdB3Ebd1De4EfcA9c06Fa401301249De':'0xAF94A767EdB3Ebd1De4EfcA9c06Fa401301249De'
}

module.exports = {
    addressSet
};