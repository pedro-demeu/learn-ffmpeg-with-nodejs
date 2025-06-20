/**
 * Mock para o módulo fs
 */
const fsMock = {
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  statSync: jest.fn().mockReturnValue({
    size: 1048576 // 1MB em bytes
  })
};

module.exports = fsMock;
