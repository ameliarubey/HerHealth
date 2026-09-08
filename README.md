🌸 HerHealth

A personalized women's health & wellness platform

HerHealth is a full-stack women's health application designed to help users track their menstrual health, understand cycle patterns, record symptoms, explore wellness activities, and access trusted health education.

> **Track your cycle. Understand your patterns. Take better care of yourself.**

## ✨ Features

### 🩷 Cycle Tracking

- Interactive menstrual cycle calendar
- Period tracking
- Cycle phase visualization
- Fertile window tracking
- Ovulation tracking
- Next-period prediction
- Cycle history

### 📊 Health Analytics

- Average cycle length
- Average period duration
- Cycle regularity score
- Cycle-length trends
- Symptom frequency analysis
- Visual health charts
- Downloadable PDF health reports

### 🌿 Wellness

- Guided wellness activities
- Meditation and relaxation exercises
- Gentle yoga and stretching
- Nutrition-focused wellness suggestions
- Evening wind-down activities
- Self-care recommendations

### 📚 Women's Health Library

A curated collection of educational resources covering:

- Menstrual health
- PMS
- Period pain
- Endometriosis
- Women's wellness
- Menstrual cycle education

Resources are linked to trusted healthcare organizations including:

- NHS
- Mayo Clinic
- Cleveland Clinic
- Office on Women's Health

### 🔐 Authentication & Privacy

- Email/password authentication
- Google authentication
- Firebase Authentication
- User-specific health data
- Environment variables for sensitive configuration

### 🎨 User Experience

- Modern health-tech inspired interface
- Responsive design
- Light and dark mode
- Interactive cards and charts
- Soft, accessible visual design
- Clean and intuitive navigation

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite
- Recharts
- Lucide React

### Backend

- Node.js
- Express
- TypeScript

### Database & Authentication

- Firebase Authentication
- Firebase Firestore

### APIs & Libraries

- OpenAI API — optional AI wellness assistant
- jsPDF — PDF report generation
- React Router

---

## 🏗️ Architecture

                    HERHEALTH
                        │
                        ▼
              ┌───────────────────┐
              │   React Frontend  │
              │ TypeScript + Vite │
              └─────────┬─────────┘
                        │
          ┌─────────────┼─────────────┐
          │             │             │
          ▼             ▼             ▼
     Firebase       Express       External
     Auth +         Backend       Healthcare
     Firestore                     Resources


     🚀 Getting Started
1. Clone the repository
git clone https://github.com/ameliarubey/HerHealth.git
cd HerHealth
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file in the project root.

Add your Firebase configuration:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
4. Start the development server
PORT=5173 npm run dev

Open the application at:

http://localhost:5173
