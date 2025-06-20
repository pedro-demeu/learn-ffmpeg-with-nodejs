const ffmpegService = require('../services/ffmpegService');

/**
 * Controller para operações com FFMPEG
 */
class FfmpegController {
  /**
   * Converte um vídeo para o formato MP4
   */
  async convertToMp4(req, res) {
    try {
      await ffmpegService.convertToMp4();
      return res.sendStatus(200);
    } catch (err) {
      console.error("Erro ao converter para MP4:", err);
      return res.status(500).json({ error: "Erro ao converter para MP4" });
    }
  }

  /**
   * Obtém os metadados de um vídeo
   */
  async getMetadata(req, res) {
    try {
      const metadata = await ffmpegService.getMetadata();
      res.json(metadata);
    } catch (err) {
      console.error("Erro ao obter metadados:", err);
      res.status(500).json({ error: "Erro ao obter metadados do vídeo" });
    }
  }

  /**
   * Converte um vídeo para o formato HEVC
   */
  async convertToHevc(req, res) {
    try {
      await ffmpegService.convertToHevc();
      res.sendStatus(200);
    } catch (err) {
      console.error("Erro ao converter para HEVC:", err);
      res.status(500).json({ error: "Erro durante a conversão para HEVC" });
    }
  }

  /**
   * Converte um vídeo MP4 para o formato M3U8 (HLS)
   */
  async convertMp4ToM3u8(req, res) {
    try {
      await ffmpegService.convertMp4ToM3u8();
      return res.sendStatus(200);
    } catch (err) {
      console.error("Erro ao converter para M3U8:", err);
      res.status(500).json({ error: "Erro durante a conversão para M3U8" });
    }
  }

  /**
   * Converte um vídeo HEVC para o formato M3U8 (HLS)
   */
  async convertHevcToM3u8(req, res) {
    try {
      await ffmpegService.convertHevcToM3u8();
      return res.sendStatus(200);
    } catch (err) {
      console.error("Erro ao converter HEVC para M3U8:", err);
      res.status(500).json({ error: "Erro durante a conversão de HEVC para M3U8" });
    }
  }

  /**
   * Converte um vídeo HEVC para o formato FLV
   */
  async convertHevcToFlv(req, res) {
    try {
      const outputFilePath = await ffmpegService.convertHevcToFlv();
      res.status(200).json({ outputFile: outputFilePath });
    } catch (err) {
      console.error("Erro ao converter HEVC para FLV:", err);
      res.status(500).json({ error: "Erro durante a conversão de HEVC para FLV" });
    }
  }

  /**
   * Obtém a URL da playlist
   */
  getPlaylist(req, res) {
    try {
      res.status(200).json({ playlist_url: ffmpegService.getPlaylistUrl() });
    } catch (err) {
      console.error("Erro ao obter link da playlist:", err);
      res.status(500).json({ error: "Erro ao obter link da playlist" });
    }
  }
}

module.exports = new FfmpegController();
