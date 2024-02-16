const OsuClient = require('../../src/client/OsuClient');
const mockClient = require('./Client');

jest.mock('../../src/client/OsuClient');

function createOsuClientMock(options) {
  mockClient(OsuClient, options);
  return new OsuClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
}

module.exports = createOsuClientMock;
