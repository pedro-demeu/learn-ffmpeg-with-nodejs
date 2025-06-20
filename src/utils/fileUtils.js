const fs = require('fs');
const path = require('path');

/**
 * Utilitários para manipulação de arquivos
 */
class FileUtils {
  /**
   * Verifica se um diretório existe, senão cria
   * @param {string} dirPath - Caminho do diretório
   */
  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Verifica se um arquivo existe
   * @param {string} filePath - Caminho do arquivo
   * @returns {boolean} - Verdadeiro se o arquivo existir
   */
  fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  /**
   * Obtém o tamanho de um arquivo em bytes
   * @param {string} filePath - Caminho do arquivo
   * @returns {number} - Tamanho do arquivo em bytes
   */
  getFileSize(filePath) {
    if (!this.fileExists(filePath)) {
      return 0;
    }
    
    const stats = fs.statSync(filePath);
    return stats.size;
  }
}

module.exports = new FileUtils();
