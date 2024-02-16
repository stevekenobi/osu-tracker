const mockClient = (Client, options) =>
  options.forEach(opt => {
    jest.spyOn(Client.prototype, opt.method).mockImplementation(opt.value);
  });

module.exports = mockClient;