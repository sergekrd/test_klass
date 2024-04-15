import { Model, Table, Column, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { LessonStudents } from './lessonStudents';
import { LessonTeachers } from './lessonTeachers';
import { Teacher } from './teachers';

@Table({tableName: 'lessons', timestamps: false })
export class Lesson extends Model<Lesson> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  status!: number;

  @HasMany(() => LessonStudents)
  students?: LessonStudents[];

  @HasMany(() => LessonTeachers)
  teachers?: Teacher[];
}
