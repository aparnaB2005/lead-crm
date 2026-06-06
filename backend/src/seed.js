require('dotenv').config();
const mongoose = require('mongoose');
const Lead = require('../src/models/Lead');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lead-crm';

const sampleLeads = [
  { name: 'Priya Sharma', email: 'priya.sharma@techcorp.in', phone: '+91 98765 43210', company: 'TechCorp India', status: 'Converted', notes: 'Signed contract for enterprise plan. Very happy with onboarding.', source: 'Referral', value: 45000 },
  { name: 'Rahul Mehta', email: 'rahul.m@startupx.com', phone: '+91 91234 56789', company: 'StartupX', status: 'Qualified', notes: 'Interested in Team plan. Need demo call next week.', source: 'Website', value: 12000 },
  { name: 'Anjali Patel', email: 'anjali@designstudio.co', phone: '+91 99887 76655', company: 'Design Studio Co', status: 'Contacted', notes: 'Reached out via email. Waiting for response.', source: 'Cold Call', value: 8000 },
  { name: 'Vikram Singh', email: 'vikram.singh@enterprise.com', phone: '+91 88776 55443', company: 'Enterprise Solutions Ltd', status: 'New', notes: 'Downloaded whitepaper from website.', source: 'Website', value: 60000 },
  { name: 'Neha Gupta', email: 'neha@cloudventures.io', phone: '+91 77665 44332', company: 'Cloud Ventures', status: 'Lost', notes: 'Went with competitor. Price was the main concern.', source: 'Email', value: 0 },
  { name: 'Arjun Reddy', email: 'arjun.r@fintech.in', phone: '+91 90123 45678', company: 'FinTech India', status: 'Qualified', notes: 'Very interested. Budget approved. Final decision pending.', source: 'Social Media', value: 25000 },
  { name: 'Divya Nair', email: 'divya@healthcare.org', phone: '+91 98654 32109', company: 'HealthCare Plus', status: 'Contacted', notes: 'Had intro call. Scheduled product demo for next Tuesday.', source: 'Referral', value: 18000 },
  { name: 'Karan Malhotra', email: 'karan.m@retail.com', phone: '+91 87654 32198', company: 'Retail Giants Inc', status: 'New', notes: 'Signed up for free trial.', source: 'Website', value: 30000 },
  { name: 'Sana Khan', email: 'sana.khan@logistics.net', phone: '+91 76543 21987', company: 'Quick Logistics', status: 'Converted', notes: 'Upgraded from Basic to Pro plan. Excellent ROI reported.', source: 'Email', value: 22000 },
  { name: 'Rohan Joshi', email: 'rohan.j@edutech.com', phone: '+91 65432 10987', company: 'EduTech Solutions', status: 'New', notes: 'Attended webinar. Expressed interest in free consultation.', source: 'Social Media', value: 5000 },
  { name: 'Meera Iyer', email: 'meera@manufacturing.co.in', phone: '+91 54321 09876', company: 'Iyer Manufacturing', status: 'Qualified', notes: 'Has specific compliance requirements. Custom proposal sent.', source: 'Cold Call', value: 75000 },
  { name: 'Aditya Kumar', email: 'aditya@realestate.in', phone: '+91 43210 98765', company: 'Prime Real Estate', status: 'Lost', notes: 'Budget constraints. Revisit in Q3.', source: 'Website', value: 0 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    await Lead.deleteMany({});
    console.log('Cleared existing leads');
    const leads = await Lead.insertMany(sampleLeads);
    console.log(`✅ Seeded ${leads.length} sample leads`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
