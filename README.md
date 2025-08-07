# Hoos Open

**Hoos Open** is a student-built mobile app that helps UVA students quickly discover the open/closed status, location, and hours of operation of buildings across the university. Whether it's a library, gym, dining hall, or cafe, Hoos Open makes it easy to find where to go and when — all at your fingertips.

This project was built as part of academic coursework for **CS 4720: Mobile Application Development** at the University of Virginia.

---

## Team Members

- Saketh Vangara
- Kaitlyn Song

---

## Purpose

The purpose of **Hoos Open** is to provide UVA students with an intuitive interface to:

- Check real-time open/closed status for campus buildings
- View detailed hours of operation
- Explore facilities by category (Dining, Gym, Academic, etc.)
- Favorite commonly used buildings
- Navigate to detailed information for each location

The app pulls data from a Firebase database that includes real-world building hours, including special formatting (e.g., `"M-F"` or `"Varies: Check schedule"`) and intelligently parses and displays the correct open/closed status in real-time.

---

## Key Features

### Authentication

- Users sign in with their **virginia.edu** email
- Login and sign-up handled via **Firebase Authentication**

### Open/Closed Status & Hours Display

- Buildings display real-time open/closed status based on the current day and time.
- Custom logic handles cases like:
  - `"M-F"` being expanded into individual weekdays
  - `"Varies: Check schedule"` gracefully shown with appropriate fallback formatting

### Building Cards & Filtering

- All buildings are presented as emoji-labeled cards on the home screen (📚 for Libraries, 🥪 for Dining, etc.)
- Users can search for buildings by name
- Filter options include: Show All, Open, Closed
- Tag-based organization (e.g., “24 Hours”, “Popular”, “Coffee”)

### Favorites

- Tap a heart to favorite any building
- Toggle to view only favorites in a dedicated section
- Favorites are stored using local persistent storage

### Detail View

- Tap any building card to view more information
- Includes address, map coordinates, all operating hours, and building category
- Gradient styling with dynamic back navigation and status pill

---

## Tech Stack

### Frontend

- React Native
- Expo

### Backend

- Firebase Authentication
- Firestore 

---

## Dependencies

This project uses:

- React Native (via Expo)
- Firebase (Authentication + Firestore)
- React Navigation
- Expo Linear Gradient
- AsyncStorage (for favorites)
- React Native Gesture Handler
- [See full `package.json` for more details]

### To Install and Run Locally

Before starting, make sure you have the following installed:

- Node.js (v18 or later recommended)
- Expo CLI

You can install Expo CLI globally via:
```bash
npm install -g expo-cli
```

Then, you can run the program with these commands, in order:
```bash
git clone https://github.com/SakethVangara/HoosOpen.git
cd HoosOpen/my-app
npm install
npx expo install
npx expo start
```



