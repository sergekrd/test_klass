import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { Lesson } from '../models/lessons';
import { LessonStudents } from '../models/lessonStudents';
import { LessonTeachers } from '../models/lessonTeachers';
import { Student } from '../models/students';
import { Teacher } from '../models/teachers';

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

const generateTeachersSeed = async () => {
  try {
    const names = [
      'Alice',
      'Bob',
      'Charlie',
      'David',
      'Eva',
      'Frank',
      'Grace',
      'Henry',
      'Ivy',
      'Jack',
      'Kate',
      'Liam',
      'Mia',
      'Noah',
      'Olivia',
      'Peter',
      'Quinn',
      'Rachel',
      'Sam',
      'Tina',
    ];
    const teachers = [];
    const totalTeachers = 1000;

    // Генерация 1000 учителей
    for (let i = 1; i <= totalTeachers; i++) {
      const teacher = {
        name: names[Math.floor(Math.random() * names.length)],
      };
      teachers.push(teacher);
    }

    // Вставка учителей в базу данных
    await Teacher.bulkCreate(teachers);

    console.log('Seed for teachers has been created successfully!');
  } catch (error) {
    console.error('Error occurred while creating seed for teachers:', error);
  }
};

generateTeachersSeed();
