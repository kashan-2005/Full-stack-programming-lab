const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGO_URI;

    // Fallback to in-memory database if we want a self-contained setup or if connection fails
    if (!dbUrl || dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')) {
      console.log('Starting In-Memory MongoDB Server...');
      mongod = await MongoMemoryServer.create();
      dbUrl = mongod.getUri();
      console.log(`In-Memory MongoDB started at: ${dbUrl}`);
    }

    const conn = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed if database is empty
    await autoSeed();

  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

const autoSeed = async () => {
  try {
    const User = require('../models/User');
    const Doctor = require('../models/Doctor');
    const Patient = require('../models/Patient');

    const adminExists = await User.findOne({ email: 'admin@medicare.com' });
    if (!adminExists) {
      console.log('Database empty. Running auto-seeding...');
      
      // Admin
      await User.create({
        name: 'Admin User',
        email: 'admin@medicare.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '0300-0000000'
      });
      console.log('Seeded Admin: admin@medicare.com / Admin@123');

      // Doctors
      const doctorsData = [
        { name: 'Dr. Ahmed Khan', email: 'ahmed.khan@medicare.com', specialization: 'Cardiology', department: 'Cardiology', phone: '0300-1111001', experience: 15, consultationFee: 2000, qualifications: ['MBBS', 'FCPS Cardiology'], bio: 'Expert cardiologist with 15 years of experience.' },
        { name: 'Dr. Sara Ali', email: 'sara.ali@medicare.com', specialization: 'Neurology', department: 'Neurology', phone: '0300-1111002', experience: 12, consultationFee: 2500, qualifications: ['MBBS', 'MRCP Neurology'], bio: 'Specialist in neurological disorders.' },
        { name: 'Dr. Usman Tariq', email: 'usman.tariq@medicare.com', specialization: 'Orthopedics', department: 'Orthopedics', phone: '0300-1111003', experience: 10, consultationFee: 1800, qualifications: ['MBBS', 'MS Orthopedics'], bio: 'Bone and joint specialist.' },
        { name: 'Dr. Fatima Malik', email: 'fatima.malik@medicare.com', specialization: 'Dermatology', department: 'Dermatology', phone: '0300-1111004', experience: 8, consultationFee: 1500, qualifications: ['MBBS', 'MCPS Dermatology'], bio: 'Skin and hair specialist.' },
        { name: 'Dr. Bilal Chaudhry', email: 'bilal.chaudhry@medicare.com', specialization: 'Pediatrics', department: 'Pediatrics', phone: '0300-1111005', experience: 11, consultationFee: 1200, qualifications: ['MBBS', 'DCH', 'FCPS Pediatrics'], bio: 'Dedicated children health expert.' },
        { name: 'Dr. Nadia Hussain', email: 'nadia.hussain@medicare.com', specialization: 'Gynecology', department: 'Gynecology', phone: '0300-1111006', experience: 14, consultationFee: 2200, qualifications: ['MBBS', 'FCPS Gynae'], bio: 'Women health and maternity specialist.' },
        { name: 'Dr. Imran Sheikh', email: 'imran.sheikh@medicare.com', specialization: 'Psychiatry', department: 'Psychiatry', phone: '0300-1111007', experience: 9, consultationFee: 2000, qualifications: ['MBBS', 'MCPS Psychiatry'], bio: 'Mental health and behavioral therapy expert.' },
        { name: 'Dr. Rabia Iqbal', email: 'rabia.iqbal@medicare.com', specialization: 'Endocrinology', department: 'Internal Medicine', phone: '0300-1111008', experience: 7, consultationFee: 1700, qualifications: ['MBBS', 'MRCP'], bio: 'Diabetes and hormonal disorder specialist.' },
        { name: 'Dr. Kamran Baig', email: 'kamran.baig@medicare.com', specialization: 'Gastroenterology', department: 'Gastroenterology', phone: '0300-1111009', experience: 13, consultationFee: 2300, qualifications: ['MBBS', 'FCPS Gastro'], bio: 'Digestive system diseases specialist.' },
        { name: 'Dr. Sadia Rehman', email: 'sadia.rehman@medicare.com', specialization: 'Ophthalmology', department: 'Ophthalmology', phone: '0300-1111010', experience: 10, consultationFee: 1600, qualifications: ['MBBS', 'FCPS Ophthalmology'], bio: 'Eye care and vision specialist.' },
        { name: 'Dr. Asad Mehmood', email: 'asad.mehmood@medicare.com', specialization: 'ENT', department: 'ENT', phone: '0300-1111011', experience: 8, consultationFee: 1400, qualifications: ['MBBS', 'DLO', 'FCPS ENT'], bio: 'Ear, nose and throat specialist.' },
        { name: 'Dr. Hina Zafar', email: 'hina.zafar@medicare.com', specialization: 'Radiology', department: 'Radiology', phone: '0300-1111012', experience: 6, consultationFee: 1500, qualifications: ['MBBS', 'DMRD'], bio: 'Diagnostic imaging expert.' },
        { name: 'Dr. Omer Farooq', email: 'omer.farooq@medicare.com', specialization: 'Surgery', department: 'Surgery', phone: '0300-1111013', experience: 18, consultationFee: 3000, qualifications: ['MBBS', 'FRCS'], bio: 'Senior general and laparoscopic surgeon.' },
        { name: 'Dr. Madiha Siddiqui', email: 'madiha.siddiqui@medicare.com', specialization: 'Pulmonology', department: 'Pulmonology', phone: '0300-1111014', experience: 9, consultationFee: 1800, qualifications: ['MBBS', 'FCPS Pulmonology'], bio: 'Lung diseases and respiratory specialist.' },
        { name: 'Dr. Zahid Anwar', email: 'zahid.anwar@medicare.com', specialization: 'Nephrology', department: 'Nephrology', phone: '0300-1111015', experience: 12, consultationFee: 2100, qualifications: ['MBBS', 'FCPS Nephrology'], bio: 'Kidney disease and dialysis specialist.' },
      ];

      for (const d of doctorsData) {
        const u = await User.create({ name: d.name, email: d.email, password: 'Doctor@123', role: 'doctor', phone: d.phone });
        await Doctor.create({ ...d, user: u._id });
      }
      console.log(`Seeded ${doctorsData.length} doctors.`);

      // Patients
      const patientsData = [
        { name: 'Ali Hassan', email: 'ali.hassan@patient.com', phone: '0311-2221001', gender: 'male', dateOfBirth: new Date('1990-05-15'), bloodGroup: 'A+', address: 'House 12, Block A, Lahore', allergies: ['Penicillin'] },
        { name: 'Zara Ahmed', email: 'zara.ahmed@patient.com', phone: '0311-2221002', gender: 'female', dateOfBirth: new Date('1995-08-22'), bloodGroup: 'B+', address: 'Flat 5, F-10, Islamabad', allergies: [] },
        { name: 'Hassan Raza', email: 'hassan.raza@patient.com', phone: '0311-2221003', gender: 'male', dateOfBirth: new Date('1985-03-10'), bloodGroup: 'O+', address: 'Plot 45, Clifton, Karachi', allergies: ['Aspirin'] },
        { name: 'Ayesha Nawaz', email: 'ayesha.nawaz@patient.com', phone: '0311-2221004', gender: 'female', dateOfBirth: new Date('1998-11-30'), bloodGroup: 'AB+', address: 'Street 7, Gulberg, Lahore', allergies: [] },
        { name: 'Tariq Jamil', email: 'tariq.jamil@patient.com', phone: '0311-2221005', gender: 'male', dateOfBirth: new Date('1978-07-25'), bloodGroup: 'A-', address: 'Sector G-9, Islamabad', allergies: ['Sulfa drugs'] },
        { name: 'Sana Malik', email: 'sana.malik@patient.com', phone: '0311-2221006', gender: 'female', dateOfBirth: new Date('1992-02-14'), bloodGroup: 'B-', address: 'DHA Phase 5, Karachi', allergies: [] },
        { name: 'Umar Farhan', email: 'umar.farhan@patient.com', phone: '0311-2221007', gender: 'male', dateOfBirth: new Date('1988-09-19'), bloodGroup: 'O-', address: 'Model Town, Lahore', allergies: ['Ibuprofen'] },
        { name: 'Maryam Saeed', email: 'maryam.saeed@patient.com', phone: '0311-2221008', gender: 'female', dateOfBirth: new Date('2001-12-05'), bloodGroup: 'A+', address: 'E-7, Islamabad', allergies: [] },
        { name: 'Faisal Qureshi', email: 'faisal.qureshi@patient.com', phone: '0311-2221009', gender: 'male', dateOfBirth: new Date('1975-04-28'), bloodGroup: 'AB-', address: 'North Nazimabad, Karachi', allergies: [] },
        { name: 'Noor Fatima', email: 'noor.fatima@patient.com', phone: '0311-2221010', gender: 'female', dateOfBirth: new Date('1997-06-17'), bloodGroup: 'B+', address: 'Johar Town, Lahore', allergies: ['Latex'] },
        { name: 'Rashid Mehmood', email: 'rashid.mehmood@patient.com', phone: '0311-2221011', gender: 'male', dateOfBirth: new Date('1982-01-09'), bloodGroup: 'O+', address: 'F-8, Islamabad', allergies: [] },
        { name: 'Hira Baig', email: 'hira.baig@patient.com', phone: '0311-2221012', gender: 'female', dateOfBirth: new Date('2000-10-23'), bloodGroup: 'A+', address: 'PECHS, Karachi', allergies: ['Codeine'] },
        { name: 'Imtiaz Khan', email: 'imtiaz.khan@patient.com', phone: '0311-2221013', gender: 'male', dateOfBirth: new Date('1969-08-11'), bloodGroup: 'B+', address: 'Wapda Town, Lahore', allergies: [] },
        { name: 'Sumaya Idrees', email: 'sumaya.idrees@patient.com', phone: '0311-2221014', gender: 'female', dateOfBirth: new Date('1993-03-27'), bloodGroup: 'O+', address: 'G-11, Islamabad', allergies: [] },
        { name: 'Naveed Akhtar', email: 'naveed.akhtar@patient.com', phone: '0311-2221015', gender: 'male', dateOfBirth: new Date('1980-05-02'), bloodGroup: 'AB+', address: 'Gulshan-e-Iqbal, Karachi', allergies: ['Morphine'] },
      ];

      for (const p of patientsData) {
        const u = await User.create({ name: p.name, email: p.email, password: 'Patient@123', role: 'patient', phone: p.phone });
        await Patient.create({ ...p, user: u._id });
      }
      console.log(`Seeded ${patientsData.length} patients.`);
      console.log('Seeding done successfully!');
    }
  } catch (err) {
    console.error('Auto seeding failed:', err.message);
  }
};

module.exports = connectDB;
