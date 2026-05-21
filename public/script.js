﻿// Mobile menu toggle for admin/dentist dashboard
function toggleMobileMenu() {
    const sidebar = document.getElementById('adminSidebar');
    const adminPage = document.getElementById('adminPage') || document.getElementById('dentistPage');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if (adminPage) {
            adminPage.classList.toggle('menu-open');
        }
    }
}

// Close mobile menu when a navigation link is clicked or overlay is clicked
document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.admin-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            const sidebar = document.getElementById('adminSidebar');
            const adminPage = document.getElementById('adminPage') || document.getElementById('dentistPage');
            if (sidebar) {
                sidebar.classList.remove('open');
                if (adminPage) {
                    adminPage.classList.remove('menu-open');
                }
            }
        });
    });

    // Close menu when overlay is clicked
    const adminPage = document.getElementById('adminPage') || document.getElementById('dentistPage');
    if (adminPage) {
        adminPage.addEventListener('click', function(e) {
            if (e.target === adminPage && adminPage.classList.contains('menu-open')) {
                toggleMobileMenu();
            }
        });
    }

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('adminSidebar');
            const adminPage = document.getElementById('adminPage') || document.getElementById('dentistPage');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                if (adminPage) {
                    adminPage.classList.remove('menu-open');
                }
            }
        }
    });
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
console.log('DOM Content Loaded - Initializing app...');
const currentPath = window.location.pathname.toLowerCase();
if (currentPath.includes('admin.html') || currentPath.includes('dentist.html')) {
console.log('Skipping main page initialization on admin/dentist page.');
return;
}
initializeApp();
setupEventListeners();
setMinimumDate();
console.log('App initialization complete');
});

// EmailJS configuration for real verification emails
const EMAILJS_SERVICE_ID = 'service_3123t8i';
const EMAILJS_TEMPLATE_ID = 'template_rtig9ab';
const EMAILJS_PUBLIC_KEY = 'KnDgbWCdBCoyBYUSE';
// Use the default EmailJS verification template for booking notifications unless you configure a dedicated booking template.
const EMAILJS_BOOKING_TEMPLATE_ID = EMAILJS_TEMPLATE_ID;

// Optional Twilio credentials for SMS (set these only if you accept storing secrets in the client)
const TWILIO_ACCOUNT_SID = '';
const TWILIO_AUTH_TOKEN = '';
const TWILIO_FROM_NUMBER = ''; // e.g. +1234567890
const TWILIO_PROXY_URL = ''; // Example: 'https://your-server.com/api/sms' (recommended)

function initializeEmailJS() {
if (window.emailjs && EMAILJS_PUBLIC_KEY && !EMAILJS_PUBLIC_KEY.startsWith('your_')) {
emailjs.init(EMAILJS_PUBLIC_KEY);
}
}

function isEmailJSConfigured() {
return window.emailjs &&
EMAILJS_SERVICE_ID && !EMAILJS_SERVICE_ID.startsWith('your_') &&
EMAILJS_TEMPLATE_ID && !EMAILJS_TEMPLATE_ID.startsWith('your_') &&
EMAILJS_PUBLIC_KEY && !EMAILJS_PUBLIC_KEY.startsWith('your_');
}

const serviceDentistAssignments = {
'Braces': 'Dr. Estes',
'Cleaning': 'Dr. Estes',
'Root Canal': 'Dr. Lee',
'Cavity Filling': 'Dr. Lee',
'Oral Health': 'Dr. Strange',
'Extraction': 'Dr. Lim',
'Dentures': 'Dr. Rafaela',
'Crown': 'Dr. Rafaela',
'Gum Treatment': 'Dr. Alvin',
'General Checkup': 'Dr. Estes',
'Teeth Whitening': 'Dr. Estes'
};

const dentistAvailability = {
'Dr. Estes': ['monday', 'thursday'],
'Dr. Lee': ['wednesday', 'saturday'],
'Dr. Strange': ['tuesday', 'wednesday'],
'Dr. Lim': ['tuesday', 'friday'],
'Dr. Rafaela': ['monday', 'sunday'],
'Dr. Alvin': ['thursday', 'saturday']
};

let calendarToday = new Date();

// Utility: escape HTML to avoid injection in rendered content
function escapeHtml(str) {
if (!str && str !== 0) return '';
return String(str)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#39;');
}

// Format a service string (comma-separated) into HTML list or plain text
function formatServiceHTML(service) {
if (!service) return '';
// If already an array-like string separated by comma, split
const parts = String(service).split(/\s*,\s*/).filter(Boolean);
if (parts.length <= 1) return escapeHtml(service);
return `<ul class="service-list">${parts.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ul>`;
}
let calendarMonth = calendarToday.getMonth();
let calendarYear = calendarToday.getFullYear();

// Last notification results for the most recent booking
let _lastConfirmationResults = null;

function assignDentistForService() {
const appointmentDateInput = document.getElementById('appointmentDate');
const dentistSelect = document.getElementById('dentist');
if (!dentistSelect) return;

const appointmentDate = appointmentDateInput ? appointmentDateInput.value : '';
const selectedDay = appointmentDate ? new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() : null;

const dentistOptions = dentistSelect.querySelectorAll('option');
dentistOptions.forEach(option => {
if (!option.value) return;
const availability = dentistAvailability[option.value];
if (selectedDay && availability && availability.includes(selectedDay)) {
option.disabled = false;
} else if (option.value) {
option.disabled = selectedDay ? true : false;
}
});

if (selectedDay) {
const selectedOption = dentistSelect.selectedOptions[0];
if (!selectedOption || selectedOption.disabled) {
dentistSelect.value = '';
}
}

dentistSelect.disabled = false;
dentistSelect.classList.remove('assigned');
}

function testEmailJS() {
const testEmail = prompt('Enter your email to test EmailJS:');
if (!testEmail) return;

console.log('Testing EmailJS with:', testEmail);
if (!isEmailJSConfigured()) {
console.error('EmailJS not configured properly');
return;
}


emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
to_email: testEmail,
to_name: 'Test User',
verification_code: '123456'
}).then(response => {
console.log('EmailJS test successful:', response);
alert('Test email sent! Check your inbox.');
}).catch(error => {
console.error('EmailJS test failed:', error);
alert('Test failed. Check console for details.');
});
}

function sendVerificationEmail(email, code, name) {
console.log('Checking EmailJS configuration...');
console.log('window.emailjs:', window.emailjs);
console.log('EMAILJS_SERVICE_ID:', EMAILJS_SERVICE_ID);
console.log('EMAILJS_TEMPLATE_ID:', EMAILJS_TEMPLATE_ID);
console.log('EMAILJS_PUBLIC_KEY:', EMAILJS_PUBLIC_KEY);

if (!isEmailJSConfigured()) {
console.warn('EmailJS not configured. Verification email cannot be sent from the browser.');
return Promise.resolve(false);
}

console.log('Sending verification email to:', email, 'with code:', code);
return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
to_email: email,
to_name: name || '',
verification_code: code,
passcode: code,
user_name: name || '',
user_email: email
}).then(response => {
console.log(`Verification email sent to ${email}`);
console.log('EmailJS response:', response);
return true;
}).catch(error => {
console.error('EmailJS send error:', error);
return false;
});
}

function isEmailJSBookingConfigured() {
// Consider configured if emailjs exists and at least one template id is set (booking or default)
const templateConfigured = (EMAILJS_BOOKING_TEMPLATE_ID && !EMAILJS_BOOKING_TEMPLATE_ID.startsWith('your_')) || (EMAILJS_TEMPLATE_ID && !EMAILJS_TEMPLATE_ID.startsWith('your_'));
return window.emailjs &&
EMAILJS_SERVICE_ID && !EMAILJS_SERVICE_ID.startsWith('your_') &&
templateConfigured &&
EMAILJS_PUBLIC_KEY && !EMAILJS_PUBLIC_KEY.startsWith('your_');
}

function isTwilioProxyConfigured() {
return TWILIO_PROXY_URL && !TWILIO_PROXY_URL.startsWith('your_');
}

function isTwilioDirectConfigured() {
return TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER &&
!TWILIO_ACCOUNT_SID.startsWith('your_') && !TWILIO_AUTH_TOKEN.startsWith('your_');
}

function isTwilioConfigured() {
return isTwilioProxyConfigured() || isTwilioDirectConfigured();
}

function sendBookingConfirmationEmail(appointment) {
const templateToUse = (EMAILJS_BOOKING_TEMPLATE_ID && !EMAILJS_BOOKING_TEMPLATE_ID.startsWith('your_')) ? EMAILJS_BOOKING_TEMPLATE_ID : EMAILJS_TEMPLATE_ID;
if (!isEmailJSBookingConfigured() || !templateToUse) {
console.warn('EmailJS not configured or template missing. Skipping email confirmation.');
return Promise.resolve(false);
}

const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const bookingMessage = `Booking Confirmed!\n\nYour dental appointment has been successfully scheduled.\n\nAppointment Details:\n• Patient Name: ${appointment.userName}\n• Dentist: ${appointment.dentist}\n• Service: ${appointment.service}\n• Date: ${formattedDate}\n• Time: ${appointment.time}\n\nPlease arrive at least 10–15 minutes before your scheduled appointment time.\n\nIf you need to reschedule or cancel your appointment, kindly do so at least 24 hours in advance.\n\nThank you for choosing ODBS Dental Clinic. We look forward to seeing you!`;
const params = {
to_email: appointment.userEmail,
to_name: appointment.userName,
booking_service: appointment.service,
booking_date: appointment.date,
booking_time: appointment.time,
booking_dentist: appointment.dentist,
booking_phone: appointment.userPhone || '',
message: bookingMessage,
subject: `Booking Confirmed: ${appointment.service}`,
user_name: appointment.userName,
user_email: appointment.userEmail
};

console.log('Sending booking confirmation email using template:', templateToUse, 'params:', params);
return emailjs.send(EMAILJS_SERVICE_ID, templateToUse, params).then(response => {
console.log('Booking confirmation email sent:', response);
return true;
}).catch(err => {
console.error('Failed to send booking email:', err);
return false;
});
}

function sendBookingConfirmationSMS(appointment) {
if (!isTwilioConfigured()) {
console.warn('Twilio not configured. Skipping SMS confirmation.');
return Promise.resolve(false);
}

let toNumber = (appointment.userPhone || '').replace(/[^+0-9]/g, '');
if (toNumber.startsWith('0') && toNumber.length === 11) {
toNumber = '+63' + toNumber.slice(1);
} else if (toNumber.startsWith('63') && toNumber.length === 12) {
toNumber = '+' + toNumber;
}

if (!toNumber || !/^\+[0-9]{10,15}$/.test(toNumber)) {
console.warn('Invalid phone number format for SMS confirmation:', appointment.userPhone);
return Promise.resolve(false);
}

const body = `Your appointment for ${appointment.service} on ${appointment.date} at ${appointment.time} with ${appointment.dentist} is confirmed.`;

if (isTwilioProxyConfigured()) {
console.log('Sending SMS via proxy:', TWILIO_PROXY_URL);
return fetch(TWILIO_PROXY_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ to: toNumber, body })
}).then(resp => resp.json()).then(data => {
if (data && data.sid) {
console.log('SMS sent via proxy:', data.sid);
return true;
}
console.error('SMS proxy response:', data);
return false;
}).catch(err => {
console.error('SMS proxy send error:', err);
return false;
});
}

const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

const form = new URLSearchParams();
form.append('From', TWILIO_FROM_NUMBER);
form.append('To', toNumber);
form.append('Body', body);

return fetch(url, {
method: 'POST',
headers: {
'Authorization': `Basic ${auth}`,
'Content-Type': 'application/x-www-form-urlencoded'
},
body: form.toString()
}).then(resp => resp.json()).then(data => {
if (data && data.sid) {
console.log('SMS sent via Twilio:', data.sid);
return true;
}
console.error('Twilio response:', data);
return false;
}).catch(err => {
console.error('Twilio send error:', err);
return false;
});
}

// Generate simple iCalendar (ICS) content for an appointment
function showBookingConfirmationModal(appointment) {
const clinicName = 'ODBS Dental Clinic';
const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const content = `Booking Confirmed!\n\nYour dental appointment has been successfully scheduled.\n\nAppointment Details:\n• Patient Name: ${appointment.userName}\n• Dentist: ${appointment.dentist}\n• Service: ${appointment.service}\n• Date: ${formattedDate}\n• Time: ${appointment.time}\n\nPlease arrive at least 10–15 minutes before your scheduled appointment time.\n\nIf you need to reschedule or cancel your appointment, kindly do so at least 24 hours in advance.\n\nThank you for choosing ${clinicName}. We look forward to seeing you!`;

const modal = document.getElementById('bookingConfirmationModal');
const contentEl = document.getElementById('bookingConfirmationContent');
if (contentEl) contentEl.textContent = content;
if (modal) modal.style.display = 'block';
}

function closeBookingConfirmationModal() {
const modal = document.getElementById('bookingConfirmationModal');
if (modal) modal.style.display = 'none';
}

// Initialize application
function initializeApp() {
initializeEmailJS();
loadUsers();
loadAppointments();
initializeCalendar();

// Make testEmailJS available in console
window.testEmailJS = testEmailJS;

// Check if user is already logged in
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
switchPage('dashboardPage');
displayUserName(JSON.parse(currentUser).name);
updateAdminNavVisibility();
} else {
// Auto-fill login form if "Remember me" was checked
const rememberedCredentials = localStorage.getItem('rememberedCredentials');
if (rememberedCredentials) {
const { email, password } = JSON.parse(rememberedCredentials);
document.getElementById('loginEmail').value = email;
document.getElementById('loginPassword').value = password;
document.querySelector('.remember-forget input[type="checkbox"]').checked = true;
}
switchPage('loginPage');
}
}

// Setup event listeners
function setupEventListeners() {
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const bookingForm = document.getElementById('bookingForm');

console.log('Setting up event listeners...');
console.log('loginForm:', loginForm);
console.log('registerForm:', registerForm);
console.log('bookingForm:', bookingForm);

if (loginForm) {
loginForm.addEventListener('submit', handleLogin);
console.log('Login form listener attached');
}

if (registerForm) {
registerForm.addEventListener('submit', handleRegister);
console.log('Register form listener attached');
}

if (bookingForm) {
bookingForm.addEventListener('submit', handleBooking);
console.log('Booking form listener attached');
}

const bookingFieldIds = ['serviceType', 'appointmentDate', 'appointmentTime', 'dentist', 'appointmentNotes'];
bookingFieldIds.forEach(id => {
const element = document.getElementById(id);
if (element) {
element.addEventListener('change', updateBookingOverview);
element.addEventListener('input', updateBookingOverview);
}
});

// Password toggle listeners
const loginPasswordToggle = document.getElementById('toggleLoginPassword');
const registerPasswordToggle = document.getElementById('toggleRegisterPassword');
const registerConfirmPasswordToggle = document.getElementById('toggleRegisterConfirmPassword');

if (loginPasswordToggle) {
loginPasswordToggle.addEventListener('click', toggleLoginPassword);
}

if (registerPasswordToggle) {
registerPasswordToggle.addEventListener('click', toggleRegisterPassword);
}

if (registerConfirmPasswordToggle) {
registerConfirmPasswordToggle.addEventListener('click', toggleRegisterConfirmPassword);
}

const showLoginPasswordCheckbox = document.getElementById('showLoginPasswordCheckbox');
if (showLoginPasswordCheckbox) {
showLoginPasswordCheckbox.addEventListener('change', handleLoginShowPassword);
}

const showRegisterPasswordsCheckbox = document.getElementById('showRegisterPasswordsCheckbox');
if (showRegisterPasswordsCheckbox) {
showRegisterPasswordsCheckbox.addEventListener('change', handleRegisterShowPasswords);
}

// Forgot password form listener
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
forgotPasswordForm.addEventListener('submit', handleForgotPassword);
}

// Social login form listener
const socialLoginForm = document.getElementById('socialLoginForm');
if (socialLoginForm) {
socialLoginForm.addEventListener('submit', handleSocialSubmit);
}

// Email verification form listener
const emailVerificationForm = document.getElementById('emailVerificationForm');
if (emailVerificationForm) {
emailVerificationForm.addEventListener('submit', handleEmailVerification);
}

const profileAvatarInput = document.getElementById('editProfileAvatar');
if (profileAvatarInput) {
profileAvatarInput.addEventListener('change', handleProfileAvatarChange);
}
}

const MAX_LOGIN_ATTEMPTS = 3;
const LOGIN_LOCK_SECONDS = 10;

function getLoginAttemptCount() {
return parseInt(localStorage.getItem('loginAttempts') || '0', 10);
}

function setLoginAttemptCount(count) {
localStorage.setItem('loginAttempts', count.toString());
}

function resetLoginAttempts() {
localStorage.removeItem('loginAttempts');
}

function getLoginLockUntil() {
return parseInt(localStorage.getItem('loginLockUntil') || '0', 10);
}

function setLoginLockUntil(timestamp) {
localStorage.setItem('loginLockUntil', timestamp.toString());
}

function clearLoginLock() {
localStorage.removeItem('loginLockUntil');
resetLoginAttempts();
}

function updateLoginLockState(showWarnings = false) {
const loginButton = document.querySelector('#loginForm button[type="submit"]');
const lockUntil = getLoginLockUntil();
const now = Date.now();
let isLocked = false;

if (lockUntil && now < lockUntil) {
isLocked = true;
} else if (lockUntil && now >= lockUntil) {
clearLoginLock();
isLocked = false;
}

if (loginButton) {
loginButton.disabled = isLocked;
}

if (showWarnings && isLocked) {
const remainingSeconds = Math.ceil((lockUntil - now) / 1000);
showMessage(`Too many failed login attempts. Please try again in ${remainingSeconds} seconds.`, 'error', 'loginMessage');
}

return isLocked;
}

// Switch page function
function switchPage(pageId) {
if (pageId === 'loginPage') {
a.style.display = "flex";
b.style.display = "none";
c.style.display = "none";
updateLoginLockState(true);
} else if (pageId === 'registerPage') {
a.style.display = "none";
b.style.display = "flex";
c.style.display = "none";
} else if (pageId === 'dashboardPage') {
a.style.display = "none";
b.style.display = "none";
c.style.display = "block";
updateAdminNavVisibility();
}
}

var a = document.getElementById("loginPage");
var b = document.getElementById("registerPage");
var c = document.getElementById("dashboardPage");

function login() {
a.style.display = "flex"; 
b.style.display = "none";
}

function register() {
a.style.display = "none"; 
b.style.display = "flex";

}

// Handle Login
function handleLogin(e) {
e.preventDefault();

if (updateLoginLockState(true)) {
return;
}

const email = document.getElementById('loginEmail').value;
const password = document.getElementById('loginPassword').value;
const rememberMe = document.querySelector('.remember-forget input[type="checkbox"]').checked;

const users = JSON.parse(localStorage.getItem('users') || '[]');

const user = users.find(u => u.email === email && u.password === password);

if (user) {

localStorage.setItem('currentUser', JSON.stringify(user));
resetLoginAttempts();

// Redirect dentist users before admin check if the email uses the dentist domain
if (email.endsWith("@dentist.odbs.com") || user.role === 'dentist') {
user.role = 'dentist';
localStorage.setItem('currentUser', JSON.stringify(user));
window.location.href = "dentist.html";
return;
}

// ✅ CHECK IF EMAIL IS ADMIN DOMAIN
if (email.endsWith("@odbs.com")) {
user.isAdmin = true; // mark as admin
localStorage.setItem('currentUser', JSON.stringify(user));

window.location.href = "admin.html"; // 🔁 redirect to admin page
return; // stop execution
}

if (email.endsWith("@odbs.com")) {
user.isDentist = true; // mark as dentist
localStorage.setItem('currentUser', JSON.stringify(user));

window.location.href = "dentist.html"; // 🔁 redirect to dentist page
return; // stop execution
}

// Handle "Remember me" functionality
if (rememberMe) {
localStorage.setItem('rememberedCredentials', JSON.stringify({ email, password }));
} else {
localStorage.removeItem('rememberedCredentials');
}

displayUserName(user.name);
switchPage('dashboardPage');
resetForm('loginForm');
showMessage('Login successful!', 'success', 'loginMessage');
} else {
// Handle failed login
const attemptCount = getLoginAttemptCount() + 1;
setLoginAttemptCount(attemptCount);

if (attemptCount >= MAX_LOGIN_ATTEMPTS) {
const lockTime = Date.now() + (LOGIN_LOCK_SECONDS * 1000);
setLoginLockUntil(lockTime);
updateLoginLockState(true);
showMessage(`Too many failed login attempts. Please try again in ${LOGIN_LOCK_SECONDS} seconds.`, 'error', 'loginMessage');
} else {
const remainingAttempts = MAX_LOGIN_ATTEMPTS - attemptCount;
showMessage(`Invalid email or password. ${remainingAttempts} attempt(s) remaining.`, 'error', 'loginMessage');
}
}
}

// Handle Registration
function handleRegister(e) {
e.preventDefault();

const name = document.getElementById('registerName').value;
const email = document.getElementById('registerEmail').value;
const phone = document.getElementById('registerPhone').value;
const password = document.getElementById('registerPassword').value;
const confirmPassword = document.getElementById('registerConfirmPassword').value;

if (password !== confirmPassword) {
alert('Passwords do not match!');
return;
}

const users = JSON.parse(localStorage.getItem('users') || '[]');

if (users.find(u => u.email === email)) {
alert('Email already registered!');
return;
}

// Store registration data temporarily
const tempUser = {
name,
email,
phone,
password,
role: email.endsWith('@dentist.odbs.com') ? 'dentist' : 'patient',
registeredDate: new Date().toLocaleDateString()
};

localStorage.setItem('tempUser', JSON.stringify(tempUser));

// Generate and store verification code
const verificationCode = generateVerificationCode();
localStorage.setItem('verificationCode', verificationCode);
localStorage.setItem('verificationExpiry', Date.now() + 10 * 60 * 1000); // 10 minutes

// Show verification modal
showEmailVerificationModal();
sendVerificationEmail(email, verificationCode, name).then(sent => {
const hintElement = document.getElementById('verificationHint');
if (!sent) {
const hintMessage = `Verification code: <strong style="font-size: 1.2em; color: #2196F3;">${verificationCode}</strong>. Use this code below to complete registration.`;
showVerificationMessage('Email sending failed. The verification code is shown below.', 'error');
if (hintElement) {
hintElement.innerHTML = hintMessage;
hintElement.style.display = 'block';
}
alert(`Email verification could not be sent. Your code is ${verificationCode}. Please enter it in the verification dialog.`);
} else {
showVerificationMessage('Verification code sent to your email!', 'success');
if (hintElement) {
hintElement.style.display = 'none';
}
}
}).catch(error => {
console.error('sendVerificationEmail promise error:', error);
const hintMessage = `Verification code: <strong style="font-size: 1.2em; color: #2196F3;">${verificationCode}</strong>. Use this code below to complete registration.`;
showVerificationMessage('Email verification failed. The code is shown below.', 'error');
if (hintElement) {
hintElement.innerHTML = hintMessage;
hintElement.style.display = 'block';
}
alert(`Email verification could not be sent. Your code is ${verificationCode}. Please enter it in the verification dialog.`);
});

// Show fallback message with code in case EmailJS is not configured
console.log(`Verification code for ${email}: ${verificationCode}`);

resetForm('registerForm');
}


// Logout
function logout() {
if (confirm('Are you sure you want to logout?')) {
localStorage.removeItem('currentUser');
resetForm('loginForm');
resetForm('registerForm');
resetForm('bookingForm');
switchPage('loginPage');   
}
}

function logoutadmin(){
localStorage.removeItem('currentUser');
window.location.href = "index.html";
if (typeof switchPage === 'function') {
try {
switchPage('loginPage');
} catch (err) {
// ignore if login page is not available on this route
}
}
}

function logoutDentist(){
localStorage.removeItem('currentUser');
window.location.href = "index.html";
}

// Switch dashboard tabs
function switchTab(tabName) {
const tabs = document.querySelectorAll('.dashboard-tab');
tabs.forEach(tab => tab.classList.remove('active'));

if (tabName === 'dashboard') {
document.getElementById('dashboardTab').classList.add('active');
renderDashboardSummary();
} else if (tabName === 'booking') {
document.getElementById('bookingTab').classList.add('active');
updateBookingOverview();
} else if (tabName === 'appointments') {
document.getElementById('appointmentsTab').classList.add('active');
displayAppointments();
} else if (tabName === 'records') {
document.getElementById('recordsTab').classList.add('active');
renderRecords();
} else if (tabName === 'profile') {
document.getElementById('profileTab').classList.add('active');
displayUserProfile();
}
}

// Display user name
function displayUserName(name) {
const firstName = name.split(' ')[0] || name;
const userNameElement = document.getElementById('userName');
if (userNameElement) {
userNameElement.textContent = firstName;
}
renderDashboardSummary();
}

function renderDashboardSummary() {
const nextAppointmentCard = document.getElementById('nextAppointmentCard');
const nextAppointmentStatus = document.getElementById('nextAppointmentStatus');
const currentUserData = localStorage.getItem('currentUser');
if (!nextAppointmentCard || !nextAppointmentStatus || !currentUserData) {
return;
}

const currentUser = JSON.parse(currentUserData);
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const upcoming = appointments
.filter(apt => apt.userId === currentUser.id)
.filter(apt => new Date(apt.date) >= new Date())
.sort((a, b) => new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time));

if (upcoming.length === 0) {
nextAppointmentStatus.textContent = 'No Booking';
nextAppointmentCard.innerHTML = `
           <div class="summary-empty">
               <p>No upcoming appointments yet.</p>
               <small>Book a slot to see it here.</small>
           </div>
       `;
return;
}

const next = upcoming[0];
nextAppointmentStatus.textContent = next.status || 'Confirmed';
nextAppointmentCard.innerHTML = `
       <div class="appointment-summary">
           <div class="appointment-summary-left">
               <span class="summary-label">${next.service}</span>
               <h3>${new Date(next.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
               <div class="summary-detail">${next.time} · ${next.dentist}</div>
               <div class="summary-detail">${next.userPhone ? next.userPhone + ' · ' : ''}${next.userEmail}</div>
           </div>
           <div class="appointment-summary-right">
               <button class="btn-submit" onclick="switchTab('appointments')">Manage</button>
           </div>
       </div>
   `;
}

// Show or hide admin and dentist nav links based on current user's role
function updateAdminNavVisibility() {
try {
const currentUserData = localStorage.getItem('currentUser');
const adminLink = document.getElementById('adminNavLink');
const dentistLink = document.getElementById('dentistNavLink');
if (adminLink) adminLink.style.display = 'none';
if (dentistLink) dentistLink.style.display = 'none';
if (!currentUserData) {
return;
}
const currentUser = JSON.parse(currentUserData);
if (currentUser && currentUser.isAdmin && adminLink) {
adminLink.style.display = 'block';
}
if (currentUser && currentUser.role === 'dentist' && dentistLink) {
dentistLink.style.display = 'block';
}
} catch (err) {
console.error('Error updating admin/dentist nav visibility:', err);
}
}

function displayUserProfile() {
const currentUserData = localStorage.getItem('currentUser');
if (!currentUserData) return;

const currentUser = JSON.parse(currentUserData);
const avatarEl = document.getElementById('profileAvatar');
if (avatarEl) {
if (currentUser.avatar) {
avatarEl.innerHTML = `<img src="${currentUser.avatar}" alt="Profile Avatar">`;
} else {
avatarEl.innerHTML = '👤';
}
}

document.getElementById('profileName').textContent = currentUser.name || 'User Name';
document.getElementById('profileProvider').textContent = formatProviderLabel(currentUser.provider);
document.getElementById('profileEmail').textContent = currentUser.email || 'Not available';
document.getElementById('profilePhone').textContent = currentUser.phone || 'Not available';
document.getElementById('profileJoinDate').textContent = currentUser.registeredDate || 'Not available';
document.getElementById('profileLoginMethod').textContent = currentUser.provider ? `${currentUser.provider} login` : 'Email & Password';
document.getElementById('profileDentist').textContent = currentUser.preferredDentist || 'Not selected';
document.getElementById('profileEditForm').style.display = 'none';
clearProfileMessage();
}

function handleProfileAvatarChange(event) {
const file = event.target.files && event.target.files[0];
if (!file) {
return;
}

const reader = new FileReader();
reader.onload = function(e) {
const avatarEl = document.getElementById('profileAvatar');
if (avatarEl && e.target && e.target.result) {
avatarEl.innerHTML = `<img src="${e.target.result}" alt="Profile Avatar">`;
}
};
reader.readAsDataURL(file);
}

function finishSaveProfile(currentUser) {
const users = JSON.parse(localStorage.getItem('users') || '[]');
const userIndex = users.findIndex(user => user.email === currentUser.email);
if (userIndex !== -1) {
users[userIndex] = currentUser;
localStorage.setItem('users', JSON.stringify(users));
}

localStorage.setItem('currentUser', JSON.stringify(currentUser));
displayUserName(currentUser.name);
displayUserProfile();
showProfileMessage('Profile updated successfully.', 'success');
}

function formatProviderLabel(provider) {
if (!provider) {
return 'Email Account';
}
return `${provider.charAt(0).toUpperCase() + provider.slice(1)} Account`;
}

function editProfile() {
const currentUserData = localStorage.getItem('currentUser');
if (!currentUserData) return;

const currentUser = JSON.parse(currentUserData);
document.getElementById('editProfileName').value = currentUser.name || '';
document.getElementById('editProfileEmail').value = currentUser.email || '';
document.getElementById('editProfilePhone').value = currentUser.phone || '';
document.getElementById('editProfileDentist').value = currentUser.preferredDentist || '';
const avatarInput = document.getElementById('editProfileAvatar');
if (avatarInput) {
avatarInput.value = '';
}
document.getElementById('profileEditForm').style.display = 'block';
clearProfileMessage();
}

function saveProfileChanges() {
const currentUserData = localStorage.getItem('currentUser');
if (!currentUserData) return;

const currentUser = JSON.parse(currentUserData);
const name = document.getElementById('editProfileName').value.trim();
const phone = document.getElementById('editProfilePhone').value.trim();
const preferredDentist = document.getElementById('editProfileDentist').value;

if (!name) {
showProfileMessage('Name cannot be empty.', 'error');
return;
}

currentUser.name = name;
currentUser.phone = phone;
currentUser.preferredDentist = preferredDentist;

const avatarInput = document.getElementById('editProfileAvatar');
const avatarFile = avatarInput && avatarInput.files && avatarInput.files[0];

if (avatarFile) {
const reader = new FileReader();
reader.onload = function(e) {
if (e.target && e.target.result) {
currentUser.avatar = e.target.result;
}
finishSaveProfile(currentUser);
};
reader.readAsDataURL(avatarFile);
return;
}

finishSaveProfile(currentUser);
}

function cancelProfileEdit() {
document.getElementById('profileEditForm').style.display = 'none';
clearProfileMessage();
}

function changePassword() {
const currentUserData = localStorage.getItem('currentUser');
if (!currentUserData) return;

const currentUser = JSON.parse(currentUserData);
const newPassword = prompt('Enter your new password:');
if (!newPassword) return;

const confirmPassword = prompt('Confirm your new password:');
if (newPassword !== confirmPassword) {
alert('Passwords do not match. Try again.');
return;
}

currentUser.password = newPassword;
const users = JSON.parse(localStorage.getItem('users') || '[]');
const userIndex = users.findIndex(user => user.email === currentUser.email);
if (userIndex !== -1) {
users[userIndex] = currentUser;
localStorage.setItem('users', JSON.stringify(users));
}

localStorage.setItem('currentUser', JSON.stringify(currentUser));
alert('Password changed successfully.');
}

function showProfileMessage(message, type) {
const messageElement = document.getElementById('profileMessage');
if (!messageElement) return;
messageElement.textContent = message;
messageElement.className = `message ${type}`;
messageElement.style.display = 'block';
}

function clearProfileMessage() {
const messageElement = document.getElementById('profileMessage');
if (!messageElement) return;
messageElement.textContent = '';
messageElement.className = 'message';
messageElement.style.display = 'none';
}

// ===== BOOKING FUNCTIONS =====

// Handle booking
function handleBooking(e) {
e.preventDefault();

try {
const currentUserData = localStorage.getItem('currentUser');
console.log('Current user data:', currentUserData);

if (!currentUserData) {
showMessage('Please login first to book an appointment!', 'error', 'bookingMessage');
return;
}

const currentUser = JSON.parse(currentUserData);

// Check if user is logged in
if (!currentUser || !currentUser.id) {
showMessage('Please login first to book an appointment!', 'error', 'bookingMessage');
return;
}

// Get form values (support multiple selected services)
const serviceSelect = document.getElementById('serviceType');
const selectedServices = serviceSelect ? Array.from(serviceSelect.selectedOptions).map(o => o.value).filter(v => v) : [];
const serviceType = selectedServices.join(', ');
const appointmentDate = document.getElementById('appointmentDate').value;
const appointmentTime = document.getElementById('appointmentTime').value;
const dentist = document.getElementById('dentist').value;
const notes = document.getElementById('appointmentNotes').value;

console.log('Form values:', {serviceType, appointmentDate, appointmentTime, dentist});

// Validate form fields
if (!selectedServices.length || !appointmentDate || !appointmentTime || !dentist) {
showMessage('Please fill in all required fields!', 'error', 'bookingMessage');
return;
}

// Check if appointment slot is already booked
const appointmentsData = localStorage.getItem('appointments') || '[]';
const appointments = JSON.parse(appointmentsData);

const isSlotTaken = appointments.some(apt => 
apt.date === appointmentDate && 
apt.time === appointmentTime && 
apt.dentist === dentist
);

if (isSlotTaken) {
showMessage('This time slot is already booked. Please choose another.', 'error', 'bookingMessage');
return;
}

// Create appointment object
const appointment = {
id: Date.now(),
userId: currentUser.id,
userName: currentUser.name,
userEmail: currentUser.email,
userPhone: currentUser.phone,
service: serviceType,
date: appointmentDate,
time: appointmentTime,
dentist: dentist,
notes: notes,
status: 'Confirmed',
bookedDate: new Date().toLocaleDateString()
};

console.log('Appointment to save:', appointment);

// Save appointment
appointments.push(appointment);
localStorage.setItem('appointments', JSON.stringify(appointments));

console.log('Appointments saved:', appointments);

// Optimistic success message (we'll update with confirmation delivery status)
showMessage('Appointment booked successfully! Sending confirmations...', 'success', 'bookingMessage');
resetForm('bookingForm');
updateBookingOverview();

// Send confirmations (email + SMS if configured)
Promise.all([
sendBookingConfirmationEmail(appointment),
sendBookingConfirmationSMS(appointment)
]).then(([emailSent, smsSent]) => {
// store results for the modal to display
_lastConfirmationResults = { emailSent: !!emailSent, smsSent: !!smsSent };

let confirmationMsg = 'Appointment booked successfully!';
if (emailSent) confirmationMsg += ' Email confirmation sent.';
if (smsSent) confirmationMsg += ' SMS confirmation sent.';
if (!emailSent && !smsSent) confirmationMsg += ' (No confirmation sent — configure EmailJS or Twilio.)';
showMessage(confirmationMsg, 'success', 'bookingMessage');

// Show formatted confirmation modal with appointment details and .ics download
console.log('Notification results:', _lastConfirmationResults);
showBookingConfirmationModal(appointment);
}).catch(err => {
console.error('Error sending confirmations:', err);
_lastConfirmationResults = { emailSent: false, smsSent: false };
showMessage('Appointment booked but confirmation delivery failed.', 'error', 'bookingMessage');
});

// Switch to appointments tab
setTimeout(() => {
switchTab('appointments');
}, 1500);

} catch (error) {
console.error('Error in handleBooking:', error);
showMessage('An error occurred: ' + error.message, 'error', 'bookingMessage');
}
}


// Display appointments
function displayAppointments() {
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser) {
alert('Please login to view appointments');
return;
}

const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');

const userAppointments = appointments.filter(apt => apt.userId === currentUser.id);
const appointmentsList = document.getElementById('appointmentsList');
const cancelAllBtn = document.getElementById('cancelAllBtn');

if (userAppointments.length === 0) {
appointmentsList.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No appointments booked yet.</p>';
cancelAllBtn.style.display = 'none';
return;
}

cancelAllBtn.style.display = userAppointments.length > 0 ? 'flex' : 'none';

appointmentsList.innerHTML = userAppointments.map(apt => {
const notesHtml = apt.notes ? `<div style="background: #f0f0f0; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 14px;"><strong>Notes:</strong> ${apt.notes}</div>` : '';
const dentistNotesHtml = apt.dentistNotes ? `<div style="background: #f7fff4; padding: 10px; border-radius: 8px; margin-bottom: 10px; font-size: 14px;"><strong>Dentist's Notes:</strong> ${apt.dentistNotes}</div>` : '';
const finishedInfo = apt.status === 'Finished' && apt.finishedDate ? `<div style="font-size:13px; color:#6b7280; margin-bottom:8px;">Finished: ${new Date(apt.finishedDate).toLocaleString()}</div>` : '';

const actions = [];
actions.push(`<button class="btn-cancel" onclick="cancelAppointment(${apt.id})">Cancel Appointment</button>`);
// Only show 'Mark as Finished' for patients viewing finished appointments with dentist notes
// (actual finish is handled by admin interface)

return `
       <div class="appointment-card">
           <h3>📅 ${escapeHtml(apt.service)}</h3>
           <div class="appointment-details">
               <div class="detail-item">
                   <div class="detail-label">Date</div>
                   <div class="detail-value">${new Date(apt.date).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</div>
               </div>
               <div class="detail-item">
                   <div class="detail-label">Time</div>
                   <div class="detail-value">${apt.time}</div>
               </div>
               <div class="detail-item">
                   <div class="detail-label">Dentist</div>
                   <div class="detail-value">${escapeHtml(apt.dentist)}</div>
               </div>
               <div class="detail-item">
                   <div class="detail-label">Services</div>
                   <div class="detail-value">${formatServiceHTML(apt.service)}</div>
               </div>
               <div class="detail-item">
                   <div class="detail-label">Status</div>
                   <div class="detail-value" style="color: ${apt.status === 'Finished' ? '#6b7280' : '#28a745'};">${escapeHtml(apt.status)}</div>
               </div>
           </div>
           ${finishedInfo}
           ${notesHtml}
           ${dentistNotesHtml}
           <div class="appointment-actions">
               ${actions.join(' ')}
           </div>
       </div>
   `;
}).join('');
}

// Mark appointment as finished and capture dentist's notes (modal-based)
let _finishAppointmentPendingId = null;

function markAppointmentFinished(appointmentId) {
_finishAppointmentPendingId = appointmentId;
const modal = document.getElementById('dentistNotesModal');
const textarea = document.getElementById('dentistNotesTextarea');
if (textarea) textarea.value = '';
if (modal) modal.style.display = 'block';
}

function closeDentistNotesModal() {
const modal = document.getElementById('dentistNotesModal');
if (modal) modal.style.display = 'none';
_finishAppointmentPendingId = null;
}

function saveDentistNotesFromModal() {
if (!_finishAppointmentPendingId) return closeDentistNotesModal();
const notes = document.getElementById('dentistNotesTextarea').value || '';
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const idx = appointments.findIndex(a => a.id === _finishAppointmentPendingId);
if (idx === -1) {
alert('Appointment not found');
closeDentistNotesModal();
return;
}

appointments[idx].status = 'Finished';
appointments[idx].dentistNotes = notes;
appointments[idx].finishedDate = new Date().toISOString();
localStorage.setItem('appointments', JSON.stringify(appointments));
displayAppointments();
renderRecords();
closeDentistNotesModal();
showMessage('Appointment marked as finished and saved to records.', 'success', 'bookingMessage');
}

// wire save button (in case DOM loaded already)
document.addEventListener('DOMContentLoaded', function () {
const saveBtn = document.getElementById('dentistNotesSaveBtn');
if (saveBtn) saveBtn.addEventListener('click', saveDentistNotesFromModal);
});

// Render finished appointments (records)
function renderRecords() {
const currentUserData = localStorage.getItem('currentUser');
const recordsList = document.getElementById('recordsList');
if (!recordsList) return;
if (!currentUserData) {
recordsList.innerHTML = '<p style="text-align:center; padding:40px; color:#999;">Please login to view records.</p>';
return;
}

const currentUser = JSON.parse(currentUserData);
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const finished = appointments.filter(apt => apt.userId === currentUser.id && apt.status === 'Finished')
.sort((a,b) => new Date(b.finishedDate || 0) - new Date(a.finishedDate || 0));

if (finished.length === 0) {
recordsList.innerHTML = '<p style="text-align:center; padding:40px; color:#999;">No finished appointments yet.</p>';
return;
}

recordsList.innerHTML = finished.map(apt => `
       <div class="appointment-card">
           <h3>${escapeHtml(apt.service)}</h3>
           <div class="appointment-details">
               <div class="detail-item"><div class="detail-label">Date</div><div class="detail-value">${new Date(apt.date).toLocaleDateString()}</div></div>
               <div class="detail-item"><div class="detail-label">Time</div><div class="detail-value">${escapeHtml(apt.time)}</div></div>
               <div class="detail-item"><div class="detail-label">Dentist</div><div class="detail-value">${escapeHtml(apt.dentist)}</div></div>
               <div class="detail-item"><div class="detail-label">Services</div><div class="detail-value">${formatServiceHTML(apt.service)}</div></div>
               <div class="detail-item"><div class="detail-label">Status</div><div class="detail-value">${escapeHtml(apt.status)}</div></div>
           </div>
           ${apt.dentistNotes ? `<div style="background:#f7fff4; padding:10px; border-radius:8px; margin-bottom:10px;"><strong>Dentist's Notes:</strong> ${escapeHtml(apt.dentistNotes)}</div>` : ''}
           <div style="font-size:13px; color:#6b7280;">Finished: ${apt.finishedDate ? new Date(apt.finishedDate).toLocaleString() : 'N/A'}</div>
       </div>
   `).join('');
}

function updateBookingOverview() {
assignDentistForService();
const currentUserData = localStorage.getItem('currentUser');
const upcomingCountEl = document.getElementById('upcomingAppointmentCount');
const selectedPreviewEl = document.getElementById('selectedServicePreview');

if (!currentUserData) {
if (upcomingCountEl) upcomingCountEl.textContent = '0';
if (selectedPreviewEl) selectedPreviewEl.textContent = 'Choose a service';
return;
}

const currentUser = JSON.parse(currentUserData);
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const userAppointments = appointments.filter(apt => apt.userId === currentUser.id && new Date(apt.date) >= new Date());

if (upcomingCountEl) {
upcomingCountEl.textContent = userAppointments.length.toString();
}

const serviceSelect = document.getElementById('serviceType');
const selectedServices = serviceSelect ? Array.from(serviceSelect.selectedOptions).map(o => o.value).filter(v => v) : [];
const serviceType = selectedServices.join(', ');
const appointmentDate = document.getElementById('appointmentDate') ? document.getElementById('appointmentDate').value : '';
const appointmentTime = document.getElementById('appointmentTime') ? document.getElementById('appointmentTime').value : '';
const dentist = document.getElementById('dentist') ? document.getElementById('dentist').value : '';

let previewText = 'Choose a service';
if (serviceType) {
previewText = `${serviceType}`;
if (appointmentDate) {
const dateLabel = new Date(appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
previewText += ` on ${dateLabel}`;
}
if (appointmentTime) {
previewText += ` at ${appointmentTime}`;
}
if (dentist) {
previewText += ` with ${dentist}`;
}
}

if (selectedPreviewEl) {
selectedPreviewEl.textContent = previewText;
}
}

// Cancel single appointment
function cancelAppointment(appointmentId) {
if (confirm('Are you sure you want to cancel this appointment?')) {
let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
appointments = appointments.filter(apt => apt.id !== appointmentId);
localStorage.setItem('appointments', JSON.stringify(appointments));
displayAppointments();
alert('Appointment cancelled successfully!');
}
}

// Cancel all appointments
function cancelAllAppointments() {
if (confirm('Are you sure you want to cancel all your appointments? This action cannot be undone.')) {
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
appointments = appointments.filter(apt => apt.userId !== currentUser.id);
localStorage.setItem('appointments', JSON.stringify(appointments));
displayAppointments();
alert('All appointments cancelled successfully!');
}
}

// ===== UTILITY FUNCTIONS =====

// Show message
function showMessage(message, type, elementId) {
const messageElement = document.getElementById(elementId);
if (messageElement) {
messageElement.textContent = message;
messageElement.className = `message ${type}`;
messageElement.style.display = 'block';

// Only auto-hide for certain messages, not social login messages
if (!message.includes('Connecting to') && !message.includes('Successfully logged in') && !message.includes('Account created')) {
setTimeout(() => {
messageElement.className = 'message';
messageElement.style.display = 'none';
}, 5000);
}
}
}

// Reset form
function resetForm(formId) {
document.getElementById(formId).reset();
}

// Set minimum date for appointment booking
function setMinimumDate() {
const dateInput = document.getElementById('appointmentDate');
if (!dateInput) return; // Element might not exist yet

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const minDate = tomorrow.toISOString().split('T')[0];
dateInput.setAttribute('min', minDate);
}

// Load users from localStorage
function loadUsers() {
if (!localStorage.getItem('users')) {
const defaultAdmin = {
id: Date.now(),
name: 'Admin',
email: 'admin@odbs.com',
phone: '',
password: 'admin123',
provider: 'admin',
registeredDate: new Date().toLocaleDateString(),
preferredDentist: '',
isAdmin: true
};

const defaultDentist = {
id: Date.now() + 1,
name: 'Dentist',
email: 'dentist@dentist.odbs.com',
phone: '',
password: 'dentist123',
provider: 'dentist',
registeredDate: new Date().toLocaleDateString(),
role: 'dentist',
specialty: '',
isDentist: true
};

localStorage.setItem('users', JSON.stringify([defaultAdmin, defaultDentist]));
return;
}

const users = JSON.parse(localStorage.getItem('users') || '[]');

if (!users.some(user => user.isAdmin)) {
const defaultAdmin = {
id: Date.now(),
name: 'Admin',
email: 'admin@odbs.com',
phone: '',
password: 'admin123',
provider: 'admin',
registeredDate: new Date().toLocaleDateString(),
preferredDentist: '',
isAdmin: true
};
users.unshift(defaultAdmin);
}

if (!users.some(user => user.isDentist)) {
const defaultDentist = {
id: Date.now() + 1,
name: 'Dentist',
email: 'dentist@dentist.odbs.com',
phone: '',
password: 'dentist123',
provider: 'dentist',
registeredDate: new Date().toLocaleDateString(),
preferredDentist: '',
role: 'dentist',
specialty: '',
isDentist: true
};
users.push(defaultDentist);
}

localStorage.setItem('users', JSON.stringify(users));
}


// Load appointments from localStorage
function loadAppointments() {
if (!localStorage.getItem('appointments')) {
localStorage.setItem('appointments', JSON.stringify([]));
}
}


function loadAdminPageData() {
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const users = JSON.parse(localStorage.getItem('users') || '[]');
const totalAppointments = appointments.length;
const confirmedBookings = appointments.filter(apt => apt.status === 'Confirmed').length;
const pendingRequests = appointments.filter(apt => apt.status === 'Pending').length;
const dentistOnDuty = 'Dr. Estes';

document.getElementById('adminTotalAppointments').textContent = totalAppointments;
document.getElementById('adminConfirmedBookings').textContent = confirmedBookings;
document.getElementById('adminPendingRequests').textContent = pendingRequests;
document.getElementById('adminDentistOnDuty').textContent = dentistOnDuty;
document.getElementById('adminTodayDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

const scheduleBody = document.getElementById('adminScheduleBody');
if (scheduleBody) {
if (appointments.length === 0) {
scheduleBody.innerHTML = '<tr><td colspan="6">No appointments scheduled.</td></tr>';
} else {
scheduleBody.innerHTML = appointments.slice(0, 8).map(apt => `
               <tr>
                   <td>${apt.time}</td>
                   <td>${apt.userName}</td>
                   <td>${apt.dentist}</td>
                   <td>${escapeHtml(apt.service)}</td>
                   <td>${apt.status}</td>
                   <td><button class="btn-secondary small" onclick="alert('Open appointment details');">Details</button></td>
               </tr>
           `).join('');
}
}

const pendingList = document.getElementById('adminPendingList');
if (pendingList) {
const pendingItems = appointments.filter(apt => apt.status === 'Pending');
if (pendingItems.length === 0) {
pendingList.innerHTML = '<div class="pending-item"><div><strong>No pending requests</strong><p>You have no pending bookings at the moment.</p></div></div>';
} else {
pendingList.innerHTML = pendingItems.map(apt => `
               <div class="pending-item">
                   <div>
                       <strong>${apt.userName}</strong>
                       <p>${escapeHtml(apt.service)} on ${new Date(apt.date).toLocaleDateString()}</p>
                   </div>
                   <div>
                       <button class="btn-secondary small">View Request</button>
                       <button class="btn-submit small">Approve</button>
                       <button class="btn-cancel small">Remove</button>
                   </div>
               </div>
           `).join('');
}
}

const activityFeed = document.getElementById('adminPatientFeed');
if (activityFeed) {
const latestUsers = users.slice(-3).reverse();
activityFeed.innerHTML = latestUsers.map(user => `
           <div class="activity-item">
               <strong>${user.name}</strong>
               <p>${user.provider ? 'Joined using ' + user.provider : 'Registered an account'}</p>
           </div>
       `).join('');
}
}

// ===== PASSWORD TOGGLE FUNCTIONS =====

// Toggle password visibility for login
function toggleLoginPassword() {
const passwordInput = document.getElementById('loginPassword');
const toggleIcon = document.getElementById('toggleLoginPassword');

if (passwordInput.type === 'password') {
passwordInput.type = 'text';
toggleIcon.className = 'bx bx-show';
} else {
passwordInput.type = 'password';
toggleIcon.className = 'bx bx-hide';
}
}

// Toggle password visibility for register password
function toggleRegisterPassword() {
const passwordInput = document.getElementById('registerPassword');
const toggleIcon = document.getElementById('toggleRegisterPassword');

if (passwordInput.type === 'password') {
passwordInput.type = 'text';
toggleIcon.className = 'bx bx-show';
} else {
passwordInput.type = 'password';
toggleIcon.className = 'bx bx-hide';
}
}

// Toggle password visibility for register confirm password
function toggleRegisterConfirmPassword() {
const passwordInput = document.getElementById('registerConfirmPassword');
const toggleIcon = document.getElementById('toggleRegisterConfirmPassword');

if (passwordInput.type === 'password') {
passwordInput.type = 'text';
toggleIcon.className = 'bx bx-show';
} else {
passwordInput.type = 'password';
toggleIcon.className = 'bx bx-hide';
}
}

function removeProfileAvatar() {
const currentUserData = localStorage.getItem('currentUser');
if (!currentUserData) return;

const currentUser = JSON.parse(currentUserData);
delete currentUser.avatar;
localStorage.setItem('currentUser', JSON.stringify(currentUser));
displayUserProfile();

const avatarInput = document.getElementById('editProfileAvatar');
if (avatarInput) avatarInput.value = '';

showProfileMessage('Profile picture removed.', 'success');
}

function handleLoginShowPassword() {
const passwordInput = document.getElementById('loginPassword');
const checkbox = document.getElementById('showLoginPasswordCheckbox');
if (!passwordInput || !checkbox) return;
passwordInput.type = checkbox.checked ? 'text' : 'password';
}

function handleRegisterShowPasswords() {
const passwordInput = document.getElementById('registerPassword');
const confirmPasswordInput = document.getElementById('registerConfirmPassword');
const checkbox = document.getElementById('showRegisterPasswordsCheckbox');
if (!passwordInput || !confirmPasswordInput || !checkbox) return;
const type = checkbox.checked ? 'text' : 'password';
passwordInput.type = type;
confirmPasswordInput.type = type;
}

// ===== FORGOT PASSWORD FUNCTIONS =====
// Show forgot password modal
function showForgotPassword() {
document.getElementById('forgotPasswordModal').style.display = 'block';
document.getElementById('resetMessage').innerHTML = '';
document.getElementById('forgotPasswordForm').reset();
}

// Close forgot password modal
function closeForgotPasswordModal() {
document.getElementById('forgotPasswordModal').style.display = 'none';
}

// Handle forgot password form submission
function handleForgotPassword(e) {
e.preventDefault();

const email = document.getElementById('resetEmail').value;
const users = JSON.parse(localStorage.getItem('users') || '[]');
const user = users.find(u => u.email === email);

const messageDiv = document.getElementById('resetMessage');

if (user) {
// In a real application, you would send an email here
// For this demo, we'll just show a success message
messageDiv.innerHTML = '<div class="message success">Password reset link sent to your email!</div>';
messageDiv.style.display = 'block';

// Clear the form after a delay
setTimeout(() => {
closeForgotPasswordModal();
}, 3000);
} else {
messageDiv.innerHTML = '<div class="message error">Email address not found!</div>';
messageDiv.style.display = 'block';
}
}

// ===== PROPER SOCIAL LOGIN FUNCTIONS =====
let currentSocialProvider = '';
let isSocialRegistration = false;

function socialLogin(provider) {
currentSocialProvider = provider;
isSocialRegistration = false;

// Update modal title
document.getElementById('socialModalTitle').textContent = `Login with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;
document.getElementById('socialModalDesc').textContent = `Sign in with your ${provider} account`;
document.getElementById('socialSubmitBtn').textContent = 'Login';

// Clear form
document.getElementById('socialLoginForm').reset();
document.getElementById('socialMessage').innerHTML = '';

// Show modal
document.getElementById('socialLoginModal').style.display = 'flex';
}

function socialRegister(provider) {
currentSocialProvider = provider;
isSocialRegistration = true;

// Update modal title
document.getElementById('socialModalTitle').textContent = `Create Account with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`;
document.getElementById('socialModalDesc').textContent = `Sign up with your ${provider} account`;
document.getElementById('socialSubmitBtn').textContent = 'Create Account';

// Clear form
document.getElementById('socialLoginForm').reset();
document.getElementById('socialMessage').innerHTML = '';

// Show modal
document.getElementById('socialLoginModal').style.display = 'flex';
}

function closeSocialLoginModal() {
document.getElementById('socialLoginModal').style.display = 'none';
currentSocialProvider = '';
isSocialRegistration = false;
}

function handleSocialSubmit(e) {
e.preventDefault();

const name = document.getElementById('socialName').value.trim();
const email = document.getElementById('socialEmail').value.trim();
const phone = document.getElementById('socialPhone').value.trim();

if (!name || !email || !phone) {
showSocialMessage('Please fill in all fields', 'error');
return;
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
showSocialMessage('Please enter a valid email', 'error');
return;
}

const users = JSON.parse(localStorage.getItem('users') || '[]');
let user = users.find(u => u.email === email);

if (user && !isSocialRegistration) {
// User exists, log them in
localStorage.setItem('currentUser', JSON.stringify(user));
showSocialMessage(`Welcome back, ${user.name}!`, 'success');

setTimeout(() => {
closeSocialLoginModal();
displayUserName(user.name);
updateAdminNavVisibility();
switchPage('dashboardPage');
}, 1000);
} 
else if (user && isSocialRegistration) {
// User exists, can't register again
showSocialMessage('Email already registered! Please login instead.', 'error');
return;
} 
else if (!user) {
// New user
const newUser = {
id: Date.now(),
name: name,
email: email,
phone: phone,
password: currentSocialProvider,
provider: currentSocialProvider,
registeredDate: new Date().toLocaleDateString()
};

users.push(newUser);
localStorage.setItem('users', JSON.stringify(users));
localStorage.setItem('currentUser', JSON.stringify(newUser));

showSocialMessage(`Account created successfully with ${currentSocialProvider}!`, 'success');

setTimeout(() => {
closeSocialLoginModal();
displayUserName(newUser.name);
updateAdminNavVisibility();
switchPage('dashboardPage');
}, 1000);
}
}

function showSocialMessage(message, type) {
const messageDiv = document.getElementById('socialMessage');
messageDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
messageDiv.style.display = 'block';
}

// ===== VALIDATION FUNCTIONS =====

// Validate numeric input (prevent alphabetic characters)
function validateNumericInput(input) {
// Remove any non-numeric characters except common phone number symbols
const cleaned = input.value.replace(/[^0-9+\-\(\)\s]/g, '');
if (input.value !== cleaned) {
input.value = cleaned;
}
}

// ===== EMAIL VERIFICATION FUNCTIONS =====

// Generate a 6-digit verification code
function generateVerificationCode() {
return Math.floor(100000 + Math.random() * 900000).toString();
}

// Show email verification modal
function showEmailVerificationModal() {
document.getElementById('emailVerificationModal').style.display = 'flex';
document.getElementById('verificationMessage').innerHTML = '';
const hintElement = document.getElementById('verificationHint');
if (hintElement) {
hintElement.innerHTML = '';
hintElement.style.display = 'none';
}
document.getElementById('emailVerificationForm').reset();
startResendTimer();
}

// Close email verification modal
function closeEmailVerificationModal() {
document.getElementById('emailVerificationModal').style.display = 'none';
localStorage.removeItem('tempUser');
localStorage.removeItem('verificationCode');
localStorage.removeItem('verificationExpiry');
}

// ===== NOTIFICATIONS =====
// Show notification modal and populate list
function showNotifications() {
const modal = document.getElementById('notificationModal');
const list = document.getElementById('notificationList');
if (list) {
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
if (appointments.length === 0) {
list.innerHTML = '<p>No new notifications</p>';
} else {
const items = appointments.slice(-8).reverse().map(a => `
               <div class="notification-item">
                   <strong>${a.userName}</strong>
                   <div style="font-size:13px;color:#666;">${a.service} — ${a.date} ${a.time}</div>
               </div>
           `).join('');
list.innerHTML = items;
}
}
if (modal) modal.style.display = 'block';
}

// Close notification modal
function closeNotifications() {
const modal = document.getElementById('notificationModal');
if (modal) modal.style.display = 'none';
}

// Close modal when clicking outside modal-content
window.addEventListener('click', function (e) {
const modal = document.getElementById('notificationModal');
if (!modal) return;
if (e.target === modal) {
modal.style.display = 'none';
}
});

// Close modals on Escape key
window.addEventListener('keydown', function (e) {
if (e.key === 'Escape') {
closeNotifications();
const otherIds = ['bookingConfirmationModal', 'emailVerificationModal', 'socialLoginModal', 'forgotPasswordModal', 'dentistNotesModal'];
otherIds.forEach(id => {
const m = document.getElementById(id);
if (m) m.style.display = 'none';
});
}
});

// Handle email verification form submission
function handleEmailVerification(e) {
e.preventDefault();

const enteredCode = document.getElementById('verificationCode').value;
const storedCode = localStorage.getItem('verificationCode');
const expiry = localStorage.getItem('verificationExpiry');

if (!storedCode || !expiry) {
showVerificationMessage('Verification session expired. Please register again.', 'error');
closeEmailVerificationModal();
return;
}

if (Date.now() > parseInt(expiry)) {
showVerificationMessage('Verification code has expired. Please request a new one.', 'error');
return;
}

if (enteredCode === storedCode) {
// Complete registration
const tempUser = JSON.parse(localStorage.getItem('tempUser'));
const newUser = {
id: Date.now(),
...tempUser
};

const users = JSON.parse(localStorage.getItem('users') || '[]');
users.push(newUser);
localStorage.setItem('users', JSON.stringify(users));

// Set as logged-in user
localStorage.setItem('currentUser', JSON.stringify(newUser));

// Clean up temporary data
localStorage.removeItem('tempUser');
localStorage.removeItem('verificationCode');
localStorage.removeItem('verificationExpiry');

showVerificationMessage('Email verified successfully! Registration complete. Redirecting to dashboard...', 'success');

setTimeout(() => {
closeEmailVerificationModal();
displayUserName(newUser.name);
updateAdminNavVisibility();
switchPage('dashboardPage');
}, 800);
} else {
showVerificationMessage('Invalid verification code. Please try again.', 'error');
}
}

// Validate verification code input (only numbers)
function validateVerificationCode(input) {
const cleaned = input.value.replace(/[^0-9]/g, '');
if (input.value !== cleaned) {
input.value = cleaned;
}
}

// Resend verification code
function resendVerificationCode() {
const tempUser = JSON.parse(localStorage.getItem('tempUser'));
if (!tempUser) {
showVerificationMessage('Registration session expired. Please register again.', 'error');
closeEmailVerificationModal();
return;
}

const verificationCode = generateVerificationCode();
localStorage.setItem('verificationCode', verificationCode);
localStorage.setItem('verificationExpiry', Date.now() + 10 * 60 * 1000);

console.log(`New verification code for ${tempUser.email}: ${verificationCode}`);
alert(`New verification code sent to ${tempUser.email}. Check console for demo code.`);

showVerificationMessage('New verification code sent!', 'success');
startResendTimer();
}

// Start resend timer
function startResendTimer() {
let timeLeft = 60;
const timerElement = document.getElementById('resendTimer');
const resendButton = document.querySelector('.verification-actions .btn-link');

if (resendButton) resendButton.disabled = true;

const timer = setInterval(() => {
if (timerElement) {
timerElement.textContent = `Resend available in ${timeLeft}s`;
}
timeLeft--;

if (timeLeft < 0) {
clearInterval(timer);
if (timerElement) {
timerElement.textContent = '';
}
if (resendButton) resendButton.disabled = false;
}
}, 1000);
}

// Show verification message
function showVerificationMessage(message, type) {
const messageDiv = document.getElementById('verificationMessage');
messageDiv.innerHTML = `<div class="message ${type}">${message}</div>`;
messageDiv.style.display = 'block';
}

// ================= ADMIN PAGE INTEGRATION =================

// Run ONLY on admin page
window.addEventListener('load', function () {
const isAdminPage = window.location.pathname.includes('admin.html');
if (!isAdminPage) return;

// Ensure shared app data is initialized from the main site
loadUsers();
loadAppointments();

const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

if (!currentUser || !currentUser.isAdmin) {
alert('Admin access only.');
window.location.href = 'index.html';
return;
}

// Set admin name
const adminNameEl = document.getElementById('adminName');
if (adminNameEl) {
adminNameEl.textContent = currentUser.name || 'Admin';
}

// Initialize admin features
adminLoadDashboard();
setupAdminNavigation();
setupSearch();
setupAdminFilters();
updateCalendar();

let adminLastSnapshot = getAdminStorageSnapshot();
function checkAdminStorageChanges() {
const snapshot = getAdminStorageSnapshot();
if (snapshot !== adminLastSnapshot) {
adminLastSnapshot = snapshot;
refreshAdminAfterStorageChange();
}
}

// Refresh admin panels when localStorage changes in another tab/window
window.addEventListener('storage', function (event) {
const watchedKeys = ['appointments', 'users', 'payments', 'services'];
if (!event.key || watchedKeys.includes(event.key)) {
adminLastSnapshot = getAdminStorageSnapshot();
refreshAdminAfterStorageChange();
}
});

// Poll for localStorage updates, useful for same-browser changes and cross-tab updates
setInterval(checkAdminStorageChanges, 5000);

// Auto refresh dashboard summary
setInterval(adminLoadDashboard, 30000);
});

// ===== DENTIST PAGE INTEGRATION =====
window.addEventListener('load', function () {
const isDentistPage = window.location.pathname.includes('dentist.html');
if (!isDentistPage) return;

loadUsers();
loadAppointments();

const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (!currentUser || currentUser.role !== 'dentist') {
alert('Dentist access only.');
window.location.href = 'index.html';
return;
}

const dentistNameEl = document.getElementById('dentistName');
const dashboardNameEl = document.getElementById('dentistDashboardName');
const todayDateEl = document.getElementById('dentistTodayDate');
const profileNameEdit = document.getElementById('dentistProfileNameEdit');
const profileEmailEdit = document.getElementById('dentistProfileEmailEdit');
const profilePhoneEdit = document.getElementById('dentistProfilePhoneEdit');
const profileSpecialtyEdit = document.getElementById('dentistProfileSpecialty');

if (dentistNameEl) dentistNameEl.textContent = currentUser.name || 'Dentist';
if (dashboardNameEl) dashboardNameEl.textContent = currentUser.name || 'Dentist';
if (todayDateEl) todayDateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
if (profileNameEdit) profileNameEdit.value = currentUser.name || '';
if (profileEmailEdit) profileEmailEdit.value = currentUser.email || '';
if (profilePhoneEdit) profilePhoneEdit.value = currentUser.phone || '';
if (profileSpecialtyEdit) profileSpecialtyEdit.value = currentUser.specialty || '';

setupDentistNavigation();
setupDentistFilters();
loadDentistAppointments();
loadDentistPatients();
loadDentistNotes();
dentistLoadDashboard();

const dentistSearch = document.getElementById('dentistSearch');
if (dentistSearch) {
dentistSearch.addEventListener('input', () => {
loadDentistAppointments();
loadDentistPatients();
loadDentistNotes();
});
}
});

function dentistLoadDashboard() {
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
if (!currentUser) return;

const dentistAppointments = appointments.filter(apt => isAssignedDentist(apt.dentist, currentUser.name));

const confirmedToday = dentistAppointments.filter(apt => {
const aptDate = new Date(apt.date);
const today = new Date();
return apt.status === 'Confirmed' && aptDate.toDateString() === today.toDateString();
}).length;
const pendingApprovals = dentistAppointments.filter(apt => apt.status === 'Pending').length;
const upcomingPatients = dentistAppointments.filter(apt => {
const aptDate = new Date(apt.date);
return aptDate >= new Date();
}).length;

document.getElementById('dentistTotalAppointments').textContent = dentistAppointments.length;
document.getElementById('dentistConfirmedToday').textContent = confirmedToday;
document.getElementById('dentistPendingApprovals').textContent = pendingApprovals;
document.getElementById('dentistUpcomingPatients').textContent = upcomingPatients;
}

function setupDentistNavigation() {
const navLinks = document.querySelectorAll('.admin-nav a[data-tab]');
navLinks.forEach(link => {
link.addEventListener('click', function (e) {
e.preventDefault();
const tab = this.getAttribute('data-tab');

document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
this.classList.add('active');

document.querySelectorAll('.admin-main > section[id^="dentist"]').forEach(sec => sec.style.display = 'none');
const targetEl = document.getElementById('dentist' + tab.charAt(0).toUpperCase() + tab.slice(1));
if (targetEl) {
targetEl.style.display = targetEl.classList.contains('admin-panel-grid') ? 'grid' : 'block';
}

if (tab === 'dashboard') dentistLoadDashboard();
if (tab === 'appointments') loadDentistAppointments();
if (tab === 'patients') loadDentistPatients();
if (tab === 'notes') loadDentistNotes();
});
});
}

function setupDentistFilters() {
const appointmentSearch = document.getElementById('dentistAppointmentsSearch');
if (appointmentSearch) appointmentSearch.addEventListener('input', loadDentistAppointments);

const statusFilter = document.getElementById('dentistAppointmentStatusFilter');
if (statusFilter) statusFilter.addEventListener('change', loadDentistAppointments);

const patientSearch = document.getElementById('dentistPatientsSearch');
if (patientSearch) patientSearch.addEventListener('input', loadDentistPatients);
}

function isAssignedDentist(assignedName = '', currentName = '') {
if (!assignedName || !currentName) return false;
const normalizedAssigned = assignedName.toLowerCase();
const normalizedCurrent = currentName.toLowerCase();
return normalizedAssigned === normalizedCurrent || normalizedAssigned.includes(normalizedCurrent) || normalizedCurrent.includes(normalizedAssigned);
}

function loadDentistAppointments(searchTerm = '') {
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (!currentUser) return;

const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const statusFilter = document.getElementById('dentistAppointmentStatusFilter')?.value || '';
const searchValue = searchTerm || document.getElementById('dentistAppointmentsSearch')?.value.trim().toLowerCase() || '';

const filtered = appointments.filter(apt => {
if (!isAssignedDentist(apt.dentist, currentUser.name)) return false;
if (statusFilter && apt.status !== statusFilter) return false;
if (!searchValue) return true;
const term = searchValue.toLowerCase();
return (apt.userName || '').toLowerCase().includes(term) ||
(apt.service || '').toLowerCase().includes(term) ||
(apt.status || '').toLowerCase().includes(term) ||
(apt.date || '').toLowerCase().includes(term);
});

const body = document.getElementById('dentistAppointmentsBody');
if (!body) return;
if (filtered.length === 0) {
body.innerHTML = '<tr><td colspan="6">No appointments match your filters.</td></tr>';
return;
}

body.innerHTML = filtered.map(apt => `
       <tr>
           <td>${apt.date || 'N/A'}</td>
           <td>${apt.time || 'N/A'}</td>
           <td>${apt.userName || 'Unknown'}</td>
           <td>${escapeHtml(apt.service) || 'N/A'}</td>
           <td>
               <select class="status-select" onchange="updateAppointmentStatus(${apt.id}, this.value)">
                   <option value="Pending" ${apt.status === 'Pending' ? 'selected' : ''}>Pending</option>
                   <option value="Confirmed" ${apt.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                   <option value="Canceled" ${apt.status === 'Canceled' ? 'selected' : ''}>Canceled</option>
                   <option value="Reschedule" ${apt.status === 'Reschedule' ? 'selected' : ''}>Reschedule</option>
                   <option value="Finished" ${apt.status === 'Finished' ? 'selected' : ''}>Finished</option>
               </select>
           </td>
           <td><button class="btn-secondary small" onclick="alert('Open notes for ${apt.userName || 'patient'}');">Notes</button></td>
       </tr>
   `).join('');
}

function loadDentistPatients(searchTerm = '') {
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (!currentUser) return;

const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const searchValue = searchTerm || document.getElementById('dentistPatientsSearch')?.value.trim().toLowerCase() || '';
const patients = [];

appointments.forEach(apt => {
if (!isAssignedDentist(apt.dentist, currentUser.name)) return;
const patientKey = `${apt.userName}|${apt.date}|${apt.service}`;
if (!patients.some(item => item.key === patientKey)) {
patients.push({ key: patientKey, name: apt.userName, date: apt.date, service: apt.service, status: apt.status });
}
});

const filtered = patients.filter(item => {
if (!searchValue) return true;
return item.name.toLowerCase().includes(searchValue) || item.service.toLowerCase().includes(searchValue) || (item.status || '').toLowerCase().includes(searchValue);
});

const body = document.getElementById('dentistPatientsBody');
if (!body) return;
if (filtered.length === 0) {
body.innerHTML = '<tr><td colspan="4">No patients found.</td></tr>';
return;
}

body.innerHTML = filtered.map(item => `
       <tr>
           <td>${item.name}</td>
           <td>${item.date}</td>
           <td>${item.service}</td>
           <td>${item.status}</td>
       </tr>
   `).join('');
}

function loadDentistNotes() {
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (!currentUser) return;

const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const notes = appointments.filter(apt => isAssignedDentist(apt.dentist, currentUser.name) && apt.dentistNotes);

const body = document.getElementById('dentistNotesBody');
if (!body) return;
if (notes.length === 0) {
body.innerHTML = '<tr><td colspan="4">No treatment notes written yet.</td></tr>';
return;
}

body.innerHTML = notes.map(item => `
       <tr>
           <td>${item.userName || 'Unknown'}</td>
           <td>${item.date}</td>
           <td>${item.service}</td>
           <td>${item.dentistNotes}</td>
       </tr>
   `).join('');
}

function dentistToggleNotes() {
    loadDentistNotes();
    alert('Notes panel refreshed. Click the Notes tab to review treatment history.');
    // Dentist "Add Note" button should open a modal and let dentist write notes for one of their assigned appointments.
    // Use the same modal UI that patient-side uses: dentistNotesModal + dentistNotesTextarea + dentistNotesSaveBtn.

    // Ensure modal elements exist (patient page has them; dentist page may rely on them).
    const modal = document.getElementById('dentistNotesModal');
    const textarea = document.getElementById('dentistNotesTextarea');

    if (!modal || !textarea) {
        alert('Notes modal elements are missing on this page. Please ensure dentistNotesModal and dentistNotesTextarea exist in dentist.html or index.html loaded view.');
        return;
    }

    // Choose the first assigned appointment that is not finished yet; otherwise choose the most recent finished appointment.
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
        alert('Please login again.');
        return;
    }

    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const assigned = appointments.filter(a => isAssignedDentist(a.dentist, currentUser.name));

    if (assigned.length === 0) {
        alert('No assigned appointments found.');
        return;
    }

    const notFinished = assigned.filter(a => (a.status || '') !== 'Finished');
    const pick = (notFinished.length ? notFinished : assigned)
        .sort((a, b) => {
            const ad = a.date ? new Date(a.date) : new Date(0);
            const bd = b.date ? new Date(b.date) : new Date(0);
            // newest first
            return bd - ad;
        })[0];

    _finishAppointmentPendingId = pick.id;
    textarea.value = pick.dentistNotes || '';

    modal.style.display = 'block';
    // Optional: focus textarea
    setTimeout(() => textarea.focus && textarea.focus(), 0);
}


function saveDentistSettings(event) {
event.preventDefault();
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (!currentUser) return;

const name = document.getElementById('dentistProfileNameEdit')?.value.trim();
const phone = document.getElementById('dentistProfilePhoneEdit')?.value.trim();
const specialty = document.getElementById('dentistProfileSpecialty')?.value.trim();

if (!name) {
document.getElementById('dentistSettingsMessage').innerHTML = '<div class="message error">Name cannot be empty.</div>';
return;
}

currentUser.name = name;
currentUser.phone = phone;
currentUser.specialty = specialty;

const users = JSON.parse(localStorage.getItem('users') || '[]');
const userIndex = users.findIndex(u => u.email === currentUser.email);
if (userIndex !== -1) {
users[userIndex] = currentUser;
localStorage.setItem('users', JSON.stringify(users));
}
localStorage.setItem('currentUser', JSON.stringify(currentUser));
document.getElementById('dentistSettingsMessage').innerHTML = '<div class="message success">Settings updated.</div>';
dentistLoadDashboard();
}

// ===== SAFE ADMIN DASHBOARD (RENAMED to avoid conflict) =====
function adminLoadDashboard(searchTerm = '') {
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const users = JSON.parse(localStorage.getItem('users') || '[]');

const today = new Date();
const rangeFilter = document.getElementById('adminDashboardRangeFilter')?.value || 'today';
const statusFilter = document.getElementById('adminDashboardStatusFilter')?.value || '';

const todayAppointments = appointments.filter(apt => {
const appointmentDate = new Date(apt.date);
if (isNaN(appointmentDate)) return false;
const normalizedStatus = (apt.status || '').trim();
if (statusFilter && normalizedStatus !== statusFilter) return false;
switch (rangeFilter) {
case 'week': {
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay());
startOfWeek.setHours(0, 0, 0, 0);
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6);
endOfWeek.setHours(23, 59, 59, 999);
return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
}
case 'month':
return appointmentDate.getMonth() === today.getMonth() && appointmentDate.getFullYear() === today.getFullYear();
default:
return appointmentDate.toLocaleDateString('en-CA') === today.toLocaleDateString('en-CA');
}
});

const rangeLabel = rangeFilter === 'today'
? today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
: rangeFilter === 'week'
? (() => {
const startOfWeek = new Date(today);
startOfWeek.setDate(today.getDate() - today.getDay());
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6);
return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
})()
: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const overviewLabel = document.getElementById('adminTodayDate');
if (overviewLabel) {
overviewLabel.textContent = rangeLabel;
}

const totalAppointments = todayAppointments.length;
const confirmedBookings = todayAppointments.filter(a => a.status === 'Confirmed').length;
const pendingRequests = appointments.filter(a => a.status === 'Pending').length;

// Stats
document.getElementById('adminTotalAppointments').textContent = totalAppointments;
document.getElementById('adminConfirmedBookings').textContent = confirmedBookings;
document.getElementById('adminPendingRequests').textContent = pendingRequests;

updateTodaySchedule(todayAppointments, searchTerm);
updatePendingRequests(appointments.filter(a => a.status === 'Pending'), searchTerm);
updateActivityFeed(users, appointments);
}


// ===== NAVIGATION =====
function setupAdminNavigation() {
const navLinks = document.querySelectorAll('.admin-nav a[data-tab]');
navLinks.forEach(link => {
link.addEventListener('click', function (e) {
e.preventDefault();
const tab = this.getAttribute('data-tab');

document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
this.classList.add('active');

            // Map admin tab -> section id in your admin.html
            // Hide only the sidebar-mapped tab panels.
            // IMPORTANT: admin.html also contains extra dashboard blocks (schedule/calendar/pending/activity)
            // that intentionally live inside .admin-main but are not part of the sidebar tab mapping.
            // Keep those extra dashboard sections visible only for the dashboard tab.
const sectionMap = {
dashboard: 'adminDashboard',
appointments: 'adminAppointments',
staff: 'adminStaff',
patients: 'adminPatients',
services: 'adminServices',
payments: 'adminPayments',
settings: 'adminSettings'
};

document.querySelectorAll('.admin-main > section').forEach(sec => {
    const id = sec.id;
    if (id && Object.values(sectionMap).includes(id)) {
        sec.style.display = 'none';
    }
});

const targetId = sectionMap[tab] || 'adminDashboard';
const targetEl = document.getElementById(targetId);

if (targetEl) {
    // use grid display for panel-grid elements
    if (targetEl.classList.contains('admin-panel-grid')) {
        targetEl.style.display = 'grid';
    } else {
        targetEl.style.display = 'block';
    }
}

const dashboardPanels = document.querySelectorAll('.admin-main > section:not([id])');
if (tab === 'dashboard') {
    dashboardPanels.forEach(sec => {
        sec.style.display = sec.classList.contains('admin-panel-grid') ? 'grid' : 'block';
    });
} else {
    dashboardPanels.forEach(sec => {
        sec.style.display = 'none';
    });
}

// Call specific loaders for known tabs
if (tab === 'dashboard') adminLoadDashboard();
if (tab === 'appointments') loadAllAppointments();
if (tab === 'patients') loadPatients();
if (tab === 'staff') { setStaffView('data'); }
if (tab === 'services') loadServices();
if (tab === 'payments') loadPayments();
if (tab === 'settings') loadSettings();
});
});

// Ensure initial visible panel matches the pre-marked active link
const active = document.querySelector('.admin-nav a[data-tab].active');
const initialTab = active ? active.getAttribute('data-tab') : 'dashboard';
const initialClick = document.querySelector(`.admin-nav a[data-tab="${initialTab}"]`);
if (initialClick && !initialClick.dataset._bbInit) {
initialClick.dataset._bbInit = '1';
initialClick.click();
}
}



// ===== SEARCH =====
function getActiveAdminTab() {
const activeLink = document.querySelector('.admin-nav a.active');
return activeLink ? activeLink.getAttribute('data-tab') : 'dashboard';
}

function getSearchValue(id) {
const input = document.getElementById(id);
return input ? input.value.trim().toLowerCase() : '';
}

function getAdminStorageSnapshot() {
const keys = ['appointments', 'users', 'payments', 'services'];
return keys.map(key => localStorage.getItem(key) || '').join('||');
}

function setupSearch() {
const searchInput = document.getElementById('adminSearch');
if (!searchInput) return;

searchInput.addEventListener('input', function () {
const searchTerm = this.value.trim().toLowerCase();
switch (getActiveAdminTab()) {
case 'appointments':
loadAllAppointments(searchTerm);
break;
case 'patients':
loadPatients(searchTerm);
break;
case 'staff':
loadStaff(searchTerm);
break;
case 'services':
loadServices(searchTerm);
break;
case 'payments':
loadPayments(searchTerm);
break;
default:
adminLoadDashboard(searchTerm);
break;
}
});
}

function setupAdminFilters() {
const appointmentSearch = document.getElementById('adminAppointmentsSearch');
if (appointmentSearch) {
appointmentSearch.addEventListener('input', () => loadAllAppointments());
}

const appointmentStatus = document.getElementById('adminAppointmentStatusFilter');
if (appointmentStatus) {
appointmentStatus.addEventListener('change', () => loadAllAppointments());
}

const patientSearch = document.getElementById('adminPatientsSearch');
if (patientSearch) {
patientSearch.addEventListener('input', () => loadPatients());
}

const staffSearch = document.getElementById('adminStaffSearch');
if (staffSearch) {
staffSearch.addEventListener('input', () => loadStaff());
}

const servicesSearch = document.getElementById('adminServicesSearch');
if (servicesSearch) {
servicesSearch.addEventListener('input', () => loadServices());
}

const paymentsSearch = document.getElementById('adminPaymentsSearch');
if (paymentsSearch) {
paymentsSearch.addEventListener('input', () => loadPayments());
}
const paymentsStatus = document.getElementById('adminPaymentsStatusFilter');
if (paymentsStatus) {
paymentsStatus.addEventListener('change', () => loadPayments());
}
}


// ===== TODAY SCHEDULE =====
function updateTodaySchedule(appointments, searchTerm = '') {
const scheduleBody = document.getElementById('adminScheduleBody');
if (!scheduleBody) return;

const statusFilter = document.getElementById('adminDashboardStatusFilter')?.value || '';
const filtered = appointments.filter(a => {
const normalizedSearch = searchTerm.toLowerCase();
const matchesSearch = !searchTerm ||
a.userName.toLowerCase().includes(normalizedSearch) ||
a.service.toLowerCase().includes(normalizedSearch) ||
(a.dentist || '').toLowerCase().includes(normalizedSearch) ||
(a.status || '').toLowerCase().includes(normalizedSearch);
const matchesStatus = !statusFilter || a.status === statusFilter;
return matchesSearch && matchesStatus;
});

if (filtered.length === 0) {
scheduleBody.innerHTML = '<tr><td colspan="6">No appointments today.</td></tr>';
return;
}

scheduleBody.innerHTML = filtered.map(a => `
       <tr>
           <td>${a.time}</td>
           <td>${a.userName}</td>
           <td>${a.dentist}</td>
           <td>${a.service}</td>
           <td>${a.status}</td>
           <td>
               <button onclick="viewAppointmentDetails(${a.id})">View</button>
               <button onclick="toggleStatus(${a.id}, '${a.status}')">Toggle</button>
           </td>
       </tr>
   `).join('');
}


// ===== PENDING =====
function updatePendingRequests(pending, searchTerm = '') {
const list = document.getElementById('adminPendingList');
if (!list) return;

const filtered = pending.filter(a =>
a.userName.toLowerCase().includes(searchTerm)
);

if (filtered.length === 0) {
list.innerHTML = `<p>No pending requests</p>`;
return;
}

list.innerHTML = filtered.map(a => `
       <div>
           <strong>${a.userName}</strong>
           <p>${a.service}</p>
           <button onclick="approveAppointment(${a.id})">Approve</button>
           <button onclick="cancelAppointment(${a.id})">Cancel</button>
       </div>
   `).join('');
}


// ===== ACTIVITY =====
function updateActivityFeed(users, appointments) {
const feed = document.getElementById('adminPatientFeed');
if (!feed) return;

const recent = users.slice(-3).reverse();

feed.innerHTML = recent.map(u => `
       <div>
           <strong>${u.name}</strong>
           <p>Registered</p>
       </div>
   `).join('');
}


// ===== APPOINTMENTS =====
function loadAllAppointments(searchTerm = '') {
updateAppointmentsLabel();
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const tbody = document.getElementById('adminAllAppointmentsBody');
if (!tbody) return;

const term = (searchTerm || getSearchValue('adminAppointmentsSearch')).trim().toLowerCase();
const statusFilter = (document.getElementById('adminAppointmentStatusFilter')?.value || '').toLowerCase();
const monthFilter = (document.getElementById('adminMonthSelect')?.value || '').toLowerCase();
const yearFilter = (document.getElementById('adminYearSelect')?.value || '').trim();

const filtered = appointments.filter(a => {
const apptDate = a.date || '';
const appointmentDate = apptDate ? new Date(apptDate) : null;
const patientName = (a.userName || a.user || '').toLowerCase();
const dentist = (a.dentist || '').toLowerCase();
const service = (a.service || '').toLowerCase();
const status = (a.status || '').toLowerCase();
const apptId = a.id ? ('A' + String(a.id).slice(-4)).toLowerCase() : '';

if (statusFilter && status !== statusFilter) return false;
if (monthFilter) {
const monthName = appointmentDate ? appointmentDate.toLocaleString('en-US', { month: 'long' }).toLowerCase() : '';
if (monthName !== monthFilter) return false;
}
if (yearFilter && appointmentDate) {
if (appointmentDate.getFullYear() !== Number(yearFilter)) return false;
}

if (!term) return true;
return (
patientName.includes(term) ||
dentist.includes(term) ||
service.includes(term) ||
status.includes(term) ||
apptId.includes(term) ||
apptDate.toLowerCase().includes(term)
);
});

if (filtered.length === 0) {
tbody.innerHTML = '<tr><td colspan="8">No appointments match this filter.</td></tr>';
return;
}

tbody.innerHTML = filtered.map((a, idx) => {
const apptId = a.id ? ('A' + String(a.id).slice(-4)) : ('A' + String(1000 + idx));
const patientId = a.userId ? ('P' + String(a.userId).slice(-3)) : 'P000';
const apptDate = a.date || '';
const dentist = a.dentist || '';
const service = a.service || '';
const status = a.status || '';
const patientName = a.userName || a.user || 'Unknown';
const statusClass = status.toLowerCase().replace(/\s+/g, '-') || 'pending';

return `
       <tr>
           <td>${idx + 1}</td>
           <td>${apptId}</td>
           <td>${apptDate}</td>
           <td>${patientId}</td>
           <td>${patientName}</td>
           <td>${dentist}</td>
           <td>${service}</td>
           <td><span class="status-badge status-badge--${statusClass}">${status.toUpperCase()}</span></td>
       </tr>
   `;
}).join('');
}

function updateAppointmentsLabel() {
const monthValue = document.getElementById('adminMonthSelect')?.value || '';
const yearValue = document.getElementById('adminYearSelect')?.value || '';
const label = document.getElementById('adminAppointmentsMonthLabel');
if (!label) return;
label.textContent = monthValue ? `${monthValue} ${yearValue}` : yearValue || 'All Dates';
}


// ===== PATIENTS =====
function loadPatients(searchTerm = '') {
const users = JSON.parse(localStorage.getItem('users') || '[]');
const tbody = document.getElementById('adminPatientsBody');
if (!tbody) return;

const term = (searchTerm || getSearchValue('adminPatientsSearch')).trim().toLowerCase();
const patients = users.filter(u => u.role === 'patient')
    .filter(p => {
        if (!term) return true;
        return [p.name, p.email, p.phone, p.registeredDate]
            .filter(Boolean)
            .some(value => value.toLowerCase().includes(term));
    });

if (patients.length === 0) {
tbody.innerHTML = '<tr><td colspan="4">No patients found.</td></tr>';
return;
}

tbody.innerHTML = patients.map(p => {
const joined = p.registeredDate || 'N/A';

return `
   <tr>
       <td>${p.name}</td>
       <td>${p.email}</td>
       <td>${p.phone || 'N/A'}</td>
       <td>${joined}</td>
   </tr>
`;
}).join('');
}


// ===== STAFF =====
function getDefaultStaff() {
return [
{ code: 'D001', name: 'Estes, Mark George', role: 'Dentist', email: 'estes.mark@odbs.com', primaryContact: '0917-123-4567', secondaryContact: '0933-456-7890', license: 'MD-482917', specialization: 'Orthodontist', salary: '₱150,000', employed: 'February 3, 2019' },
{ code: 'D002', name: 'Lee, Chou Xielin', role: 'Dentist', email: 'lee.chou@odbs.com', primaryContact: '0918-234-5678', secondaryContact: '0944-567-8901', license: 'DR-915638', specialization: 'Endodontist', salary: '₱130,000', employed: 'June 21, 2017' },
{ code: 'D003', name: 'Strange, Denis Remez', role: 'Dentist', email: 'strange.denis@odbs.com', primaryContact: '0919-345-6789', secondaryContact: '0955-678-9012', license: 'MED-274859', specialization: 'Pediatric Dentist', salary: '₱130,000', employed: 'May 30, 2018' },
{ code: 'D004', name: 'Lim, Aaron Paolo', role: 'Dentist', email: 'lim.aaron@odbs.com', primaryContact: '0920-456-7890', secondaryContact: '0966-789-0123', license: 'DR-774521', specialization: 'Oral Surgeon', salary: '₱140,000', employed: 'March 10, 2020' },
{ code: 'D005', name: 'Rafaela, Maria Luisa', role: 'Dentist', email: 'rafaela.maria@odbs.com', primaryContact: '0921-567-8901', secondaryContact: '0977-890-1234', license: 'DR-660233', specialization: 'Prosthodontist', salary: '₱145,000', employed: 'January 15, 2016' },
{ code: 'D006', name: 'Alvin, Jerome', role: 'Dentist', email: 'alvin.jerome@odbs.com', primaryContact: '0922-678-9012', secondaryContact: '0988-901-2345', license: 'DR-558412', specialization: 'Periodontist', salary: '₱135,000', employed: 'August 2, 2018' },
{ code: 'CS101', name: 'Garcia, Mae', role: 'Clinic Staff', email: 'garcia.mae@odbs.com', primaryContact: '0915-111-2222', secondaryContact: '', license: '', specialization: 'Clinic Assistant', salary: '₱35,000', employed: 'April 2, 2019' },
{ code: 'CS102', name: 'Santos, Juan', role: 'Clinic Staff', email: 'santos.juan@odbs.com', primaryContact: '0916-333-4444', secondaryContact: '', license: '', specialization: 'Receptionist', salary: '₱28,000', employed: 'August 1, 2020' }
];
}

let adminStaffView = 'data';

function getDefaultStaffSchedule() {
const storedSchedules = JSON.parse(localStorage.getItem('staffSchedules') || '[]');
if (storedSchedules.length > 0) {
return storedSchedules;
}

const defaultSchedules = [
{ id: 'S001', day: 'Monday', dentist: 'Dr. Estes', timeIn: '08:00', timeOut: '17:00' },
{ id: 'S002', day: 'Tuesday', dentist: 'Dr. Strange', timeIn: '08:00', timeOut: '17:00' },
{ id: 'S003', day: 'Wednesday', dentist: 'Dr. Lee', timeIn: '08:00', timeOut: '17:00' },
{ id: 'S004', day: 'Thursday', dentist: 'Dr. Alvin', timeIn: '08:00', timeOut: '17:00' },
{ id: 'S005', day: 'Friday', dentist: 'Dr. Rafaela', timeIn: '08:00', timeOut: '17:00' }
];

localStorage.setItem('staffSchedules', JSON.stringify(defaultSchedules));
return defaultSchedules;
}

function setStaffView(view) {
const validViews = ['data', 'contacts', 'schedule'];
adminStaffView = validViews.includes(view) ? view : 'data';

document.querySelectorAll('.admin-info-buttons button').forEach(button => {
button.classList.toggle('active', button.dataset.staffView === adminStaffView);
});

const title = document.getElementById('adminStaffTableTitle');
const subtitle = document.getElementById('adminStaffHeaderSubtitle');
const searchInput = document.getElementById('adminStaffSearch');

if (title) {
title.textContent = adminStaffView === 'contacts'
? 'CONTACTS INFORMATION'
: adminStaffView === 'schedule'
? 'STAFF SCHEDULE'
: 'DENTIST & STAFF DATA';
}

if (subtitle) {
subtitle.textContent = adminStaffView === 'contacts'
? 'Showing contact records'
: adminStaffView === 'schedule'
? 'Showing staff schedule'
: 'Showing all dentist & staff';
}

if (searchInput) {
searchInput.value = '';
searchInput.placeholder = adminStaffView === 'contacts'
? 'Search contacts'
: adminStaffView === 'schedule'
? 'Search schedule'
: 'Search staff';
}

const roleFilter = document.getElementById('adminStaffRoleFilter');
if (adminStaffView === 'data' && roleFilter) {
roleFilter.value = '';
}

loadStaff();
}

function renderStaffTableHeader(view) {
const thead = document.getElementById('adminStaffTableHead');
if (!thead) return;

let headerHtml = '';
if (view === 'contacts') {
headerHtml = `
           <tr>
               <th>CODE</th>
               <th>NAME</th>
               <th>CONTACT NUMBER 1</th>
               <th>CONTACT NUMBER 2</th>
               <th>EMAIL ADDRESS</th>
               <th>ACTION</th>
           </tr>
       `;
} else if (view === 'schedule') {
headerHtml = `
           <tr>
               <th>DAY</th>
               <th>DENTIST ON DUTY</th>
               <th>TIME-IN</th>
               <th>TIME-OUT</th>
               <th>ACTION</th>
           </tr>
       `;
} else {
headerHtml = `
           <tr>
               <th>CODE</th>
               <th>NAME</th>
               <th>LICENSE #</th>
               <th>SPECIALIZATION</th>
               <th>SALARY</th>
               <th>DATE EMPLOYED</th>
               <th>ACTION</th>
           </tr>
       `;
}

thead.innerHTML = headerHtml;
}

function loadStaff(searchTerm = '') {
const view = adminStaffView || 'data';
renderStaffTableHeader(view);

if (view === 'schedule') {
const schedules = getDefaultStaffSchedule();
const term = (searchTerm || getSearchValue('adminStaffSearch')).trim().toLowerCase();
const filteredSchedules = schedules.filter(s => {
if (!term) return true;
return [s.day, s.dentist, s.timeIn, s.timeOut]
.filter(Boolean)
.some(value => value.toLowerCase().includes(term));
});
renderStaffSchedule(filteredSchedules);
return;
}

const storedStaff = JSON.parse(localStorage.getItem('staff') || '[]');
const tbody = document.getElementById('adminStaffBody');
if (!tbody) return;

let staff = storedStaff;
if (staff.length === 0) {
staff = getDefaultStaff();
localStorage.setItem('staff', JSON.stringify(staff));
}

const defaultStaff = getDefaultStaff();
staff = staff.map(s => {
const fallback = defaultStaff.find(d => d.code === s.code) || {};
return {
role: s.role || fallback.role || (s.code?.toUpperCase().startsWith('CS') ? 'Clinic Staff' : 'Dentist'),
email: s.email || fallback.email || '',
primaryContact: s.primaryContact || fallback.primaryContact || '',
secondaryContact: s.secondaryContact || fallback.secondaryContact || '',
license: s.license || fallback.license || '',
specialization: s.specialization || fallback.specialization || '',
salary: s.salary || fallback.salary || '',
employed: s.employed || fallback.employed || '',
...s
};
});

const roleFilter = (document.getElementById('adminStaffRoleFilter')?.value || '');
if (view !== 'schedule' && roleFilter) {
staff = staff.filter(s => (s.role || '').toLowerCase() === roleFilter.toLowerCase());
}

const headerSubtitle = document.getElementById('adminStaffHeaderSubtitle');
if (headerSubtitle && view !== 'schedule') {
headerSubtitle.textContent = roleFilter ? `Showing ${roleFilter}` : 'Showing All Staff';
}

const term = (searchTerm || getSearchValue('adminStaffSearch')).trim().toLowerCase();
if (term) {
staff = staff.filter(s => {
const values = view === 'contacts'
? [s.code, s.name, s.email, s.primaryContact, s.secondaryContact]
: [s.code, s.name, s.license, s.specialization, s.salary, s.employed];
return values.filter(Boolean).some(value => value.toLowerCase().includes(term));
});
}

renderStaff(staff);
}

function renderStaff(staff) {
const tbody = document.getElementById('adminStaffBody');
if (!tbody) return;

const view = adminStaffView || 'data';
if (view === 'schedule') {
renderStaffSchedule(staff);
return;
}

if (staff.length === 0) {
let colspan;
if (view === 'schedule') {
colspan = 5;
} else if (view === 'contacts') {
colspan = 6;
} else {
colspan = 7;
}
tbody.innerHTML = `<tr><td colspan="${colspan}">No staff match this filter.</td></tr>`;
return;
}

tbody.innerHTML = staff.map(s => {
if (view === 'contacts') {
return `
               <tr>
                   <td>${s.code}</td>
                   <td>${s.name}</td>
                   <td>${s.primaryContact || ''}</td>
                   <td>${s.secondaryContact || ''}</td>
                   <td>${s.email || ''}</td>
                   <td>
                       <button class="btn-secondary" onclick="openStaffForm('${s.code}')">Edit</button>
                       <button class="btn-secondary btn-alert" onclick="deleteStaff('${s.code}')">Delete</button>
                   </td>
               </tr>
           `;
}

return `
           <tr>
               <td>${s.code}</td>
               <td>${s.name}</td>
               <td>${s.license || ''}</td>
               <td>${s.specialization || ''}</td>
               <td>${s.salary || ''}</td>
               <td>${s.employed || ''}</td>
               <td>
                   <button class="btn-secondary" onclick="openStaffForm('${s.code}')">Edit</button>
                   <button class="btn-secondary btn-alert" onclick="deleteStaff('${s.code}')">Delete</button>
               </td>
           </tr>
       `;
}).join('');
}

function renderStaffSchedule(schedules) {
const tbody = document.getElementById('adminStaffBody');
if (!tbody) return;

if (schedules.length === 0) {
tbody.innerHTML = '<tr><td colspan="5">No schedule entries match this filter.</td></tr>';
return;
}

tbody.innerHTML = schedules.map(s => `
       <tr>
           <td>${s.day}</td>
           <td>${s.dentist}</td>
           <td>${s.timeIn}</td>
           <td>${s.timeOut}</td>
           <td>
               <button class="btn-secondary" onclick="editSchedule('${s.id}')">Edit</button>
               <button class="btn-secondary btn-alert" onclick="deleteSchedule('${s.id}')">Delete</button>
           </td>
       </tr>
   `).join('');
}

function editSchedule(scheduleId) {
const schedules = getDefaultStaffSchedule();
const record = schedules.find(s => s.id === scheduleId);
if (!record) return;

const day = prompt('Day', record.day);
if (!day) return;
const dentist = prompt('Dentist on duty', record.dentist);
if (!dentist) return;
const timeIn = prompt('Time-in', record.timeIn);
if (!timeIn) return;
const timeOut = prompt('Time-out', record.timeOut);
if (!timeOut) return;

record.day = day;
record.dentist = dentist;
record.timeIn = timeIn;
record.timeOut = timeOut;

localStorage.setItem('staffSchedules', JSON.stringify(schedules));
loadStaff();
}

function deleteSchedule(scheduleId) {
if (!confirm('Delete this schedule entry?')) return;
const schedules = JSON.parse(localStorage.getItem('staffSchedules') || '[]');
const updated = schedules.filter(s => s.id !== scheduleId);
localStorage.setItem('staffSchedules', JSON.stringify(updated));
loadStaff();
}

function handleStaffActionButton() {
if (adminStaffView === 'schedule') {
openScheduleForm();
return;
}

openStaffForm();
}

function openScheduleForm() {
const schedules = getDefaultStaffSchedule();
const newId = `S${String(schedules.length + 1).padStart(3, '0')}`;
const day = prompt('Day');
if (!day) return;
const dentist = prompt('Dentist on duty');
if (!dentist) return;
const timeIn = prompt('Time In');
if (!timeIn) return;
const timeOut = prompt('Time Out');
if (!timeOut) return;

schedules.push({ id: newId, day, dentist, timeIn, timeOut });
localStorage.setItem('staffSchedules', JSON.stringify(schedules));
loadStaff();
}

function deleteStaff(staffCode) {
const staff = JSON.parse(localStorage.getItem('staff') || '[]');
const updatedStaff = staff.filter(s => s.code !== staffCode);
localStorage.setItem('staff', JSON.stringify(updatedStaff));
loadStaff();
}

function openStaffForm(staffCode = '') {
const staff = JSON.parse(localStorage.getItem('staff') || '[]');
const record = staff.find(s => s.code === staffCode) || null;
document.getElementById('staffFormTitle').textContent = record ? 'Edit Doctor / Staff' : 'Add Doctor / Staff';
document.getElementById('staffEditCode').value = record?.code || '';
document.getElementById('staffCode').value = record?.code || '';
document.getElementById('staffName').value = record?.name || '';
document.getElementById('staffRole').value = record?.role || 'Dentist';
document.getElementById('staffEmail').value = record?.email || '';
document.getElementById('staffLicense').value = record?.license || '';
document.getElementById('staffSpecialization').value = record?.specialization || '';
document.getElementById('staffSalary').value = record?.salary || '';
document.getElementById('staffPrimaryContact').value = record?.primaryContact || '';
document.getElementById('staffSecondaryContact').value = record?.secondaryContact || '';
document.getElementById('staffEmployed').value = record?.employed || '';
document.getElementById('staffEditorCard').style.display = 'block';
}

function saveStaff(event) {
if (event && event.preventDefault) event.preventDefault();
const editCode = document.getElementById('staffEditCode').value;
const code = document.getElementById('staffCode').value.trim();
const name = document.getElementById('staffName').value.trim();
const role = document.getElementById('staffRole').value;
const email = document.getElementById('staffEmail').value.trim();
const license = document.getElementById('staffLicense').value.trim();
const specialization = document.getElementById('staffSpecialization').value.trim();
const salary = document.getElementById('staffSalary').value.trim();
const primaryContact = document.getElementById('staffPrimaryContact').value.trim();
const secondaryContact = document.getElementById('staffSecondaryContact').value.trim();
const employed = document.getElementById('staffEmployed').value.trim();

if (!code || !name || !role) {
alert('Please enter a staff code, name, and role.');
return;
}

const staff = JSON.parse(localStorage.getItem('staff') || '[]');
const existingIndex = staff.findIndex(s => s.code === (editCode || code));
const record = { code, name, role, email, primaryContact, secondaryContact, license, specialization, salary, employed };

if (existingIndex >= 0) {
staff[existingIndex] = record;
} else {
if (staff.some(s => s.code === code)) {
alert('Staff code already exists. Use a unique code.');
return;
}
staff.push(record);
}

localStorage.setItem('staff', JSON.stringify(staff));
loadStaff();
cancelStaffEdit();
}

function cancelStaffEdit() {
const editor = document.getElementById('staffEditorCard');
if (editor) editor.style.display = 'none';
}

function getServiceCatalog() {
const defaultPrices = {
'General Checkup': '₱1,000',
'Root Canal': '₱10,000',
'Teeth Whitening': '₱11,000',
'Extraction': '₱900',
'Cleaning': '₱800',
'Cavity Filling': '₱1,500',
'Braces': '₱50,000',
'Oral Health': '₱1,000',
'Dentures': '₱25,000',
'Gum Treatment': '₱5,000',
'Crown': '₱15,000'
};

const services = JSON.parse(localStorage.getItem('services') || '[]');
if (services.length > 0) return services;

const fromAppointments = JSON.parse(localStorage.getItem('appointments') || '[]')
.map(a => a.service)
.filter((value, index, self) => value && self.indexOf(value) === index);

const catalog = fromAppointments.length > 0 ? fromAppointments : Object.keys(serviceDentistAssignments);
return catalog.map((name, index) => ({
code: `Se${String(index + 1).padStart(2, '0')}`,
name,
desc: `Service for ${name}.`,
price: defaultPrices[name] ? `${defaultPrices[name]} /operation` : '₱0',
duration: '30 mins.'
}));
}

// ===== SERVICES =====
function loadServices(searchTerm = '') {
let services = JSON.parse(localStorage.getItem('services') || '[]');
if (services.length === 0) {
services = getServiceCatalog();
localStorage.setItem('services', JSON.stringify(services));
}

const term = (searchTerm || getSearchValue('adminServicesSearch')).trim().toLowerCase();
if (term) {
services = services.filter(s => {
return [s.code, s.name, s.desc, s.price, s.duration]
.filter(Boolean)
.some(value => value.toLowerCase().includes(term));
});
}

renderServices(services);
}

function renderServices(services) {
const tbody = document.getElementById('adminServicesBody');
const summary = document.getElementById('adminServiceSummary');
if (summary) {
summary.textContent = services.length === 1
? '1 service available'
: `${services.length} services available`;
}
if (!tbody) return;
if (services.length === 0) {
tbody.innerHTML = '<tr><td colspan="5">No services match this search.</td></tr>';
return;
}
tbody.innerHTML = services.map(s => `
       <tr>
           <td>${s.code}</td>
           <td>${s.name}</td>
           <td>${s.desc}</td>
           <td>${s.price}</td>
           <td>${s.duration}</td>
       </tr>
   `).join('');
}

// ===== PAYMENTS =====
function loadPayments(searchTerm = '') {
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
let payments = appointments.map((a, idx) => ({
tx: `T${String(idx + 1).padStart(4, '0')}`,
patient: a.userName || 'Guest',
service: a.service || 'Unknown',
time: a.time || '',
amount: getPriceForService(a.service),
method: a.status === 'Confirmed' ? 'Card' : 'Cash',
status: a.status === 'Confirmed' ? 'Paid' : 'Pending'
}));

localStorage.setItem('payments', JSON.stringify(payments));

const term = (searchTerm || getSearchValue('adminPaymentsSearch')).trim().toLowerCase();
if (term) {
payments = payments.filter(p => {
return [p.tx, p.patient, p.service, p.time, p.amount, p.method, p.status]
.filter(Boolean)
.some(value => value.toLowerCase().includes(term));
});
}

const paymentsStatusFilter = (document.getElementById('adminPaymentsStatusFilter')?.value || '').toLowerCase();
if (paymentsStatusFilter) {
payments = payments.filter(p => (p.status || '').toLowerCase() === paymentsStatusFilter);
}

renderPayments(payments);
}

function getPriceForService(serviceName) {
const priceMap = {
'General Checkup': '₱1,000',
'Root Canal': '₱10,000',
'Teeth Whitening': '₱11,000',
'Extraction': '₱900',
'Cleaning': '₱800',
'Cavity Filling': '₱1,500',
'Braces': '₱50,000',
'Oral Health': '₱1,000',
'Dentures': '₱25,000',
'Gum Treatment': '₱5,000',
'Crown': '₱15,000'
};
return priceMap[serviceName] ? `${priceMap[serviceName]} /service` : '₱0';
}

function renderPayments(payments) {
const tbody = document.getElementById('adminPaymentsBody');
const summary = document.getElementById('adminPaymentSummary');
if (summary) {
summary.textContent = payments.length === 1
? '1 payment record'
: `${payments.length} payment records`;
}
if (!tbody) return;
if (payments.length === 0) {
tbody.innerHTML = '<tr><td colspan="7">No payments match this filter.</td></tr>';
return;
}
tbody.innerHTML = payments.map(p => `
       <tr>
           <td>${p.tx}</td>
           <td>${p.patient}</td>
           <td>${p.service}</td>
           <td>${p.time}</td>
           <td>${p.amount}</td>
           <td>${p.method}</td>
           <td>${p.status}</td>
       </tr>
   `).join('');
}

function refreshServices() {
loadServices();
const summary = document.getElementById('adminServiceSummary');
if (summary) summary.textContent += ' · refreshed';
}

function refreshPayments() {
loadPayments();
const summary = document.getElementById('adminPaymentSummary');
if (summary) summary.textContent += ' · refreshed';
}

// ===== SETTINGS =====
function getDefaultAdminSettings() {
return {
clinicName: 'ODBS Dental Clinic',
clinicEmail: 'contact@odbssite.com',
clinicPhone: '+63 912 345 6789',
clinicAddress: '123 Main Street, City',
clinicHours: 'Mon-Fri 8:00am - 5:00pm',
bookingApproval: 'auto',
defaultDentist: 'Dr. Estes',
notificationEmail: 'notifications@odbssite.com',
preferredPayment: 'card'
};
}

function getAdminSettings() {
const settings = JSON.parse(localStorage.getItem('adminSettings') || 'null');
return settings || getDefaultAdminSettings();
}

function loadSettings() {
const settings = getAdminSettings();
document.getElementById('settingClinicName').value = settings.clinicName || '';
document.getElementById('settingClinicEmail').value = settings.clinicEmail || '';
document.getElementById('settingClinicPhone').value = settings.clinicPhone || '';
document.getElementById('settingClinicAddress').value = settings.clinicAddress || '';
document.getElementById('settingClinicHours').value = settings.clinicHours || '';
document.getElementById('settingBookingApproval').value = settings.bookingApproval || 'auto';
document.getElementById('settingDefaultDentist').value = settings.defaultDentist || '';
document.getElementById('settingNotificationEmail').value = settings.notificationEmail || '';
document.getElementById('settingPaymentMethod').value = settings.preferredPayment || 'card';
const message = document.getElementById('adminSettingsMessage');
if (message) {
message.textContent = '';
}
}

function saveSettings(event) {
if (event && event.preventDefault) event.preventDefault();
const settings = {
clinicName: document.getElementById('settingClinicName').value.trim(),
clinicEmail: document.getElementById('settingClinicEmail').value.trim(),
clinicPhone: document.getElementById('settingClinicPhone').value.trim(),
clinicAddress: document.getElementById('settingClinicAddress').value.trim(),
clinicHours: document.getElementById('settingClinicHours').value.trim(),
bookingApproval: document.getElementById('settingBookingApproval').value,
defaultDentist: document.getElementById('settingDefaultDentist').value.trim(),
notificationEmail: document.getElementById('settingNotificationEmail').value.trim(),
preferredPayment: document.getElementById('settingPaymentMethod').value
};

localStorage.setItem('adminSettings', JSON.stringify(settings));
showAdminSettingsMessage('Settings saved successfully.', true);
}

function resetSettings() {
localStorage.removeItem('adminSettings');
loadSettings();
showAdminSettingsMessage('Settings reset to defaults.', true);
}

function showAdminSettingsMessage(text, success) {
const message = document.getElementById('adminSettingsMessage');
if (!message) return;
message.textContent = text;
message.style.color = success ? '#1fae5b' : '#d9534f';
setTimeout(() => {
if (message.textContent === text) {
message.textContent = '';
}
}, 5000);
}

function toggleFilter() {
const searchInput = document.getElementById('adminAppointmentsSearch');
if (searchInput) {
searchInput.focus();
}
}

function filterTodaySchedule() {
const scheduleFilter = document.getElementById('adminDashboardScheduleFilterPanel');
if (scheduleFilter) {
scheduleFilter.classList.toggle('hidden');
}
}

// Debug helper: seed demo appointments for testing (call from console)
function seedDemoAppointments() {
const base = new Date();
const appts = [
{ id: 1, date: new Date(base.getFullYear(), base.getMonth(), base.getDate()).toISOString().split('T')[0], time: '09:00', userName: 'Alice', dentist: 'Dr. Lee', service: 'Cleaning', status: 'Confirmed' },
{ id: 2, date: new Date(base.getFullYear(), base.getMonth(), base.getDate()+1).toISOString().split('T')[0], time: '10:30', userName: 'Bob', dentist: 'Dr. Estes', service: 'Cavity Filling', status: 'Pending' },
{ id: 3, date: new Date(base.getFullYear(), base.getMonth(), base.getDate()-2).toISOString().split('T')[0], time: '14:00', userName: 'Carol', dentist: 'Dr. Lim', service: 'Extraction', status: 'Canceled' },
{ id: 4, date: new Date(base.getFullYear(), base.getMonth(), base.getDate()+7).toISOString().split('T')[0], time: '11:00', userName: 'Dave', dentist: 'Dr. Rafaela', service: 'Braces', status: 'Reschedule' }
];
localStorage.setItem('appointments', JSON.stringify(appts));
console.log('Seeded demo appointments:', appts);
}
window.seedDemoAppointments = seedDemoAppointments;

function editAppointments() {
alert('Appointment editing is not implemented in this demo. Data is loaded from the main site.');
}

function editStaff() {
openStaffForm();
}

function editServices() {
alert('Service editing is not available in this demo. Service table is built from index app data.');
}

function editPayments() {
alert('Payment editing is not available in this demo. Payment table is generated from appointment history.');
}

function refreshPatients() {
loadPatients();
alert('Patient data refreshed.');
}

function approveAllPending() {
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
let changed = false;
const updated = appointments.map(a => {
if (a.status === 'Pending') {
changed = true;
return { ...a, status: 'Confirmed' };
}
return a;
});
if (changed) {
localStorage.setItem('appointments', JSON.stringify(updated));
adminLoadDashboard();
loadAllAppointments();
alert('All pending appointments approved.');
} else {
alert('No pending appointments to approve.');
}
}

// ===== CALENDAR =====
function initializeCalendar() {
calendarToday = new Date();
calendarMonth = calendarToday.getMonth();
calendarYear = calendarToday.getFullYear();
updateCalendar();
}

function goToPreviousMonth() {
if (calendarMonth === 0) {
calendarMonth = 11;
calendarYear -= 1;
} else {
calendarMonth -= 1;
}
updateCalendar();
}

function goToNextMonth() {
if (calendarMonth === 11) {
calendarMonth = 0;
calendarYear += 1;
} else {
calendarMonth += 1;
}
updateCalendar();
}

function goToCurrentMonth() {
calendarToday = new Date();
calendarMonth = calendarToday.getMonth();
calendarYear = calendarToday.getFullYear();
updateCalendar();
}

function updateCalendar() {
renderCalendar();
}

function refreshAdminAfterStorageChange() {
adminLoadDashboard();
loadAllAppointments();
loadPatients();
loadStaff();
loadServices();
loadPayments();
updateCalendar();
}

function refreshCurrentAdminTab() {
switch (getActiveAdminTab()) {
case 'dashboard':
adminLoadDashboard();
break;
case 'appointments':
loadAllAppointments();
break;
case 'patients':
loadPatients();
break;
case 'staff':
loadStaff();
break;
case 'services':
loadServices();
break;
case 'payments':
loadPayments();
break;
case 'settings':
loadSettings();
break;
}
}

function renderCalendar() {
const header = document.getElementById('calendarHeader');
const grid = document.getElementById('calendarGrid');
if (!header || !grid) return;

const today = new Date();
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]')
.map(a => ({
...a,
dateObj: a.date ? new Date(a.date) : null
}))
.filter(a => a.dateObj instanceof Date && !isNaN(a.dateObj));

const firstOfMonth = new Date(calendarYear, calendarMonth, 1);
const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
const startingWeekday = firstOfMonth.getDay();
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

header.textContent = firstOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
grid.innerHTML = weekDays.map(day => `<div class="weekday">${day}</div>`).join('');

for (let blank = 0; blank < startingWeekday; blank += 1) {
grid.innerHTML += `<div class="calendar-day inactive"></div>`;
}

for (let day = 1; day <= daysInMonth; day += 1) {
const dayDate = new Date(calendarYear, calendarMonth, day);
const dayAppointments = appointments.filter(a => a.dateObj.toDateString() === dayDate.toDateString());
const classes = ['calendar-day'];
if (dayDate.toDateString() === today.toDateString()) {
classes.push('current');
}
if (dayAppointments.length > 0) {
classes.push('booked');
}

const items = dayAppointments.slice(0, 2).map(a => `<div class="calendar-event">${a.service || 'Appointment'}</div>`).join('');
const more = dayAppointments.length > 2 ? `<div class="calendar-more">+${dayAppointments.length - 2} more</div>` : '';

const iso = dayDate.toISOString().split('T')[0];
grid.innerHTML += `
           <div class="${classes.join(' ')}" role="button" tabindex="0" aria-label="${dayDate.toDateString()} ${dayAppointments.length} appointments" onclick="showAppointmentsForDay('${iso}')" data-date="${iso}">
               <div class="day-number">${day}</div>
               <div class="day-events">
                   ${items}
                   ${more}
               </div>
           </div>
       `;
}
}

function showAppointmentsForDay(dateISO) {
const apptTab = document.querySelector('.admin-nav a[data-tab="appointments"]');
if (apptTab) apptTab.click();
const searchInput = document.getElementById('adminAppointmentsSearch');
if (searchInput) searchInput.value = dateISO;
loadAllAppointments(dateISO);
}


// ===== ACTIONS =====
function viewAppointmentDetails(id) {
const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const a = appointments.find(x => x.id == id);
if (a) alert(JSON.stringify(a, null, 2));
}

function toggleStatus(id, status) {
let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const a = appointments.find(x => x.id == id);
if (a) {
a.status = status === 'Confirmed' ? 'Pending' : 'Confirmed';
localStorage.setItem('appointments', JSON.stringify(appointments));
adminLoadDashboard();
}
}

function approveAppointment(id) {
let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const a = appointments.find(x => x.id == id);
if (a) {
    a.status = 'Confirmed';
    localStorage.setItem('appointments', JSON.stringify(appointments));
    adminLoadDashboard();
}
}

function updateAppointmentStatus(id, status) {
let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
const a = appointments.find(x => x.id == id);
if (a) {
    a.status = status;
    localStorage.setItem('appointments', JSON.stringify(appointments));
    loadDentistAppointments();
    dentistLoadDashboard();
}
}