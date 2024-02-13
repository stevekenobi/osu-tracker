const SheetClient = require('../../src/client/SheetClient');

jest.mock('../../src/client/SheetClient');

function createSheetClientMock(method, value) {
  jest.spyOn(SheetClient.prototype, method).mockImplementation(value);
  return new SheetClient('1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc', '1wOo20zqgC615FANXHh9JdL3I1h_S5p1lEmLFCc5XhLc');
}

module.exports = createSheetClientMock;
