import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { LessonTeachers } from './lessonTeachers';

@Table({tableName: 'teachers', timestamps: false })
export class Teacher extends Model<Teacher> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
 declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @HasMany(() => LessonTeachers)
  lessons?: LessonTeachers[];
}

