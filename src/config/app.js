/**
 * Configurações da aplicação
 */
module.exports = {
  port: process.env.PORT || 3000,
  videoPath: "video.mkv",
  videoHevc: "video-hevc.mp4",
  outputPath: "./video-hevc.mp4",
  streamsDir: "./streams"
};
