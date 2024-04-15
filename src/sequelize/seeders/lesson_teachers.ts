import { Lesson } from '../models/lessons';
import sequelize from '../../instances/sequelize';
import { Teacher } from '../models/teachers';
import { LessonTeachers } from '../models/lessonTeachers';
sequelize;

const createRandomLessonTeachers = async () => {
  let offset = 0;
  const limit = 10000;
console.log("started")
  let lessons = await Lesson.findAll({ offset, limit });
  console.log("lessons got")
  const teachers = await Teacher.findAll();
  while (lessons.length > 0) {
    const lessonTeachersData = [];
    for (const lesson of lessons) {
      const numRecords = Math.floor(Math.random() * 2) +1;

      for (let i = 0; i < numRecords; i++) {
        const randomTeacher = teachers[Math.floor(Math.random() * teachers.length)];


        lessonTeachersData.push({
          lesson_id: lesson.id,
          teacher_id: randomTeacher.id,
        });
      }
    }
    console.log(`LessonTeachers data ready to be created: ${lessonTeachersData.length}`);

    await LessonTeachers.bulkCreate(lessonTeachersData);

    console.log(`LessonTeachers created`);
    offset += limit;
    lessons = await Lesson.findAll({ offset, limit });
    console.log(`LessonTeachers created offse: ${offset}, limit:${limit}`);
  }

  console.log('Random LessonTeachers created successfully.');
};

createRandomLessonTeachers();
