import sendResponse from '../common/send.response';
import { LessonsService } from '../services/lessons.service';
import { NextFunction, Request, Response } from 'express';

export class LessonController {
  public async getLessons(req: Request, res: Response, next: NextFunction) {
    const lessonsService = new LessonsService();
    try {
      // Вызываем сервис для получения занятий с учетом параметров фильтрации
      const lessons = await lessonsService.getLessons(req.body);

      // Возвращаем результат
      return sendResponse(res, lessons);
    } catch (error) {
      return next(error);
    }
  }
}
