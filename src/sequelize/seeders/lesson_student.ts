import { Lesson } from '../models/lessons';
import sequelize from '../../instances/sequelize';
import { Student } from '../models/students';
import { LessonStudents } from '../models/lessonStudents';
sequelize;

const createRandomLessonStudents = async () => {
  let offset = 300000;
  const limit = 10000;
console.log("started")
  let lessons = await Lesson.findAll({ offset, limit });
  console.log("lessons got")
  while (lessons.length > 0) {
    const students = await Student.findAll();
    const lessonStudentsData = [];

    for (const lesson of lessons) {
      const numRecords = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < numRecords; i++) {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        const randomVisit = Math.random() < 0.5;

        lessonStudentsData.push({
          lesson_id: lesson.id,
          student_id: randomStudent.id,
          visit: randomVisit,
        });
      }
    }
    console.log(`LessonStudents data ready to be created: ${lessonStudentsData.length}`);

    await LessonStudents.bulkCreate(lessonStudentsData);

    console.log(`LessonStudents created`);
    offset += limit;
    lessons = await Lesson.findAll({ offset, limit });
    console.log(`LessonStudents created offse: ${offset}, limit:${limit}`);
  }

  console.log('Random LessonStudents created successfully.');
};

// Вызываем функцию для создания случайных записей LessonStudents
createRandomLessonStudents();
