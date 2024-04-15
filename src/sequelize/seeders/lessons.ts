import { Lesson } from '../models/lessons';
import sequelize from '../../instances/sequelize';
sequelize;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const titles = [
  'Brown Red Green Color',
  'Yellow White Blue Color',
  'Green Red Purple Color',
  'Orange Blue Yellow Color',
  'Black Green Red Color',
  'Purple Yellow White Color',
  'Pink Orange Blue Color',
  'Red Green Yellow Color',
  'Blue Orange Purple Color',
  'White Black Green Color',
  'Yellow Pink Blue Color',
  'Green Red Yellow Color',
  'Orange Blue White Color',
  'Black Green Purple Color',
  'Purple Orange Yellow Color',
  'Red Blue Green Color',
  'Blue Green Red Color',
  'Yellow White Black Color',
  'Pink Purple Orange Color',
  'Green Blue Yellow Color',
  'Orange Red White Color',
  'Black Yellow Purple Color',
  'Red Blue White Color',
  'White Orange Purple Color',
  'Blue Green Yellow Color',
  'Green Red Black Color',
  'Yellow Purple Blue Color',
  'White Pink Orange Color',
  'Red Black Green Color',
  'Purple Blue Yellow Color',
  'Blue Green Orange Color',
  'Yellow Black Red Color',
  'Green White Blue Color',
  'Orange Red Purple Color',
  'Black Yellow Green Color',
  'Red Blue Orange Color',
  'Blue Purple White Color',
  'Yellow Orange Black Color',
  'Green Red Blue Color',
  'White Purple Orange Color',
  'Blue Yellow Green Color',
  'Orange Black Red Color',
  'Yellow Green White Color',
  'Purple Blue Red Color',
  'Red White Black Color',
  'Green Orange Yellow Color',
  'Black Blue Purple Color',
  'Red Yellow Green Color',
  'Blue White Orange Color',
  'Yellow Purple Black Color',
  'Green Red Orange Color',
];

const getRandomTitle = () => {
  const randomIndex = getRandomInt(0, titles.length - 1);
  return titles[randomIndex];
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const seedLessons = async () => {
  const lessons = [];
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2023-12-31');
  for (let i = 0; i < 900000; i++) {
    const randomDate = getRandomDate(startDate, endDate);
    const randomTitle = getRandomTitle();
    const randomStatus = getRandomInt(0, 1); // Статус может быть 0 или 1
    lessons.push({
      date: formatDate(randomDate),
      title: randomTitle,
      status: randomStatus,
    });
  }
  const chunkSize = 50000;
  const totalLessons = lessons.length;
  const numChunks = Math.ceil(totalLessons / chunkSize);

  for (let i = 0; i < numChunks; i++) {
    const startIndex = i * chunkSize;
    const endIndex = Math.min(startIndex + chunkSize, totalLessons);
    const chunkLessons = lessons.slice(startIndex, endIndex);

    await Lesson.bulkCreate(chunkLessons);
    console.log(`Created lessons ${startIndex + 1} to ${endIndex}`);
  }
};

seedLessons()
  .then(() => console.log('Seed created successfully'))
  .catch((err) => console.error('Error occurred while creating seed:', err));
