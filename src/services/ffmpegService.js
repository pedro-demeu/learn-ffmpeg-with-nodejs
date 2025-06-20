const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require('path');
const config = require('../config/app');

/**
 * Serviço para operações com FFMPEG
 */
class FfmpegService {
  /**
   * Converte um vídeo para o formato MP4
   */
  convertToMp4() {
    return new Promise((resolve, reject) => {
      ffmpeg(config.videoPath)
        .output("output.mp4")
        .on("end", function () {
          console.log("Conversão concluída!");
          resolve();
        })
        .on("error", function (err) {
          console.error("Erro durante a conversão:", err);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Obtém os metadados de um vídeo
   */
  getMetadata() {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(config.videoPath, (err, metadata) => {
        if (err) {
          console.error("Erro ao obter metadados:", err);
          reject(err);
          return;
        }

        // Filtrando e compilando os dados mais importantes
        const videoStream = metadata.streams.find(
          (stream) => stream.codec_type === "video"
        );
        const audioStream = metadata.streams.find(
          (stream) => stream.codec_type === "audio"
        );

        // Construindo o objeto de resposta JSON com os dados relevantes
        const metadataResponse = {
          filename: metadata.format.filename,
          format_name: metadata.format.format_name,
          format_long_name: metadata.format.format_long_name,
          duration: metadata.format.duration,
          size: metadata.format.size,
          bit_rate: metadata.format.bit_rate,
          video_codec: {
            codec_name: videoStream.codec_name,
            codec_long_name: videoStream.codec_long_name,
            profile: videoStream.profile,
            width: videoStream.width,
            height: videoStream.height,
            display_aspect_ratio: videoStream.display_aspect_ratio,
            pix_fmt: videoStream.pix_fmt,
            level: videoStream.level,
            color_range: videoStream.color_range,
            color_space: videoStream.color_space,
            color_transfer: videoStream.color_transfer,
            color_primaries: videoStream.color_primaries,
          },
          audio_codec: {
            codec_name: audioStream.codec_name,
            codec_long_name: audioStream.codec_long_name,
            profile: audioStream.profile,
            sample_rate: audioStream.sample_rate,
            channels: audioStream.channels,
            channel_layout: audioStream.channel_layout,
          },
        };

        resolve(metadataResponse);
      });
    });
  }

  /**
   * Converte um vídeo para o formato HEVC
   */
  convertToHevc() {
    return new Promise((resolve, reject) => {
      ffmpeg(config.videoPath)
        .videoCodec("libx265") // Codec H.265 (HEVC)
        .output(config.outputPath)
        .on("end", function () {
          console.log("Conversão para HEVC concluída!");
          resolve();
        })
        .on("error", function (err) {
          console.error("Erro durante a conversão:", err);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Converte um vídeo MP4 para o formato M3U8 (HLS)
   */
  convertMp4ToM3u8() {
    return new Promise((resolve, reject) => {
      ffmpeg(config.videoPath)
        .outputOptions([
          "-map 0:v:0", // Mapeia o primeiro vídeo do arquivo de entrada
          "-map 0:a:0", // Mapeia o primeiro áudio do arquivo de entrada
          "-c:v h264", // Usa o codec H.264 para vídeo
          "-c:a aac", // Usa o codec AAC para áudio
          "-f hls", // Formato de saída HLS
          "-hls_time 10", // Duração de cada segmento em segundos
          "-hls_list_size 0", // Quantidade de segmentos na playlist (0 para ilimitado)
        ])
        .output(`${config.streamsDir}/playlist.m3u8`)
        .on("end", function () {
          console.log("Conversão para HLS concluída!");
          resolve(`${config.streamsDir}/playlist.m3u8`);
        })
        .on("error", function (err) {
          console.error("Erro durante a conversão para HLS:", err);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Converte um vídeo HEVC para o formato M3U8 (HLS)
   */
  convertHevcToM3u8() {
    return new Promise((resolve, reject) => {
      const outputDir = `${config.streamsDir}/hevc`;
      
      // Verifica se o diretório existe, senão cria
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      ffmpeg(config.videoHevc)
        .outputOptions([
          "-map 0:v:0", // Mapeia o primeiro vídeo do arquivo de entrada
          "-map 0:a:0", // Mapeia o primeiro áudio do arquivo de entrada
          "-c:v hevc", // Usa o codec HEVC (H.265) para vídeo
          "-c:a aac", // Usa o codec AAC para áudio
          "-f hls", // Formato de saída HLS
          "-hls_time 10", // Duração de cada segmento em segundos
          "-hls_list_size 0", // Quantidade de segmentos na playlist (0 para ilimitado)
        ])
        .output(`${outputDir}/playlist.m3u8`)
        .on("end", function () {
          console.log("Conversão para HLS concluída!");
          resolve(`${outputDir}/playlist.m3u8`);
        })
        .on("error", function (err) {
          console.error("Erro durante a conversão para HLS:", err);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Converte um vídeo HEVC para o formato FLV
   */
  convertHevcToFlv() {
    return new Promise((resolve, reject) => {
      const outputDirectory = `${config.streamsDir}/flv`;
      const outputFile = 'output.flv';
      const outputFilePath = path.join(outputDirectory, outputFile);

      // Verifica se o diretório de saída existe, senão cria
      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }

      ffmpeg(config.videoHevc)
        .outputOptions([
          '-c:v flv', // Define o codec de vídeo como FLV
          '-c:a mp3', // Define o codec de áudio como MP3
        ])
        .output(outputFilePath)
        .on('end', function() {
          console.log('Conversão para FLV concluída:', outputFilePath);
          resolve(outputFilePath);
        })
        .on('error', function(err) {
          console.error('Erro durante a conversão para FLV:', err);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Obtém a URL da playlist
   */
  getPlaylistUrl() {
    return `http://localhost:${config.port}/streams/playlist.m3u8`;
  }
}

module.exports = new FfmpegService();
