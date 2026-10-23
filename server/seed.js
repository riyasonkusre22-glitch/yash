require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Models
const Course = require('./models/Course');
const Achiever = require('./models/Achiever');
const Testimonial = require('./models/Testimonial');
const QuizQuestion = require('./models/QuizQuestion');
const Enrollment = require('./models/Enrollment');
const Inquiry = require('./models/Inquiry');
const QuizAttempt = require('./models/QuizAttempt');

const coursesData = [
  {
    category: 'school',
    title: 'Secondary Foundation',
    subtitle: 'Class 8th, 9th & 10th',
    badge: 'State & CBSE Board',
    headerClass: 'course-header-school',
    baseFee: 35000,
    order: 1,
    subjects: [
      'Mathematics',
      'Science (Phy/Chem/Bio)',
      'English Literature & Lang',
      'Social Studies',
      'Sanskrit / Hindi'
    ],
    features: [
      'Rigorous Board Exam-focused Prep',
      'NTSE & Olympiad Orientation',
      'Weekly Chapter-wise Mock Tests',
      'Special Doubt Sessions Before Finals'
    ]
  },
  {
    category: 'science',
    title: 'XI & XII Science Board',
    subtitle: 'PCM & PCB Streams',
    badge: 'State & CBSE',
    headerClass: 'course-header-science',
    baseFee: 50000,
    order: 2,
    subjects: [
      'Physics with Lab Concepts',
      'Chemistry (Organic & Physical)',
      'Advanced Mathematics',
      'Biology (Botany & Zoology)',
      'Computer Science (Opt)'
    ],
    features: [
      'Practical & Viva Exam Preparation',
      'Chapter-wise Board Pattern Papers',
      'Formula Sheets & Concept Mind Maps',
      'Regular Parent-Faculty Performance Sync'
    ]
  },
  {
    category: 'competitive',
    title: 'JEE Main & NEET Prep',
    subtitle: 'Integrated 2-Year Batch',
    badge: 'Entrance Special',
    headerClass: 'course-header-competitive',
    baseFee: 85000,
    order: 3,
    subjects: [
      'Daily Practice Problem (DPP) Sets',
      'Full All-India Mock Test Series',
      'Rank Analytics & Speed Drills',
      'Shortcut Formulas & Elimination Tricks',
      'Previous 15 Years Solved Papers'
    ],
    features: [
      'Top Tier National Exam Faculty',
      'Micro-level Error Analysis Reports',
      'Personal Mentor for Time Management',
      'Special Doubt-Solving Labs open till 8 PM'
    ]
  }
];

const achieversData = [
  {
    name: 'Yash Agarwal',
    initials: 'YA',
    achievement: '98.6% - 10th CBSE',
    batch: 'Batch of 2025',
    quote: 'The systematic test series and personal guidance from teachers at Yash Tutorials made the board exams feel effortless!',
    bgColor: '#c7d2fe',
    textColor: '#3730a3',
    badgeVariant: 'badge-amber',
    order: 1
  },
  {
    name: 'Sneha Patil',
    initials: 'SP',
    achievement: 'AIR 412 - NEET',
    batch: 'Batch of 2025',
    quote: 'Biology & Chemistry notes provided by Yash Sir were spot on for NEET prep. Highly recommended to every serious aspirant.',
    bgColor: '#a7f3d0',
    textColor: '#065f46',
    badgeVariant: 'badge-emerald',
    order: 2
  },
  {
    name: 'Rohan Kulkarni',
    initials: 'RK',
    achievement: '97.8% - 12th Science',
    batch: 'Batch of 2025',
    quote: 'Focus on numericals, step-by-step derivational proofs, and one-on-one doubt sessions helped me score 99 in Physics and Math.',
    bgColor: '#c7d2fe',
    textColor: '#3730a3',
    badgeVariant: 'badge-brand',
    order: 3
  },
  {
    name: 'Ananya Mehta',
    initials: 'AM',
    achievement: '99.2 Percentile - JEE',
    batch: 'Batch of 2025',
    quote: 'The small batch size ensured that my weak concepts were caught early, analyzed methodically, and thoroughly corrected.',
    bgColor: '#ddd6fe',
    textColor: '#5b21b6',
    badgeVariant: 'badge-purple',
    order: 4
  }
];

const testimonialsData = [
  {
    author: 'Mr. Rajesh Sharma',
    role: 'Parent of Class 10th Student (CBSE)',
    rating: 5,
    quote: 'Yash Tutorials transformed my son\'s attitude towards Science and Math. The faculty is approachable, disciplined, and conducts regular parent-teacher meetings.',
    order: 1
  },
  {
    author: 'Pooja Deshmukh',
    role: 'Class 12 Science Student (State Board)',
    rating: 5,
    quote: 'The small batch size made sure I never felt left behind in Mathematics. Solved last 10 years papers during batch revision which boosted my board confidence.',
    order: 2
  },
  {
    author: 'Dr. Sunita Verma',
    role: 'Parent of NEET Candidate',
    rating: 5,
    quote: 'Best coaching institute in the area! Disciplined environment, excellent test series, and constant motivation from experienced educators.',
    order: 3
  }
];

const quizQuestionsData = [
  {
    question: 'What is the unit of Electric Current in the SI system?',
    category: 'Class 10 - Physics',
    options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
    correct: 1,
    explanation: 'Ampere (A) is the SI base unit of electric current, named after André-Marie Ampère.',
    order: 1
  },
  {
    question: "Which organelle is known as the 'Powerhouse of the Cell'?",
    category: 'Class 9 - Biology',
    options: ['Ribosome', 'Golgi Apparatus', 'Mitochondria', 'Nucleus'],
    correct: 2,
    explanation: 'Mitochondria generate most of the chemical energy needed to power the cell biochemical reactions (stored as ATP).',
    order: 2
  },
  {
    question: 'If pH of an aqueous solution is 2, the solution is:',
    category: 'Class 10 - Chemistry',
    options: ['Strongly Acidic', 'Weakly Basic', 'Neutral', 'Strongly Basic'],
    correct: 0,
    explanation: 'A pH below 7 is acidic. Solutions with pH 0-3 are strongly acidic (like stomach acid or dilute HCl).',
    order: 3
  },
  {
    question: 'What is the value of acceleration due to gravity (g) on the Earth surface?',
    category: 'Class 9 - Physics',
    options: ['9.8 m/s²', '8.9 m/s²', '10.5 m/s²', '6.67 m/s²'],
    correct: 0,
    explanation: 'The standard acceleration due to gravity at Earth sea level is approximately 9.8 m/s².',
    order: 4
  }
];

const seedEnrollments = [
  {
    studentName: 'Aarav Gupta',
    phone: '9823012345',
    course: 'Class 10th Board Booster',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    studentName: 'Kavya Nair',
    phone: '9845098765',
    course: 'NEET UG Preparation',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    studentName: 'Devansh Joshi',
    phone: '9890123456',
    course: 'JEE Main & Advanced',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

const seedInquiries = [
  {
    studentName: 'Tanvi Shinde',
    parentPhone: '9871234560',
    classPreference: 'Class 11th - 12th (Science PCM / PCB)',
    preferredTime: 'Morning Batch (07:00 AM - 10:00 AM)',
    message: 'Interested in demo class for XI Science (PCM) with JEE foundation batch.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    studentName: 'Aditya Rao',
    parentPhone: '9819876543',
    classPreference: 'Class 8th - 10th (Secondary Foundation)',
    preferredTime: 'Evening Batch (04:00 PM - 08:00 PM)',
    message: 'Would like to know the fee installment schedule and timing for Class 9 CBSE.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

const seedQuizAttempts = [
  {
    score: 3,
    totalQuestions: 3,
    answers: [
      { questionIndex: 0, selectedAnswer: 1, isCorrect: true },
      { questionIndex: 1, selectedAnswer: 2, isCorrect: true },
      { questionIndex: 2, selectedAnswer: 0, isCorrect: true }
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  },
  {
    score: 2,
    totalQuestions: 3,
    answers: [
      { questionIndex: 0, selectedAnswer: 1, isCorrect: true },
      { questionIndex: 1, selectedAnswer: 0, isCorrect: false },
      { questionIndex: 2, selectedAnswer: 0, isCorrect: true }
    ],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
];

async function seedDatabase() {
  console.log('🔄 Connecting to MongoDB Atlas...');
  await connectDB();

  console.log('🧹 Migrating collections...');
  await Course.deleteMany({});
  await Achiever.deleteMany({});
  await Testimonial.deleteMany({});
  await QuizQuestion.deleteMany({});

  console.log('🌱 Seeding Courses...');
  const insertedCourses = await Course.insertMany(coursesData);
  console.log(`   ✔ Seeded ${insertedCourses.length} Courses`);

  console.log('🌱 Seeding Achievers...');
  const insertedAchievers = await Achiever.insertMany(achieversData);
  console.log(`   ✔ Seeded ${insertedAchievers.length} Achievers`);

  console.log('🌱 Seeding Testimonials...');
  const insertedTestimonials = await Testimonial.insertMany(testimonialsData);
  console.log(`   ✔ Seeded ${insertedTestimonials.length} Testimonials`);

  console.log('🌱 Seeding Quiz Questions...');
  const insertedQuestions = await QuizQuestion.insertMany(quizQuestionsData);
  console.log(`   ✔ Seeded ${insertedQuestions.length} Quiz Questions`);

  // Only seed sample inquiries/enrollments if none exist
  const enrollCount = await Enrollment.countDocuments();
  if (enrollCount === 0) {
    console.log('🌱 Seeding initial Demo Enrollments...');
    await Enrollment.insertMany(seedEnrollments);
    console.log(`   ✔ Seeded ${seedEnrollments.length} Enrollments`);
  } else {
    console.log(`   ℹ Existing ${enrollCount} Enrollments preserved.`);
  }

  const inqCount = await Inquiry.countDocuments();
  if (inqCount === 0) {
    console.log('🌱 Seeding initial Inquiries...');
    await Inquiry.insertMany(seedInquiries);
    console.log(`   ✔ Seeded ${seedInquiries.length} Inquiries`);
  } else {
    console.log(`   ℹ Existing ${inqCount} Inquiries preserved.`);
  }

  const attemptCount = await QuizAttempt.countDocuments();
  if (attemptCount === 0) {
    console.log('🌱 Seeding initial Quiz Attempts...');
    await QuizAttempt.insertMany(seedQuizAttempts);
    console.log(`   ✔ Seeded ${seedQuizAttempts.length} Quiz Attempts`);
  }

  console.log('\n✨ Database migration and seeding completed successfully!');
  await mongoose.connection.close();
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
