// Mock dos módulos
jest.mock('fluent-ffmpeg', () => require('../mocks/ffmpegMock'));
jest.mock('fs', () => require('../mocks/fsMock'));

const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const config = require('../../config/app');

// Importa o serviço que será testado
const ffmpegService = require('../../services/ffmpegService');

describe('FfmpegService', () => {
  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    // Reseta o estado dos mocks
    ffmpeg.ffprobe._simulateError = false;
  });

  describe('convertToMp4', () => {
    it('deve converter um vídeo para MP4 com sucesso', async () => {
      // Cria uma promise para o teste
      const promise = ffmpegService.convertToMp4();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula o sucesso da operação
      instance._triggerSuccess();
      
      // Aguarda a resolução da promise
      await promise;

      // Verifica se o ffmpeg foi chamado com os parâmetros corretos
      expect(ffmpeg).toHaveBeenCalledWith(config.videoPath);
      expect(instance.output).toHaveBeenCalledWith('output.mp4');
      expect(instance.on).toHaveBeenCalledWith('end', expect.any(Function));
      expect(instance.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(instance.run).toHaveBeenCalled();
    });

    it('deve rejeitar a promise quando ocorrer um erro na conversão', async () => {
      // Cria uma promise para o teste
      const promise = ffmpegService.convertToMp4();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula um erro
      const mockError = new Error('Erro na conversão');
      instance._triggerError(mockError);
      
      // Verifica se a promise é rejeitada com o erro correto
      await expect(promise).rejects.toEqual(mockError);
    });
  });

  describe('getMetadata', () => {
    it('deve obter os metadados do vídeo com sucesso', async () => {
      // Executa o método
      const metadata = await ffmpegService.getMetadata();

      // Verifica se o ffprobe foi chamado com os parâmetros corretos
      expect(ffmpeg.ffprobe).toHaveBeenCalledWith(config.videoPath, expect.any(Function));
      
      // Verifica se os metadados retornados estão corretos
      expect(metadata).toHaveProperty('filename', 'video.mkv');
      expect(metadata).toHaveProperty('format_name', 'matroska,webm');
      expect(metadata).toHaveProperty('video_codec.codec_name', 'h264');
      expect(metadata).toHaveProperty('audio_codec.codec_name', 'aac');
    });

    it('deve rejeitar a promise quando ocorrer um erro ao obter metadados', async () => {
      // Configura o mock para simular um erro
      ffmpeg.ffprobe._simulateError = true;

      // Verifica se a promise é rejeitada
      await expect(ffmpegService.getMetadata()).rejects.toThrow('Erro simulado no ffprobe');

      // Restaura o mock para o comportamento padrão
      ffmpeg.ffprobe._simulateError = false;
    });
  });

  describe('convertToHevc', () => {
    it('deve converter um vídeo para HEVC com sucesso', async () => {
      // Cria uma promise para o teste
      const promise = ffmpegService.convertToHevc();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula o sucesso da operação
      instance._triggerSuccess();
      
      // Aguarda a resolução da promise
      await promise;

      // Verifica se o ffmpeg foi chamado com os parâmetros corretos
      expect(ffmpeg).toHaveBeenCalledWith(config.videoPath);
      expect(instance.videoCodec).toHaveBeenCalledWith('libx265');
      expect(instance.output).toHaveBeenCalledWith(config.outputPath);
      expect(instance.on).toHaveBeenCalledWith('end', expect.any(Function));
      expect(instance.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(instance.run).toHaveBeenCalled();
    });

    it('deve rejeitar a promise quando ocorrer um erro na conversão para HEVC', async () => {
      // Cria uma promise para o teste
      const promise = ffmpegService.convertToHevc();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula um erro
      const mockError = new Error('Erro na conversão para HEVC');
      instance._triggerError(mockError);
      
      // Verifica se a promise é rejeitada com o erro correto
      await expect(promise).rejects.toEqual(mockError);
    });
  });

  describe('convertMp4ToM3u8', () => {
    it('deve converter um vídeo MP4 para M3U8 com sucesso', async () => {
      // Cria uma promise para o teste
      const promise = ffmpegService.convertMp4ToM3u8();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula o sucesso da operação
      instance._triggerSuccess();
      
      // Aguarda a resolução da promise
      await promise;

      // Verifica se o ffmpeg foi chamado com os parâmetros corretos
      expect(ffmpeg).toHaveBeenCalledWith(config.videoPath);
      expect(instance.outputOptions).toHaveBeenCalledWith(expect.arrayContaining([
        '-map 0:v:0',
        '-map 0:a:0',
        '-c:v h264',
        '-c:a aac',
        '-f hls',
        '-hls_time 10',
        '-hls_list_size 0'
      ]));
      expect(instance.output).toHaveBeenCalledWith(`${config.streamsDir}/playlist.m3u8`);
      expect(instance.on).toHaveBeenCalledWith('end', expect.any(Function));
      expect(instance.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(instance.run).toHaveBeenCalled();
    });

    it('deve rejeitar a promise quando ocorrer um erro na conversão para M3U8', async () => {
      // Cria uma promise para o teste
      const promise = ffmpegService.convertMp4ToM3u8();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula um erro
      const mockError = new Error('Erro na conversão para M3U8');
      instance._triggerError(mockError);
      
      // Verifica se a promise é rejeitada com o erro correto
      await expect(promise).rejects.toEqual(mockError);
    });
  });

  describe('convertHevcToM3u8', () => {
    it('deve converter um vídeo HEVC para M3U8 com sucesso', async () => {
      // Cria uma promise para o teste
      const promise = ffmpegService.convertHevcToM3u8();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula o sucesso da operação
      instance._triggerSuccess();
      
      // Aguarda a resolução da promise
      await promise;

      // Verifica se o diretório foi verificado/criado
      expect(fs.existsSync).toHaveBeenCalledWith(`${config.streamsDir}/hevc`);
      
      // Verifica se o ffmpeg foi chamado com os parâmetros corretos
      expect(ffmpeg).toHaveBeenCalledWith(config.videoHevc);
      expect(instance.outputOptions).toHaveBeenCalledWith(expect.arrayContaining([
        '-map 0:v:0',
        '-map 0:a:0',
        '-c:v hevc',
        '-c:a aac',
        '-f hls',
        '-hls_time 10',
        '-hls_list_size 0'
      ]));
      expect(instance.output).toHaveBeenCalledWith(`${config.streamsDir}/hevc/playlist.m3u8`);
      expect(instance.on).toHaveBeenCalledWith('end', expect.any(Function));
      expect(instance.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(instance.run).toHaveBeenCalled();
    });

    it('deve criar o diretório se ele não existir', async () => {
      // Configura o mock para simular que o diretório não existe
      fs.existsSync.mockReturnValueOnce(false);
      
      // Cria uma promise para o teste
      const promise = ffmpegService.convertHevcToM3u8();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula o sucesso da operação
      instance._triggerSuccess();
      
      // Aguarda a resolução da promise
      await promise;

      // Verifica se o diretório foi criado
      expect(fs.mkdirSync).toHaveBeenCalledWith(`${config.streamsDir}/hevc`, { recursive: true });
    });

    it('deve rejeitar a promise quando ocorrer um erro na conversão de HEVC para M3U8', async () => {
      // Cria uma promise para o teste
      const promise = ffmpegService.convertHevcToM3u8();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula um erro
      const mockError = new Error('Erro na conversão de HEVC para M3U8');
      instance._triggerError(mockError);
      
      // Verifica se a promise é rejeitada com o erro correto
      await expect(promise).rejects.toEqual(mockError);
    });
  });

  describe('convertHevcToFlv', () => {
    it('deve converter um vídeo HEVC para FLV com sucesso', async () => {
      // Cria uma promise para o teste
      const promise = ffmpegService.convertHevcToFlv();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula o sucesso da operação
      instance._triggerSuccess();
      
      // Aguarda a resolução da promise
      const result = await promise;

      // Verifica se o diretório foi verificado/criado
      expect(fs.existsSync).toHaveBeenCalledWith(`${config.streamsDir}/flv`);
      
      // Verifica se o ffmpeg foi chamado com os parâmetros corretos
      expect(ffmpeg).toHaveBeenCalledWith(config.videoHevc);
      expect(instance.outputOptions).toHaveBeenCalledWith(expect.arrayContaining([
        '-c:v flv',
        '-c:a mp3'
      ]));
      
      const expectedPath = path.join(`${config.streamsDir}/flv`, 'output.flv');
      expect(instance.output).toHaveBeenCalledWith(expectedPath);
      expect(instance.on).toHaveBeenCalledWith('end', expect.any(Function));
      expect(instance.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(instance.run).toHaveBeenCalled();
      
      // Verifica se o resultado é o caminho esperado
      expect(result).toBe(expectedPath);
    });

    it('deve criar o diretório se ele não existir', async () => {
      // Configura o mock para simular que o diretório não existe
      fs.existsSync.mockReturnValueOnce(false);
      
      // Cria uma promise para o teste
      const promise = ffmpegService.convertHevcToFlv();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula o sucesso da operação
      instance._triggerSuccess();
      
      // Aguarda a resolução da promise
      await promise;

      // Verifica se o diretório foi criado
      expect(fs.mkdirSync).toHaveBeenCalledWith(`${config.streamsDir}/flv`, { recursive: true });
    });

    it('deve rejeitar a promise quando ocorrer um erro na conversão de HEVC para FLV', async () => {
      // Cria uma promise para o teste
      const promise = ffmpegService.convertHevcToFlv();
      
      // Obtém a instância do mock
      const instance = ffmpeg.mock.results[0].value;
      
      // Simula um erro
      const mockError = new Error('Erro na conversão de HEVC para FLV');
      instance._triggerError(mockError);
      
      // Verifica se a promise é rejeitada com o erro correto
      await expect(promise).rejects.toEqual(mockError);
    });
  });

  describe('getPlaylistUrl', () => {
    it('deve retornar a URL da playlist corretamente', () => {
      // Executa o método
      const url = ffmpegService.getPlaylistUrl();

      // Verifica se a URL está correta
      expect(url).toBe(`http://localhost:${config.port}/streams/playlist.m3u8`);
    });
  });
});
