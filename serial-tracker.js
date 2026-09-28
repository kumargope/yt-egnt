const fs = require('fs');
const path = require('path');
const { FINANCE_TOPICS_1000 } = require('./finance-topics-1000');

const TRACKER_FILE = path.join(__dirname, 'serial_tracker.json');

function initTracker() {
  if (!fs.existsSync(TRACKER_FILE)) {
    const defaultData = {
      currentSerial: 1,
      totalGenerated: 0,
      history: []
    };
    fs.writeFileSync(TRACKER_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    return JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf8'));
  } catch (err) {
    const reset = { currentSerial: 1, totalGenerated: 0, history: [] };
    fs.writeFileSync(TRACKER_FILE, JSON.stringify(reset, null, 2));
    return reset;
  }
}

function saveTracker(data) {
  fs.writeFileSync(TRACKER_FILE, JSON.stringify(data, null, 2));
}

function getCurrentSerial() {
  const data = initTracker();
  return data.currentSerial || 1;
}

function getNextSerialTopic() {
  const data = initTracker();
  const currentNum = data.currentSerial || 1;
  const topic = FINANCE_TOPICS_1000.find(t => t.serialNumber === currentNum) || FINANCE_TOPICS_1000[0];

  // Increment to next serial (loop back to 1 after 1000)
  const nextNum = currentNum >= 1000 ? 1 : currentNum + 1;
  data.currentSerial = nextNum;
  data.totalGenerated = (data.totalGenerated || 0) + 1;
  data.history = data.history || [];
  data.history.unshift({
    serialNumber: currentNum,
    title: topic.headline,
    generatedAt: new Date().toISOString()
  });
  if (data.history.length > 50) data.history.pop();

  saveTracker(data);
  return topic;
}

function getTopicBySerial(serialNum) {
  const num = parseInt(serialNum, 10);
  return FINANCE_TOPICS_1000.find(t => t.serialNumber === num) || FINANCE_TOPICS_1000[0];
}

function getAllTopicsSummary() {
  return FINANCE_TOPICS_1000.map(t => ({
    id: t.id,
    serialNumber: t.serialNumber,
    paddedNumber: t.paddedNumber,
    title: t.title,
    headline: t.headline,
    category: t.category
  }));
}

module.exports = {
  getCurrentSerial,
  getNextSerialTopic,
  getTopicBySerial,
  getAllTopicsSummary,
  initTracker
};
