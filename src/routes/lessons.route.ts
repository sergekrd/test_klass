import * as express from 'express';
import {  LessonController } from '../contollers/lessons.controller';
import { errorHandler } from '../middleware/error.middleware';


const lessonsRouter = express.Router();
const lessonController = new LessonController();

// Маршрут для получения занятий
lessonsRouter.get('/lessons', lessonController.getLessons.bind(lessonController));

//Обработка ошибок
lessonsRouter.use(errorHandler);

export default lessonsRouter;
