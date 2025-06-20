// Mock do módulo fs
jest.mock('fs');

const fs = require('fs');
const fileUtils = require('../../utils/fileUtils');

describe('FileUtils', () => {
  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ensureDirectoryExists', () => {
    it('deve criar o diretório se ele não existir', () => {
      // Configura o mock para simular que o diretório não existe
      fs.existsSync.mockReturnValue(false);

      // Executa o método
      fileUtils.ensureDirectoryExists('/path/to/directory');

      // Verifica se o método existsSync foi chamado com o caminho correto
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/directory');
      
      // Verifica se o método mkdirSync foi chamado com os parâmetros corretos
      expect(fs.mkdirSync).toHaveBeenCalledWith('/path/to/directory', { recursive: true });
    });

    it('não deve criar o diretório se ele já existir', () => {
      // Configura o mock para simular que o diretório já existe
      fs.existsSync.mockReturnValue(true);

      // Executa o método
      fileUtils.ensureDirectoryExists('/path/to/directory');

      // Verifica se o método existsSync foi chamado com o caminho correto
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/directory');
      
      // Verifica se o método mkdirSync não foi chamado
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('fileExists', () => {
    it('deve retornar true se o arquivo existir', () => {
      // Configura o mock para simular que o arquivo existe
      fs.existsSync.mockReturnValue(true);

      // Executa o método
      const result = fileUtils.fileExists('/path/to/file.txt');

      // Verifica se o método existsSync foi chamado com o caminho correto
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/file.txt');
      
      // Verifica se o resultado é true
      expect(result).toBe(true);
    });

    it('deve retornar false se o arquivo não existir', () => {
      // Configura o mock para simular que o arquivo não existe
      fs.existsSync.mockReturnValue(false);

      // Executa o método
      const result = fileUtils.fileExists('/path/to/file.txt');

      // Verifica se o método existsSync foi chamado com o caminho correto
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/file.txt');
      
      // Verifica se o resultado é false
      expect(result).toBe(false);
    });
  });

  describe('getFileSize', () => {
    it('deve retornar o tamanho do arquivo em bytes', () => {
      // Configura o mock para simular que o arquivo existe
      fs.existsSync.mockReturnValue(true);
      
      // Configura o mock para retornar um tamanho de arquivo simulado
      fs.statSync.mockReturnValue({ size: 1024 });

      // Executa o método
      const size = fileUtils.getFileSize('/path/to/file.txt');

      // Verifica se o método existsSync foi chamado com o caminho correto
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/file.txt');
      
      // Verifica se o método statSync foi chamado com o caminho correto
      expect(fs.statSync).toHaveBeenCalledWith('/path/to/file.txt');
      
      // Verifica se o tamanho retornado está correto
      expect(size).toBe(1024);
    });

    it('deve retornar 0 se o arquivo não existir', () => {
      // Configura o mock para simular que o arquivo não existe
      fs.existsSync.mockReturnValue(false);

      // Executa o método
      const size = fileUtils.getFileSize('/path/to/file.txt');

      // Verifica se o método existsSync foi chamado com o caminho correto
      expect(fs.existsSync).toHaveBeenCalledWith('/path/to/file.txt');
      
      // Verifica se o método statSync não foi chamado
      expect(fs.statSync).not.toHaveBeenCalled();
      
      // Verifica se o tamanho retornado é 0
      expect(size).toBe(0);
    });
  });
});
