const DatabaseClient = require('../../src/client/DatabaseClient');

jest.mock('../../src/client/DatabaseClient');

function createDatabaseClientMock(method, value) {
  jest.spyOn(DatabaseClient.prototype, method).mockImplementation(value);
  return new DatabaseClient('sqlite::memory:', false);
}

module.exports = createDatabaseClientMock;
