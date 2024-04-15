import { Op } from 'sequelize';
import { Lesson } from '../sequelize/models/lessons';
import { LessonStudents } from '../sequelize/models/lessonStudents';
import { Teacher } from '../sequelize/models/teachers';
import sequelize from '../instances/sequelize';

import { LessonTeachers } from '../sequelize/models/lessonTeachers';
import { Student } from '../sequelize/models/students';
import { Mapper } from '../interfaces/mapper';
import { CustomError } from '../common/errors/custom.error';

export class LessonsService {
  constructor() {}
  public async getLessons(dto: any): Promise<any> {
    try {
      const { date, status, teacherIds, studentsCount, page, lessonsPerPage } = dto;
      // валидация входящих данных
      const mapper: Mapper = {
        lessons: {
          ...(date != undefined ? this.dateParse(date) : null),
          ...(status != undefined ? this.statusParse(status) : null),
        },
        teachers: { ...(teacherIds != undefined ? this.teachersParse(teacherIds) : null) },
        ...(studentsCount != undefined ? { studentsCount: this.studentsCountParse(studentsCount) } : null),
        lessonIds: [],
        limit: lessonsPerPage | 10,
        page: page || 0,
      };
      let lessonTeachers;
      let lessonStudents;
      // с построение сложных запросов не сложилось
      // либо время обработки запроса увеличивалось в разы при разных входящих данных
      // либо выстраивалось большое количество кейсов, каждый со своими генерациями запросов
      // текущая реализация дает по одному запросу на каждую таблицу
      // с отсеиванием интересующих lesson_id в порядке увеличения размера таблиц

      // если есть фильтр teacherIds, оставляем для дальнейшего поиска только
      // lesson_id связанные с фильтром (сужаем поиск)
      if (teacherIds) {
        lessonTeachers = await this.findLessonsTeachers(mapper);
        mapper.lessonIds = Object.keys(lessonTeachers);
      }

      // если есть фильтр studentsCount, ищем либо по всем lesson_id,
      // либо среди отфильтрованных по предыдущему этапу
      // таблица LessonStudents имеет больше всего записей и это попытка сократить время обработки запроса
      // lesson_id связанные с фильтром (сужаем поиск)
      if (studentsCount) {
        lessonStudents = await this.studentsOnLesson(mapper);
        mapper.lessonIds = Object.keys(lessonStudents);
      }

      // если сработали предыдущие фильтры, ищем занятия среди отфильтрованных id
      // с параметрами фильтров + page и lessonsPerPage

      const lessons = await this.findLessons(mapper);
      mapper.lessonIds = lessons.map((lesson) => String(lesson.id));

      //если не было фильтра teacherIds, ищем учетелей, ведущих lessons
      if (!lessonTeachers) {
        lessonTeachers = await this.findLessonsTeachers(mapper);
      }

      //если не было фильтра studentsCount, ищем учеников, записанных на lessons
      if (!lessonStudents) {
        lessonStudents = await this.studentsOnLesson(mapper);
      }

      // по id учителей ищем и мэппим их данные
      const teachers = await this.findTeachers(lessonTeachers, mapper);

      // по id учеников ищем и мэппим их данные
      const students = await this.findStudents(lessonStudents, mapper);

      // собираем конечный объект
      const result = lessons.map((lesson) => {
        (lesson as any).visitCount = students[lesson.id] || 0;
        (lesson as any).students = students[lesson.id] || [];
        (lesson as any).teachers = teachers[lesson.id] || [];
        return lesson;
      });
      return { status_code: 200, data: result };
    } catch (error) {
      throw error;
    }
  }

  private async findLessons(mapper: Mapper) {
    const startTime = performance.now();
    const whereCondition = {
      ...(mapper.lessons ? mapper.lessons : {}),
      ...(mapper.lessonIds.length > 0 ? { id: { [Op.in]: mapper.lessonIds } } : null),
    };
    const result = await Lesson.findAll({
      ...(whereCondition ? { where: whereCondition } : {}),
      order: [['id', 'ASC']],
      raw: true,
      ...(mapper.limit !== undefined ? { limit: mapper.limit } : {}),
      ...(mapper.page !== undefined ? { offset: mapper.page * mapper.limit } : {}),
    });
    const endTime = performance.now();
    console.log('Lessons execution time: ', endTime - startTime, 'milliseconds');
    return result;
  }

  private async findLessonsTeachers(mapper: Mapper) {
    const startTime = performance.now();
    const whereCondition = {
      ...(Object.keys(mapper.teachers).length > 0 ? mapper.teachers : {}),
      ...(mapper.lessonIds.length > 0 ? { lesson_id: { [Op.in]: mapper.lessonIds } } : null),
    };
    const lessonTeachers = (await LessonTeachers.findAll({
      where: whereCondition,
      attributes: ['lesson_id', [sequelize.fn('array_agg', sequelize.col('teacher_id')), 'teachers']],
      group: ['lesson_id'],
      raw: true,
    })) as any;
    const resultTeachers = lessonTeachers.reduce((obj, lesson) => {
      obj[lesson.lesson_id] = lesson.teachers;
      return obj;
    }, {});
    const endTime = performance.now();
    console.log('LessonsWithTeachers execution time: ', endTime - startTime, 'milliseconds');
    return resultTeachers;
  }

  private async findTeachers(lessonTeacher, mapper) {
    const filteredLessonTeachers = Object.entries(lessonTeacher).filter(([key, value]) =>
      mapper.lessonIds.includes(key),
    ) as any;
    const teacherIds = [];
    for (const lesson of filteredLessonTeachers) teacherIds.push(...lesson[1]);
    const uniqTeacherId = [...new Set(teacherIds)];
    const startTime = performance.now();
    const teachers = await Teacher.findAll({
      where: { id: { [Op.in]: uniqTeacherId } },
      raw: true,
    });
    const endTime = performance.now();
    console.log('teachers execution time: ', endTime - startTime, 'milliseconds');
    return filteredLessonTeachers.reduce((obj, teacher) => {
      obj[Number(teacher[0])] = teacher[1].map((teacherId) => {
        return { id: teacherId, name: teachers.filter((value) => value.id === teacherId)[0].name };
      });
      return obj;
    }, {});
  }

  private async findStudents(lessonStudents, mapper) {
    const startTime = performance.now();
    const filteredLessonStudents = Object.entries(lessonStudents).filter(([key, value]) =>
      mapper.lessonIds.includes(key),
    ) as any;
    const studentsIds = [];
    for (const lesson of filteredLessonStudents)
      studentsIds.push(
        ...lesson[1].students.reduce((ids, student) => {
          ids.push(student.id);
          return ids;
        }, []),
      );
    const uniqStudentIds = [...new Set(studentsIds)];
    const students = await Student.findAll({
      where: { id: { [Op.in]: uniqStudentIds } },
      raw: true,
    });
    const endTime = performance.now();
    console.log('students execution time: ', endTime - startTime, 'milliseconds');
    return filteredLessonStudents.reduce((obj, student) => {
      obj[Number(student[0])] = {
        visitCount: student[1].visitCount,
        students: student[1].students.map((student) => {
          return {
            id: student.id,
            name: students.filter((value) => value.id === student.id)[0].name,
            visit: student.visit,
          };
        }),
      };
      return obj;
    }, {});
  }

  private async studentsOnLesson(mapper: Mapper) {
    const startTime = performance.now();
    const result = await LessonStudents.findAll({
      where: {
        ...(mapper.lessonIds.length > 0 ? { lesson_id: { [Op.in]: mapper.lessonIds } } : {}),
      },
      raw: true,
    });
    const endTime = performance.now();
    console.log('studentsOnLesson execution time: ', endTime - startTime, 'milliseconds');
    const mappedVisits = result.reduce((obj, lesson) => {
      const summ = lesson.visit ? 1 : 0;
      if (obj[lesson.lesson_id]) {
        obj[lesson.lesson_id].visitCount += summ;
        obj[lesson.lesson_id].students.push({ id: lesson.student_id, visit: lesson.visit });
      } else {
        obj[lesson.lesson_id] = { visitCount: summ, students: [{ id: lesson.student_id, visit: lesson.visit }] };
      }
      return obj;
    }, {});
    if (mapper.studentsCount) {
      return Object.fromEntries(
        Object.entries(mappedVisits).filter(([key, value]) => {
          if (mapper.studentsCount.length == 1) return (value as any).students.length === mapper.studentsCount[0];
          else {
            return (
              (value as any).students.length >= mapper.studentsCount[0] &&
              (value as any).students.length <= mapper.studentsCount[1]
            );
          }
        }),
      );
    }
    return mappedVisits;
  }

  private splitValues(value: string): string[] {
    return value.replace(' ', '').split(',');
  }

  private dateParse(value: string) {
    const regexDate = /\d{4}-\d{2}-\d{2}$/;
    const valuesArray = this.splitValues(value);
    const datesArray = valuesArray.map((val) => {
      if (!regexDate.test(val))
        throw new CustomError(400, `Неверный формат данных, date: ${val} должно быть датой в формате YYYY-MM-DD`);
      return new Date(val);
    });

    switch (datesArray.length) {
      case 1:
        return { date: datesArray[0] };
      case 2:
        return { date: { [Op.between]: datesArray } };
      default:
        throw new CustomError(
          400,
          `Неверный формат данных, date: ${value} должно содержать одну или две даты в формате YYYY-MM-DD`,
        );
    }
  }

  private statusParse(value: string) {
    const numberValue = Number(value);
    if (isNaN(numberValue)) throw new CustomError(400, `Неверный формат данных status: ${value} должно быть 1 или 0`);
    return { status: numberValue };
  }

  private teachersParse(value: string) {
    const valuesArray = this.splitValues(value);
    const valuesNumbersArray = valuesArray.map((val) => {
      const numberValue = Number(val);
      if (isNaN(numberValue)) {
        throw new CustomError(400, `Неверный формат данных teacherIds: ${val} должно быть числом`);
      }
      return numberValue;
    });
    return { teacher_id: { [Op.in]: valuesNumbersArray } };
  }

  private studentsCountParse(value: string) {
    const valuesArray = this.splitValues(value);
    const valuesNumbersArray = valuesArray.map((val) => {
      const numberValue = Number(val);
      if (isNaN(numberValue))
        throw new CustomError(400, `Неверный формат данных studentsCount: ${val} должно быть числом`);
      return numberValue;
    });
    if (valuesNumbersArray.length < 1 || valuesNumbersArray.length > 2)
      throw new CustomError(
        400,
        `Неверный формат данных, studentsCount: ${value} должно содержать одно или два числа (3 или 3,7)`,
      );
    return valuesNumbersArray;
  }
}