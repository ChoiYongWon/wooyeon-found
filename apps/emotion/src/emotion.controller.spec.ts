import { Test, TestingModule } from '@nestjs/testing';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';

describe('EmotionController', () => {
  let emotionController: EmotionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EmotionController],
      providers: [EmotionService],
    }).compile();

    emotionController = app.get<EmotionController>(EmotionController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(emotionController.getHello()).toBe('Hello World!');
    });
  });
});
