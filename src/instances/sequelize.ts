import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { Lesson } from '../sequelize/models/lessons';
import { LessonStudents } from '../sequelize/models/lessonStudents';
import { LessonTeachers } from '../sequelize/models/lessonTeachers';
import { Student } from '../sequelize/models/students';
import { Teacher } from '../sequelize/models/teachers';

dotenv.config();

const database = process.env.POSTGRES_DB;
const username = process.env.POSTGRES_USER;
const password = process.env.POSTGRESS_PASSWORD;
const host = process.env.POSTGRES_HOST;
const port = Number(process.env.POSTGRES_PORT);

const sequelize = new Sequelize({
  dialect: 'postgres',
  host,
  username,
  password,
  port,
  database,
  logging: false,
  models: [Student, Teacher, Lesson, LessonStudents, LessonTeachers],
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
export default sequelize;
