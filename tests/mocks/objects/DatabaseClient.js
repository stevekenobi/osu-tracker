const DatabaseClient = require('../../src/client/DatabaseClient');
const mockClient = require('./Client');

jest.mock('../../src/client/DatabaseClient');

function createDatabaseClientMock(options) {
  mockClient(DatabaseClient, options);
  return new DatabaseClient('sqlite::memory:', false);
}

module.exports = createDatabaseClientMock;
