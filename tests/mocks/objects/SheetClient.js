const SheetClient = require('../../src/client/SheetClient');
const mockClient = require('./Client');

jest.mock('../../src/client/SheetClient');

function createSheetClientMock(options) {
  mockClient(SheetClient, options);
  return new SheetClient('1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc');
}

module.exports = createSheetClientMock;
