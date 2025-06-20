/**
 * Mock para o módulo fluent-ffmpeg
 */

// Cria uma classe para o mock do ffmpeg
class FfmpegMock {
  constructor() {
    this.videoCodec = jest.fn().mockReturnThis();
    this.output = jest.fn().mockReturnThis();
    this.outputOptions = jest.fn().mockReturnThis();
    this.on = jest.fn((event, callback) => {
      if (event === 'end') {
        this._endCallback = callback;
      } else if (event === 'error') {
        this._errorCallback = callback;
      }
      return this;
    });
    this.run = jest.fn(() => {
      return this;
    });
    
    this._simulateError = false;
    this._error = null;
  }
  
  // Método para simular um erro
  _triggerError(err) {
    if (this._errorCallback) {
      this._errorCallback(err || new Error('Erro simulado'));
    }
  }
  
  // Método para simular sucesso
  _triggerSuccess() {
    if (this._endCallback) {
      this._endCallback();
    }
  }
}

// Mock para o método ffprobe
const ffprobeMock = jest.fn((path, callback) => {
  if (ffprobeMock._simulateError) {
    callback(new Error('Erro simulado no ffprobe'), null);
    return;
  }

  // Retorna metadados simulados
  const mockMetadata = {
    format: {
      filename: 'video.mkv',
      format_name: 'matroska,webm',
      format_long_name: 'Matroska / WebM',
      duration: '60.000000',
      size: '1048576',
      bit_rate: '1500000',
    },
    streams: [
      {
        codec_type: 'video',
        codec_name: 'h264',
        codec_long_name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
        profile: 'High',
        width: 1920,
        height: 1080,
        display_aspect_ratio: '16:9',
        pix_fmt: 'yuv420p',
        level: 41,
        color_range: 'tv',
        color_space: 'bt709',
        color_transfer: 'bt709',
        color_primaries: 'bt709',
      },
      {
        codec_type: 'audio',
        codec_name: 'aac',
        codec_long_name: 'AAC (Advanced Audio Coding)',
        profile: 'LC',
        sample_rate: '48000',
        channels: 2,
        channel_layout: 'stereo',
      }
    ]
  };

  callback(null, mockMetadata);
});

// Propriedades auxiliares para controlar o comportamento do mock
ffprobeMock._simulateError = false;

// Função principal que retorna o mock do ffmpeg
const ffmpegMainMock = jest.fn(() => {
  return new FfmpegMock();
});

ffmpegMainMock.ffprobe = ffprobeMock;

module.exports = ffmpegMainMock;
