import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { LessonStudents } from './lessonStudents';

@Table({tableName: 'students', timestamps: false })
export class Student extends Model<Student> {

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

  @HasMany(() => LessonStudents)
  lessons?: LessonStudents[];
}

