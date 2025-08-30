
// This file contains shared configuration variables for the application.

// In a real production application, you would manage this list of admins
// in your database and check a user's role instead of their email.
// For this prototype, we'll use a simple array of email addresses.
export const ADMIN_EMAILS = ['admin@axample.com', 'balenciaga-admin@example.com'];

// Predetermined admin credentials for simplified login
export const PREDETERMINED_ADMIN = {
    email: 'admin@axample.com',
    password: 'password',
    name: 'Fred Omondi'
};
