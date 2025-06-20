// Mock do serviço
jest.mock('../../services/ffmpegService');

const ffmpegService = require('../../services/ffmpegService');
const ffmpegController = require('../../controllers/ffmpegController');

describe('FfmpegController', () => {
  // Mock para o objeto de resposta (res)
  let res;
  
  // Mock para o objeto de requisição (req)
  const req = {};

  // Configura os mocks antes de cada teste
  beforeEach(() => {
    // Limpa todos os mocks
    jest.clearAllMocks();
    
    // Configura o mock do objeto de resposta
    res = {
      sendStatus: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('convertToMp4', () => {
    it('deve retornar status 200 quando a conversão for bem-sucedida', async () => {
      // Configura o mock do serviço para resolver a promise
      ffmpegService.convertToMp4.mockResolvedValue();

      // Executa o método do controller
      await ffmpegController.convertToMp4(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.convertToMp4).toHaveBeenCalled();
      
      // Verifica se a resposta foi enviada corretamente
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('deve retornar status 500 quando ocorrer um erro na conversão', async () => {
      // Configura o mock do serviço para rejeitar a promise
      const error = new Error('Erro na conversão');
      ffmpegService.convertToMp4.mockRejectedValue(error);

      // Executa o método do controller
      await ffmpegController.convertToMp4(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.convertToMp4).toHaveBeenCalled();
      
      // Verifica se a resposta de erro foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao converter para MP4' });
    });
  });

  describe('getMetadata', () => {
    it('deve retornar os metadados quando a operação for bem-sucedida', async () => {
      // Mock dos metadados retornados pelo serviço
      const mockMetadata = {
        filename: 'video.mkv',
        format_name: 'matroska,webm',
        video_codec: { codec_name: 'h264' },
        audio_codec: { codec_name: 'aac' }
      };
      
      // Configura o mock do serviço para resolver a promise com os metadados
      ffmpegService.getMetadata.mockResolvedValue(mockMetadata);

      // Executa o método do controller
      await ffmpegController.getMetadata(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.getMetadata).toHaveBeenCalled();
      
      // Verifica se a resposta foi enviada corretamente
      expect(res.json).toHaveBeenCalledWith(mockMetadata);
    });

    it('deve retornar status 500 quando ocorrer um erro ao obter metadados', async () => {
      // Configura o mock do serviço para rejeitar a promise
      const error = new Error('Erro ao obter metadados');
      ffmpegService.getMetadata.mockRejectedValue(error);

      // Executa o método do controller
      await ffmpegController.getMetadata(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.getMetadata).toHaveBeenCalled();
      
      // Verifica se a resposta de erro foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao obter metadados do vídeo' });
    });
  });

  describe('convertToHevc', () => {
    it('deve retornar status 200 quando a conversão for bem-sucedida', async () => {
      // Configura o mock do serviço para resolver a promise
      ffmpegService.convertToHevc.mockResolvedValue();

      // Executa o método do controller
      await ffmpegController.convertToHevc(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.convertToHevc).toHaveBeenCalled();
      
      // Verifica se a resposta foi enviada corretamente
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('deve retornar status 500 quando ocorrer um erro na conversão para HEVC', async () => {
      // Configura o mock do serviço para rejeitar a promise
      const error = new Error('Erro na conversão para HEVC');
      ffmpegService.convertToHevc.mockRejectedValue(error);

      // Executa o método do controller
      await ffmpegController.convertToHevc(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.convertToHevc).toHaveBeenCalled();
      
      // Verifica se a resposta de erro foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro durante a conversão para HEVC' });
    });
  });

  describe('convertMp4ToM3u8', () => {
    it('deve retornar status 200 quando a conversão for bem-sucedida', async () => {
      // Configura o mock do serviço para resolver a promise
      ffmpegService.convertMp4ToM3u8.mockResolvedValue('./streams/playlist.m3u8');

      // Executa o método do controller
      await ffmpegController.convertMp4ToM3u8(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.convertMp4ToM3u8).toHaveBeenCalled();
      
      // Verifica se a resposta foi enviada corretamente
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('deve retornar status 500 quando ocorrer um erro na conversão para M3U8', async () => {
      // Configura o mock do serviço para rejeitar a promise
      const error = new Error('Erro na conversão para M3U8');
      ffmpegService.convertMp4ToM3u8.mockRejectedValue(error);

      // Executa o método do controller
      await ffmpegController.convertMp4ToM3u8(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.convertMp4ToM3u8).toHaveBeenCalled();
      
      // Verifica se a resposta de erro foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro durante a conversão para M3U8' });
    });
  });

  describe('convertHevcToM3u8', () => {
    it('deve retornar status 200 quando a conversão for bem-sucedida', async () => {
      // Configura o mock do serviço para resolver a promise
      ffmpegService.convertHevcToM3u8.mockResolvedValue('./streams/hevc/playlist.m3u8');

      // Executa o método do controller
      await ffmpegController.convertHevcToM3u8(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.convertHevcToM3u8).toHaveBeenCalled();
      
      // Verifica se a resposta foi enviada corretamente
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it('deve retornar status 500 quando ocorrer um erro na conversão de HEVC para M3U8', async () => {
      // Configura o mock do serviço para rejeitar a promise
      const error = new Error('Erro na conversão de HEVC para M3U8');
      ffmpegService.convertHevcToM3u8.mockRejectedValue(error);

      // Executa o método do controller
      await ffmpegController.convertHevcToM3u8(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.convertHevcToM3u8).toHaveBeenCalled();
      
      // Verifica se a resposta de erro foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro durante a conversão de HEVC para M3U8' });
    });
  });

  describe('convertHevcToFlv', () => {
    it('deve retornar o caminho do arquivo quando a conversão for bem-sucedida', async () => {
      // Mock do caminho do arquivo retornado pelo serviço
      const outputFilePath = './streams/flv/output.flv';
      
      // Configura o mock do serviço para resolver a promise com o caminho do arquivo
      ffmpegService.convertHevcToFlv.mockResolvedValue(outputFilePath);

      // Executa o método do controller
      await ffmpegController.convertHevcToFlv(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.convertHevcToFlv).toHaveBeenCalled();
      
      // Verifica se a resposta foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ outputFile: outputFilePath });
    });

    it('deve retornar status 500 quando ocorrer um erro na conversão de HEVC para FLV', async () => {
      // Configura o mock do serviço para rejeitar a promise
      const error = new Error('Erro na conversão de HEVC para FLV');
      ffmpegService.convertHevcToFlv.mockRejectedValue(error);

      // Executa o método do controller
      await ffmpegController.convertHevcToFlv(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.convertHevcToFlv).toHaveBeenCalled();
      
      // Verifica se a resposta de erro foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro durante a conversão de HEVC para FLV' });
    });
  });

  describe('getPlaylist', () => {
    it('deve retornar a URL da playlist', () => {
      // Mock da URL da playlist retornada pelo serviço
      const playlistUrl = 'http://localhost:3000/streams/playlist.m3u8';
      
      // Configura o mock do serviço para retornar a URL da playlist
      ffmpegService.getPlaylistUrl.mockReturnValue(playlistUrl);

      // Executa o método do controller
      ffmpegController.getPlaylist(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.getPlaylistUrl).toHaveBeenCalled();
      
      // Verifica se a resposta foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ playlist_url: playlistUrl });
    });

    it('deve retornar status 500 quando ocorrer um erro ao obter a URL da playlist', () => {
      // Configura o mock do serviço para lançar um erro
      ffmpegService.getPlaylistUrl.mockImplementation(() => {
        throw new Error('Erro ao obter URL da playlist');
      });

      // Executa o método do controller
      ffmpegController.getPlaylist(req, res);

      // Verifica se o serviço foi chamado
      expect(ffmpegService.getPlaylistUrl).toHaveBeenCalled();
      
      // Verifica se a resposta de erro foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao obter link da playlist' });
    });
  });
});
