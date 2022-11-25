const constant = require('../constants');

const topicToId = new Map();
const idToTopic = new Map();
const topics = [];

Object.entries(constant.scraper.general.topics).forEach(([id, name]) => {
  topicToId.set(name, parseInt(id, 10));
  idToTopic.set(parseInt(id, 10), name);
  topics.push(name);
});

Object.entries(constant.scraper.general.topics).forEach(([id, name]) => {
  topicToId.set(name, parseInt(id, 10));
  idToTopic.set(parseInt(id, 10), name);
  topics.push(name);
});

module.exports = { topicToId, idToTopic, topics };
