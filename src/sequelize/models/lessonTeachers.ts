import { Model, Table, Column, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Lesson } from './lessons';
import { Teacher } from './teachers';

@Table({tableName: 'lesson_teachers',timestamps: false })
export class LessonTeachers extends Model<LessonTeachers> {

  @ForeignKey(() => Lesson)
  @Column({
    primaryKey: true,
    allowNull: false,
  })
  lesson_id!: number;

  @ForeignKey(() => Teacher)
  @Column({
    primaryKey: true,
    allowNull: false,
  })
  teacher_id!: number;

  @BelongsTo(() => Lesson)
  lesson?: Lesson;

  @BelongsTo(() => Teacher)
  teacher?: Teacher;
}
