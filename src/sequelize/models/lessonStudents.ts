import { Model, Table, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Lesson } from './lessons';
import { Student } from './students';

@Table({ tableName: 'lesson_students', timestamps: false })
export class LessonStudents extends Model<LessonStudents> {
  @ForeignKey(() => Lesson)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  lesson_id!: number;

  @ForeignKey(() => Student)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  student_id!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  visit!: boolean;

  @BelongsTo(() => Lesson)
  lesson?: Lesson;

  @BelongsTo(() => Student)
  student?: Student;
}
