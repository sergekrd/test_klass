import { Op } from 'sequelize';
import { Where } from 'sequelize/types/utils';

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
  studentsCountHaving: { having: Where } | { having: { [Op.and]: Where[] } };
  lessonIds: string[];
  limit: number;
  page: number;
}
