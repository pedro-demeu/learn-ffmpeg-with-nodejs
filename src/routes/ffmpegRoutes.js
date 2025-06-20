const express = require('express');
const router = express.Router();
const ffmpegController = require('../controllers/ffmpegController');

// Rotas para operações com FFMPEG
router.get('/convert', ffmpegController.convertToMp4);
router.get('/metadata', ffmpegController.getMetadata);
router.get('/convert-to-hevc', ffmpegController.convertToHevc);
router.get('/convert-mp4-to-m3u8', ffmpegController.convertMp4ToM3u8);
router.get('/convert-mp4-hevc-to-m3u8', ffmpegController.convertHevcToM3u8);
router.get('/convert-hevc-to-flv', ffmpegController.convertHevcToFlv);
router.get('/get-playlist', ffmpegController.getPlaylist);

module.exports = router;
