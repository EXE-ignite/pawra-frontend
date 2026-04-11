export const en = {
  // Common
  common: {
    loading: 'Loading...',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    search: 'Search',
    back: 'Back',
    next: 'Next',
    yearsOld: 'years old',
    years: 'Years',
    months: 'Months',
    kg: 'kg',
    today: 'Today',
    loadError: 'Unable to load data',
    processing: 'Processing...',
  },

  // Navigation
  nav: {
    petProfile: 'Pet Profile',
    blog: 'Blog',
    calendar: 'Calendar',
    subscription: 'Subscription',
    login: 'Sign In',
    notifications: 'Notifications',
  },

  // User Dropdown
  userMenu: {
    myProfile: 'My Profile',
    settings: 'Settings',
    logout: 'Sign Out',
    menu: 'User menu',
  },

  // Footer
  footer: {
    copyright: '© 2026 Pawra. All rights reserved.',
    builtWith: 'Built with Next.js & ❤️',
  },

  // Home Page
  home: {
    title: 'Welcome to Pawra 🐾',
    subtitle: 'Your comprehensive pet healthcare management platform',
    healthTracking: 'Health Tracking',
    healthTrackingDesc: 'Keep track of your pet\'s health records, vaccinations, and medical history',
    easyScheduling: 'Easy Scheduling',
    easySchedulingDesc: 'Book and manage appointments with veterinarians effortlessly',
    medicationReminders: 'Medication Reminders',
    medicationRemindersDesc: 'Never miss a dose with automated medication reminders',
    mobileAccess: 'Mobile Access',
    mobileAccessDesc: 'Access your pet\'s information anytime, anywhere',
  },

  // Customer Dashboard
  customerDashboard: {
    title: 'Customer Dashboard',
    welcome: 'Welcome to your dashboard',
  },

  // Pet Owner Dashboard
  dashboard: {
    welcomeBack: 'Welcome back! 👋',
    subtitle: 'Here\'s what\'s happening with your pets today.',
    totalPets: 'Total Pets',
    upcomingAppointments: 'Upcoming Appointments',
    completedVisits: 'Completed Visits',
    pendingPayments: 'Pending Payments',
    myPets: 'My Pets',
    addPet: '+ Add Pet',
    noPets: 'No pets yet',
    noPetsDesc: 'Start by adding your first pet to track their health and appointments.',
    addFirstPet: 'Add Your First Pet',
    upcomingAppointmentsTitle: 'Upcoming Appointments',
    bookAppointment: '+ Book Appointment',
    noAppointments: 'No upcoming appointments',
    noAppointmentsDesc: 'Book an appointment with a veterinarian for your pet\'s health checkup.',
  },

  // Pet Profile
  petProfile: {
    shareProfile: 'Share Profile',
    logEntry: 'Log Entry',
    editProfile: 'Edit Profile',
    active: 'ACTIVE',
    noPets: 'You don\'t have any pets yet',
    noPetsDesc: 'Add your first pet to track their health and appointments.',
    addPet: '+ Add Pet',
    errorLoad: 'Unable to load pet list',
    personalInterests: 'Personal Interests',
    favoriteHobbies: 'FAVORITE HOBBIES',
    favoriteThings: 'FAVORITE THINGS',
    petSummary: 'Pet Summary',
    vaccinationHistory: 'Vaccination History',
    vaccinationSubtitle: 'Full medical immunization record',
    vaccineType: 'VACCINE TYPE',
    dateAdministered: 'DATE ADMINISTERED',
    expirationDate: 'EXPIRATION DATE',
    status: 'STATUS',
    valid: 'Valid',
    dueSoon: 'Due Soon',
    overdue: 'Overdue',
    vaccinationAlert: 'Vaccination Alert',
    notFound: 'Pet not found',
    deletePetTitle: 'Delete Pet',
    deletePetMessage: 'Are you sure you want to delete {name}? This action cannot be undone.',
    years: 'years',
    months: 'months',
  },
  healthRecords: {
    title: 'Health Records',
    upcomingVaccinations: 'Upcoming Vaccinations',
    currentMedications: 'Current Medications',
    soon: 'SOON',
    ok: 'OK',
    overdue: 'OVERDUE',
  },

  // Growth Chart
  growthChart: {
    title: 'Growth Chart',
    currentWeight: 'Current Weight',
    change3mo: 'Change (3mo)',
  },

  // Daily Routine
  dailyRoutine: {
    title: 'Daily Routine',
  },

  // Document Vault
  documentVault: {
    title: 'Document Vault',
    uploadNew: 'Upload New',
  },

  // Appointment Card
  appointment: {
    reschedule: 'Reschedule',
    cancel: 'Cancel',
  },

  // Add Pet Modal
  addPetModal: {
    title: 'Add New Pet 🐾',
    petPhoto: 'Pet Photo',
    clickToSelect: 'Click to select photo',
    photoHint: 'PNG, JPG – max 5MB',
    petName: 'Pet Name',
    petNamePlaceholder: 'e.g. Mochi',
    species: 'Species',
    breed: 'Breed',
    breedPlaceholder: 'e.g. Poodle',
    dateOfBirth: 'Date of Birth',
    dateFormat: 'dd/mm/yyyy',
    furColor: 'Fur Color',
    furColorPlaceholder: 'e.g. Brown White',
    weight: 'Weight (kg)',
    weightPlaceholder: 'e.g. 3.5',
    errorInvalidImage: 'Please select a valid image file.',
    errorImageSize: 'Image must be less than 5MB.',
    errorRequiredFields: 'Please fill in all required fields.',
    errorInvalidDate: 'Invalid date of birth. Please use dd/mm/yyyy format.',
    errorNotLoggedIn: 'Unable to get account info. Please sign in again.',
    errorFailed: 'Failed to add pet. Please try again.',
    adding: 'Adding...',
    addPet: 'Add Pet',
    speciesDog: 'Dog',
    speciesCat: 'Cat',
    speciesBird: 'Bird',
    speciesRabbit: 'Rabbit',
    speciesHamster: 'Hamster',
    speciesOther: 'Other',
  },

  // Edit Pet Modal
  editPetModal: {
    title: 'Edit Pet ✏️',
    errorRequiredFields: 'Please fill in pet name and breed.',
    errorFailed: 'Update failed. Please try again.',
    saving: 'Saving...',
    saveChanges: 'Save Changes',
  },

  // Add Vaccination Modal
  addVaccinationModal: {
    title: 'Add Vaccination',
    subtitle: 'Record a new vaccination history',
    pet: 'Pet',
    selectPet: 'Select pet',
    vaccine: 'Vaccine',
    vaccinePlaceholder: 'e.g. Rabies (3-Year)',
    clinic: 'Clinic',
    clinicPlaceholder: 'e.g. PawCare Clinic',
    date: 'Date',
    errorPet: 'Please select a pet.',
    errorVaccine: 'Please enter vaccine name.',
    errorClinic: 'Please enter clinic name.',
    errorDate: 'Please select a vaccination date.',
    errorFailed: 'Unable to add vaccination record. Please try again.',
    saving: 'Saving...',
    addVaccination: 'Add Vaccination',
  },

  // Add Reminder Modal
  addReminderModal: {
    addTitle: 'Add Reminder',
    editTitle: 'Edit Reminder',
    addSubtitle: 'Schedule a new pet care task',
    editSubtitle: 'Update your pet care task',
    titleLabel: 'Title',
    titlePlaceholder: 'e.g. Morning Feeding, Heartguard Medicine...',
    pet: 'Pet',
    selectPet: 'Select pet',
    priority: 'Priority',
    type: 'Type',
    startDate: 'Start Date',
    time: 'Time',
    recurringReminder: 'Recurring reminder',
    recurringHint: 'Repeat this reminder automatically',
    repeatEvery: 'Repeat every',
    endDate: 'End Date',
    notes: 'Notes (optional)',
    notesPlaceholder: 'Any additional notes...',
    errorTitle: 'Please enter a reminder title.',
    errorPet: 'Please select a pet.',
    errorDate: 'Please select a date.',
    errorUpdate: 'Unable to update reminder. Please try again.',
    errorCreate: 'Unable to create reminder. Please try again.',
    saving: 'Saving...',
    addReminder: 'Add Reminder',
    saveChanges: 'Save Changes',
    feeding: 'Feeding',
    medicine: 'Medicine',
    grooming: 'Grooming',
    other: 'Other',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    none: 'None',
    monthly: 'Monthly',
    yearly: 'Yearly',
  },

  // Reminders Page
  reminders: {
    title: 'Reminders',
    subtitle: 'Manage your pet care schedule and upcoming tasks',
  },

  // Calendar
  calendar: {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    january: 'January', february: 'February', march: 'March', april: 'April',
    may: 'May', june: 'June', july: 'July', august: 'August',
    september: 'September', october: 'October', november: 'November', december: 'December',
    sunday: 'Sunday', monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
    sunAbbr: 'SUN', monAbbr: 'MON', tueAbbr: 'TUE', wedAbbr: 'WED',
    thuAbbr: 'THU', friAbbr: 'FRI', satAbbr: 'SAT',
    events: 'Events',
    today: 'Today',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    noEvents: 'No events',
    noEventsDay: 'No events or tasks scheduled for this day.',
    more: 'more',
    am: 'AM',
    pm: 'PM',
  },

  // Task Sidebar
  taskSidebar: {
    allTasks: 'All Tasks',
    task: 'Task',
    tasks: 'Tasks',
    scheduled: 'scheduled',
    all: '🐾 All',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    healthMilestones: 'Health Milestones',
    inDays: 'In {count} days',
    addTask: 'Add Task',
    editTask: 'Edit task',
    deleteTask: 'Delete task',
  },

  // Auth Modal
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    orUseAccount: 'or use your account',
    orUseEmail: 'or use your email for registration',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot your password?',
    signingIn: 'Signing In...',
    signingUp: 'Signing Up...',
    createAccount: 'Create Account',
    helloFriend: 'Hello, Friend!',
    helloFriendDesc: 'Enter your personal details and start journey with us',
    welcomeBack: 'Welcome Back!',
    welcomeBackDesc: 'To keep connected with us please login with your personal info',
    facebookNotAvailable: 'Facebook login is not available yet',
    googleNotConfigured: 'Google login is not configured',
  },

  // Pet Card
  petCard: {
    yearsOld: 'years old',
  },

  // Add Pet Fab
  addPetFab: {
    addPet: 'Add Pet',
  },

  // Blog
  blog: {
    // Public Blog
    latestArticles: 'Latest Articles',
    loadMore: 'Load More Articles',
    featuredLabel: 'FEATURED POST',
    minRead: 'min read',
    readMore: 'Read More',
    readArrow: 'Read →',
    findAdvice: 'Find Advice',
    searchPlaceholder: 'Search pet advice...',
    popularCategories: 'Popular Categories',
    joinNewsletter: 'Join our pack!',
    newsletterDesc: 'Get the latest pet health tips delivered to your inbox every week.',
    emailPlaceholder: 'Your email address',
    subscribeNow: 'Subscribe Now',
    home: 'Home',
    veterinarySpecialist: 'Veterinary Specialist',
    share: 'Share',
    shareArticle: 'SHARE THIS ARTICLE',
    copyLink: 'Copy link',
    linkCopied: 'Article link copied',
    shareUnavailable: 'Unable to share right now',
    shareOnFacebook: 'Share on Facebook',
    shareOnX: 'Share on X',
    shareOnMessenger: 'Share via Messenger',
    noImage: 'No image',
    noImageAvailable: 'No image available',
    // Category names
    catHealth: 'Health',
    catNutrition: 'Nutrition',
    catTraining: 'Training',
    catBehavior: 'Behavior',
    catGrooming: 'Grooming',
    // Admin Blog
    adminTitle: 'Blog Content Overview',
    totalViews: 'Total Page Views',
    totalPosts: 'Total Blog Posts',
    totalComments: 'Total Comments',
    tableTitle: 'TITLE & IMAGE',
    tableAuthor: 'AUTHOR',
    tableCategory: 'CATEGORY',
    tableStatus: 'STATUS',
    tableDate: 'DATE',
    tableActions: 'ACTIONS',
    noPosts: 'No posts found',
    confirmDelete: 'Are you sure you want to delete this post?',
    searchPostsPlaceholder: 'Search blog posts...',
    filter: 'Filter',
    createPost: 'Create New Post',
    active: 'Active',
  },

  // Language
  language: {
    vi: 'Tiếng Việt',
    en: 'English',
  },
};
