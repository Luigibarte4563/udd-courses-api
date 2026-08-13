const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'data');
const data = JSON.parse(fs.readFileSync(path.join(root, 'courses.json'), 'utf8'));

const schoolsDir = path.join(root, 'schools');
const coursesDir = path.join(root, 'courses');

fs.rmSync(schoolsDir, { recursive: true, force: true });
fs.rmSync(coursesDir, { recursive: true, force: true });
fs.mkdirSync(schoolsDir, { recursive: true });
fs.mkdirSync(coursesDir, { recursive: true });

let schoolFiles = 0;
let courseFiles = 0;

for (const school of data.schools) {
  const schoolDoc = {
    id: school.id,
    name: school.name,
    code: school.code,
    courses: school.courses,
  };
  fs.writeFileSync(path.join(schoolsDir, `${school.id}.json`), JSON.stringify(schoolDoc, null, 2) + '\n');
  schoolFiles++;

  for (const course of school.courses) {
    const courseDoc = {
      id: course.id,
      name: course.name,
      degree: course.degree,
    };
    if (course.major) courseDoc.major = course.major;
    if (course.specialization) courseDoc.specialization = course.specialization;
    courseDoc.school = {
      id: school.id,
      name: school.name,
      code: school.code,
    };
    fs.writeFileSync(path.join(coursesDir, `${course.id}.json`), JSON.stringify(courseDoc, null, 2) + '\n');
    courseFiles++;
  }
}

console.log(`schools: ${schoolFiles} files`);
console.log(`courses: ${courseFiles} files`);
