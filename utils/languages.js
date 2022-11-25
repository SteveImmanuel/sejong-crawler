const constant = require('../constants');

const langToId = new Map();
const idToLang = new Map();

Object.entries(constant.languages).forEach(([id, name]) => {
  langToId.set(name, id);
  idToLang.set(id, name);
});

module.exports = { langToId, idToLang };
