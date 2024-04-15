
import sequelize from '../../instances/sequelize';
import { Student } from '../models/students';

sequelize

const generateStudentsSeed = async () => {
  try {
    const names = [
      'Aleksandr',
      'Andrey',
      'Anatoliy',
      'Artem',
      'Boris',
      'Daniil',
      'Dmitriy',
      'Evgeniy',
      'Fedor',
      'Gennadiy',
      'Grigoriy',
      'Igor',
      'Ivan',
      'Konstantin',
      'Leonid',
      'Maksim',
      'Mikhail',
      'Nikita',
      'Nikolay',
      'Oleg',
      'Pavel',
      'Petr',
      'Roman',
      'Sergey',
      'Stanislav',
      'Stepan',
      'Taras',
      'Timofey',
      'Valentin',
      'Vasiliy',
      'Viktor',
      'Vladimir',
      'Vladislav',
      'Yaroslav',
      'Yegor',
      'Aleksandra',
      'Anastasiya',
      'Anna',
      'Darya',
      'Ekaterina',
      'Elizaveta',
      'Galina',
      'Irina',
      'Lyudmila',
      'Maria',
      'Natalya',
      'Olga',
      'Svetlana',
      'Tatyana',
      'Yelena',
    ];
    const students = [];
    const totalStudents = 100000;

    for (let i = 1; i <= totalStudents; i++) {
      const student = {
        name: names[Math.floor(Math.random() * names.length)],
      };
      students.push(student);
    }

    // Вставка учителей в базу данных
    await Student.bulkCreate(students);

    console.log('Seed for students has been created successfully!');
  } catch (error) {
    console.error('Error occurred while creating seed for students:', error);
  }
};

generateStudentsSeed();
