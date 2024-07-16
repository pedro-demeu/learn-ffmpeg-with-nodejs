const express = require("express");
const cors = require("cors");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());

const videoPath = "video.mkv";
const videoHevc = "video-hevc.mp4";
const outputPath = "./video-hevc.mp4";

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});

app.use("/streams", express.static(__dirname + "/streams"));

app.get("/convert", (req, res) => {
  try {
    ffmpeg(videoPath)
      .output("output.mp4")
      .on("end", function () {
        console.log("Conversão concluída!");
        return res.sendStatus(200);
      })
      .on("error", function (err) {
        console.error("Erro durante a conversão:", err);
        return res.sendStatus(500);
      })
      .run();
  } catch (err) {
    console.error("Erro ao iniciar o FFmpeg:", err);
    return res.sendStatus(500);
  }
});
app.get("/metadata", (req, res) => {
  ffmpeg.ffprobe(videoPath, (err, metadata) => {
    if (err) {
      console.error("Erro ao obter metadados:", err);
      res.status(500).json({ error: "Erro ao obter metadados do vídeo" });
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

    // Enviando resposta JSON com os metadados compilados
    res.json(metadataResponse);
  });
});
app.get("/convert-to-hevc", (req, res) => {
  try {
    ffmpeg(videoPath)
      .videoCodec("libx265") // Codec H.265 (HEVC)
      .output(outputPath)
      .on("end", function () {
        console.log("Conversão para HEVC concluída!");
        res.sendStatus(200);
      })
      .on("error", function (err) {
        console.error("Erro durante a conversão:", err);
        res.status(500).json({ error: "Erro durante a conversão" });
      })
      .run();
  } catch (err) {
    console.error("Erro ao iniciar o FFmpeg:", err);
    res.status(500).json({ error: "Erro ao iniciar o FFmpeg" });
  }
});
app.get("/convert-mp4-to-m3u8", (req, res) => {
  try {
    ffmpeg(videoPath)
      .outputOptions([
        "-map 0:v:0", // Mapeia o primeiro vídeo do arquivo de entrada
        "-map 0:a:0", // Mapeia o primeiro áudio do arquivo de entrada
        "-c:v h264", // Usa o codec H.264 para vídeo
        "-c:a aac", // Usa o codec AAC para áudio
        "-f hls", // Formato de saída HLS
        "-hls_time 10", // Duração de cada segmento em segundos
        "-hls_list_size 0", // Quantidade de segmentos na playlist (0 para ilimitado)
      ])
      .output(`./streams/playlist.m3u8`)
      .on("end", function () {
        console.log("Conversão para HLS concluída!");
        res.status(200).sendFile("/streams/playlist.m3u8");
      })
      .on("error", function (err) {
        console.error("Erro durante a conversão para HLS:", err);
        res.status(500).json({ error: "Erro durante a conversão para HLS" });
      })
      .run();

    return res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao iniciar o FFmpeg para HLS:", err);
    res.status(500).json({ error: "Erro ao iniciar o FFmpeg para HLS" });
  }
});
app.get("/convert-mp4-hevc-to-m3u8", (req, res) => {
  try {
    ffmpeg(videoHevc)
      .outputOptions([
        "-map 0:v:0", // Mapeia o primeiro vídeo do arquivo de entrada
        "-map 0:a:0", // Mapeia o primeiro áudio do arquivo de entrada
        "-c:v hevc", // Usa o codec HEVC (H.265) para vídeo
        "-c:a aac", // Usa o codec AAC para áudio
        "-f hls", // Formato de saída HLS
        "-hls_time 10", // Duração de cada segmento em segundos
        "-hls_list_size 0", // Quantidade de segmentos na playlist (0 para ilimitado)
      ])
      .output(`./streams/hevc/playlist.m3u8`)
      .on("end", function () {
        console.log("Conversão para HLS concluída!");
        res.status(200).sendFile("/streams/hevc/playlist.m3u8");
      })
      .on("error", function (err) {
        console.error("Erro durante a conversão para HLS:", err);
        res.status(500).json({ error: "Erro durante a conversão para HLS" });
      })
      .run();
  } catch (err) {
    console.error("Erro ao iniciar o FFmpeg para HLS:", err);
    res.status(500).json({ error: "Erro ao iniciar o FFmpeg para HLS" });
  }
});
app.get('/convert-hevc-to-flv', (req, res) => {
  const videoHevc = 'video-hevc.mp4'; // Substitua pelo caminho do seu arquivo HEVC

  try {
    const outputDirectory = './streams/flv';
    const outputFile = 'output.flv';
    const outputFilePath = path.join(outputDirectory, outputFile);

    // Verifica se o diretório de saída existe, senão cria
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    ffmpeg(videoHevc)
      .outputOptions([
        '-c:v flv', // Define o codec de vídeo como FLV
        '-c:a mp3', // Define o codec de áudio como MP3 (opcional, ajuste conforme necessário)
      ])
      .output(outputFilePath)
      .on('end', function() {
        console.log('Conversão para FLV concluída:', outputFilePath);
        res.status(200).json({ outputFile: outputFilePath });
      })
      .on('error', function(err) {
        console.error('Erro durante a conversão para FLV:', err);
        res.status(500).json({ error: 'Erro durante a conversão para FLV' });
      })
      .run();
  } catch (err) {
    console.error('Erro ao iniciar o FFmpeg para FLV:', err);
    res.status(500).json({ error: 'Erro ao iniciar o FFmpeg para FLV' });
  }
});
app.get("/get-playlist", (req, res) => {
  try {
    res
      .status(200)
      .json({ playlist_url: `http://localhost:3000/streams/playlist.m3u8` });
  } catch (err) {
    console.error("Erro ao obter link da playlist:", err);
    res.status(500).json({ error: "Erro ao obter link da playlist" });
  }
});
