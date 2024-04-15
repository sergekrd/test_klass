import { Op } from 'sequelize';

export interface Mapper {
  lessons?: {
    date?: Date | { [Op.between]: Date[] };
    status?: number;
    id?: {
      [Op.in]: number[];
    };
  };
  teachers?: {
    teacher_id?: { [Op.in]: number[] };
    lesson_id?: {
      [Op.in]: number[];
    };
  };
  studentsCount: number[];
  lessonIds: string[];
  limit: number;
  page: number;
}
