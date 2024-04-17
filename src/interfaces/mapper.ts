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
  studentsCountHaving:
    {
        whereCondition: { having: Where };
        emptyFlag?: boolean;
        havingString?: string;
      }
    | { whereCondition: { having: { [Op.and]: Where[] } }; emptyFlag?: boolean; havingString?: string };
  lessonIds: string[];
  limit: number;
  page: number;
}
