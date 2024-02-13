const OsuClient = require('../../src/client/OsuClient');

jest.mock('../../src/client/OsuClient');

function createOsuClientMock(method, value) {
  jest.spyOn(OsuClient.prototype, method).mockImplementation(value);
  return new OsuClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
}

module.exports = createOsuClientMock;
