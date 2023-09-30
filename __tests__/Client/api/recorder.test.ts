import { Recorder } from '@/app/api/recorder';
import { expect } from '@jest/globals';

describe('Recorder', () => {
  let recorder: Recorder;

  let eventHandlers = {};

  beforeEach(() => {
    recorder = Recorder.getRecorder();
    Object.defineProperty(global, 'MediaRecorder', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        ondataavailable: jest.fn(),
        onerror: jest.fn(),
        state: '',
        stop: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        addEventListener: jest.fn((event, handler) => {
          eventHandlers[event] = handler;
        }),
        removeEventListener: jest.fn((event) => {
          delete eventHandlers[event];
        }),
      })),
    });

    Object.defineProperty(MediaRecorder, 'isTypeSupported', {
      writable: true,
      value: () => true,
    });
  });

  afterEach(() => {
    recorder.mediaStream = undefined;
    recorder.mediaRecorder = undefined;
    recorder.audioChunks = [];
  });

  it('should create an instance of Recorder', () => {
    expect(recorder).toBeInstanceOf(Recorder);
  });

  describe('initialize', () => {
    it('should initialize the media stream and media recorder', async () => {
      await initializeRecorder();

      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        audio: true,
      });
      expect(recorder['mediaStream']).toBeDefined();
      expect(recorder['mediaRecorder']).toBeDefined();
    });

    it('should handle misc errors when initializing', async () => {
      navigator.mediaDevices.getUserMedia = jest
        .fn()
        .mockRejectedValue(new Error('Test error'));

      await expect(recorder.initialize()).rejects.toThrowError(
        'Cannot access the microphone. Please ensure you have a working microphone and try again.',
      );
    });

    it('should handle mic denied error when initializing', async () => {
      const err = new Error('NotAllowedError');
      err.name = 'NotAllowedError';
      navigator.mediaDevices.getUserMedia = jest.fn().mockRejectedValue(err);

      await expect(recorder.initialize()).rejects.toThrowError(
        'Microphone access is denied. Please allow access to continue.',
      );
    });
  });

  describe('startRecording', () => {
    it('should start recording when media recorder is available', () => {
      recorder['mediaRecorder'] = {
        start: jest.fn(),
      } as unknown as MediaRecorder;

      recorder.startRecording();

      expect(recorder['mediaRecorder'].start).toHaveBeenCalled();
    });

    it('should not start recording when media recorder is unavailable', () => {
      expect(() => {
        recorder.startRecording();
      }).toThrow('Media Recorder is not initialized');
    });
  });

  describe('stopRecording', () => {
    it('should stop recording and return an audio blob', async () => {
      await initializeRecorder();
      recorder.startRecording();
      const testBlob = new Blob();

      recorder.audioChunks.push(testBlob);

      const stopPromise = recorder.stopRecording();

      if (eventHandlers.stop) {
        eventHandlers.stop();
      }

      // Spy on the 'stop' event
      const spy = jest.spyOn(recorder.mediaRecorder, 'stop');

      const result = await stopPromise;

      expect(result).toStrictEqual(testBlob);
      expect(spy).toHaveBeenCalled();
      expect(recorder.mediaRecorder.removeEventListener).toHaveBeenCalled();
    });

    it('should handle errors when stopping recording if recorder is not instantiated', async () => {
      expect(() => {
        recorder.stopRecording();
      }).toThrowError('Media Recorder is not initialized');
    });

    it('should throw an error when there is no audio', async () => {
      await initializeRecorder();
      expect(() => {
        recorder.stopRecording();
        if (eventHandlers.stop) {
          eventHandlers.stop();
        }
      }).toThrowError('No audio data recorded.');
    });
  });

  const initializeRecorder = async () => {
    navigator.mediaDevices.getUserMedia = jest
      .fn()
      .mockResolvedValue({} as MediaStream);

    await recorder.initialize();
  };
});
