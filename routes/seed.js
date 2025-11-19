// Seed endpoint - call via browser to populate database
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

router.get('/seed-now', async (req, res) => {
  try {
    console.log('API: Starting database seed...');
    
    // Initialize database (creates tables)
    db.initialize();

    // Wait for tables to be created
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create users with password hashing
    const users = [
      { full_name: 'Admin User', email: 'admin@hostel.com', password: 'admin123', role: 'superadmin' },
      { full_name: 'Warden', email: 'warden@hostel.com', password: 'warden123', role: 'warden' },
      { full_name: 'Accountant', email: 'accountant@hostel.com', password: 'acc123', role: 'accountant' },
      { full_name: 'Caretaker', email: 'caretaker@hostel.com', password: 'care123', role: 'caretaker' },
      { full_name: 'John Student', email: 'john@student.com', password: 'pass123', role: 'student' },
      { full_name: 'Jane Student', email: 'jane@student.com', password: 'pass123', role: 'student' },
      { full_name: 'Bob Student', email: 'bob@student.com', password: 'pass123', role: 'student' }
    ];

    const createdUsers = [];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const result = await db.run(
        'INSERT OR IGNORE INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
        [user.email, hashedPassword, user.full_name, user.role]
      );
      if (result.changes > 0) {
        createdUsers.push({ email: user.email, role: user.role });
        console.log(`✓ Created user: ${user.full_name} (${user.role})`);
      }
    }
    
    console.log('✅ Database seeded successfully!');
    
    res.json({
      success: true,
      message: 'Database seeded successfully!',
      usersCreated: createdUsers
    });
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

