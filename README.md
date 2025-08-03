# 🧠 AI Voice Assistant (Virtual JARVIS)

A AI voice assistant web application built with React, Node.js, Express, MongoDB, and Gemini AI. This assistant listens to your voice, responds intelligently, and allows rich personalization. Inspired by Tony Stark's J.A.R.V.I.S.

## 🚀 Live Demo

🔗 [Live Application](https://virtual-assistant-frontend-asf6.onrender.com/) 
📁 [GitHub Repository](https://github.com/isha-gahlawat/Virtual_Assistant)

---

## 🛠️ Features

- 🎙️ **Real-Time Voice Interaction**  
  Uses Web Speech API for voice recognition and speech synthesis.

- 🔐 **Secure Authentication**  
  JWT-based login system secured with Bcrypt for password hashing.

- 🤖 **Smart Replies via Gemini AI**  
  Integrates Google’s Gemini API to generate intelligent responses to user queries.

- 🧑‍💻 **Assistant Customization**  
  Users can customize assistant’s **name**, **profile image**, and **branding**. Images are handled via **Multer** and **Cloudinary**.

- 💬 **Voice-Based Emailing**  
  Integrated with **Nodemailer** to allow email functionality when user creates and delete account .

- 🧠 **Persistent Storage**  
  MongoDB is used to store user data, preferences, notes, reminders, and assistant settings.

- 📅 **Alarm & Reminder System**  
  Users can schedule and manage voice-based calendar alarms with visual cues and tooltips.

---

## 🧰 Tech Stack

### Frontend
- React
- Tailwind CSS
- Web Speech API
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT & Bcrypt.js (Auth)
- Gemini AI API
- Nodemailer
- Multer + Cloudinary (Media Uploads)

---

## 🖼 UI Highlights

- 🔊 Continuous speech recognition and response interface
- 📆 Year-view calendar with alarm GIF indicators
- 🪄 Animated popups for setting/viewing alarms and notes
- 🧠 Customizable JARVIS-like assistant dashboard
- 🌈 Personalized assistant image, name, and branding

---
## 📁 Project Structure

### **Backend/**
- `.env`
- `.gitignore`
- `gemini.js` – Gemini AI integration
- `index.js` – Main Express server
- `package.json`
- `package-lock.json`
- `sendEmail.js` – Nodemailer integration
- **config/**
  - `cloudinary.js` – Cloudinary config for image upload
  - `db.js` – MongoDB connection
  - `token.js` – JWT helper
- **controllers/**
  - `alarm.js` – Alarm-related controller logic
  - `auth.js` – Authentication routes
  - `multer.js` – Image upload handler
  - `notes.js` – Notes logic
  - `user_controller.js` – User management
- **middlewares/** – Auth and utility middleware
- **models/** – Mongoose schemas
- **public/** – Static files (if any)
- **routes/** – Route definitions

---

### **Frontend/**
- `.gitignore`
- `eslint.config.js`
- `index.html`
- `package.json`
- `package-lock.json`
- **public/**
- **src/**
  - `App.jsx` – Root component
  - `App.css` – Global styles
  - `index.css` – Entry styles
  - `main.jsx` – React root rendering
  - **assets/** – Images, icons, sounds, etc.
  - **context/**
    - `UserCont.jsx` – React Context for user state
  - **Components/**
    - `alarmcalendar.css` – Alarm calendar styles
    - `alarms_page.jsx` – Alarm calendar component
    - `card.jsx` – Generic UI card
    - `cloudFacts.jsx` – Facts bubble component
    - `history.jsx` – History of interactions
    - `note.jsx` – Notes component
    - `suggestion.jsx` – Suggestion cards
  - **pages/**
    - `Costumize.jsx` – Assistant customization (step 1)
    - `Costumize2.jsx` – Assistant customization (step 2)
    - `Home.jsx` – Main assistant interaction UI
    - `Signin.jsx` – Sign-in page
    - `Signup.jsx` – Sign-up page

---
## 📦 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/isha-gahlawat/Virtual_Assistant.git
   cd Virtual_Assistant
   
2. **Install dependencies**
   ```bash 
    cd Frontend
    npm install
    cd  Backend
    npm install

3. **Setup environment**
   ```bash
   MONGODB_URI=your_mongo_connection
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_secret
   GEMINI_API_KEY=your_gemini_api_key
   EMAIL_USER=you@example.com
   EMAIL_PASS=your_email_password
   
3. **Run the app**
   ```bash
    cd frontend   #frontend
    npm run dev

    cd Backend     #Backend
    npm run dev
---

## 🖼️ Screenshots
## 🖼️ Screenshots

### 🏠 Home Page  
<p align="center">
  <img src="Frontend/public/home.png" width="500" height="300" />
</p>

### 🗣️ Voice Notes  
<p align="center">
  <img src="Frontend/public/voice-note.png" width="500" height="300" />
</p>

### ⏰ Alarm Calendar  
<p align="center">
  <img src="Frontend/public/alarm-calendar.png" width="500" height="300" />
</p>

### 🧠 Assistant Customization

#### • Name Customization  
<p align="center">
  <img src="Frontend/public/customization-name.png" width="500" height="300" />
</p>

#### • Image Customization  
<p align="center">
  <img src="Frontend/public/customization-image.png" width="500" height="300" />
</p>

### 📜 Voice Command History  
<p align="center">
  <img src="Frontend/public/history.png" width="500" height="300" />
</p>

### ✉️ Sent Emails View  
<p align="center">
  <img src="Frontend/public/email.jpg" width="500" height="300" />
</p>

### 🔐 Sign In  
<p align="center">
  <img src="Frontend/public/sign-in.png" width="500" height="300" />
</p>

### 🆕 Sign Up  
<p align="center">
  <img src="Frontend/public/sign-up.png" width="500" height="300" />
</p>
