🌸 HerHealth
A personalized women's health & wellness platform

HerHealth is a full-stack women's health application designed to help users understand and manage their menstrual health, track cycle patterns, record symptoms, explore wellness activities, and access trusted educational resources.

The application combines cycle tracking, wellness guidance, analytics, and educational resources in one intuitive platform.
✨ Features
🩷 Cycle Tracking
Interactive menstrual cycle calendar
Period tracking
Cycle phase visualization
Fertile window and ovulation tracking
Next-period prediction
Cycle history
📊 Health Analytics
Average cycle length
Average period duration
Cycle regularity score
Cycle-length trends
Symptom frequency analysis
Downloadable health reports
🌿 Wellness
Guided wellness activities
Meditation and relaxation exercises
Yoga and stretching
Nutrition-focused wellness suggestions
Evening wind-down activities
Self-care recommendations
📚 Women's Health Library
Curated women's health resources
Information about menstrual health and PMS
Period pain resources
Endometriosis education
Resources from trusted healthcare organizations including:
NHS
Mayo Clinic
Cleveland Clinic
Office on Women's Health
🔐 Authentication & Privacy
Email/password authentication
Google authentication
Firebase Authentication
User-specific health data
Environment variables for sensitive configuration
🎨 Modern User Interface
Responsive design
Light and dark mode
Modern health-tech inspired interface
Soft, accessible visual design
Interactive cards and charts
🛠️ Tech Stack
Frontend
React
TypeScript
Tailwind CSS
Vite
Recharts
Backend
Node.js
Express
TypeScript
Database & Authentication
Firebase Authentication
Firebase Firestore
APIs & Libraries
OpenAI API — optional AI wellness assistant
jsPDF — health report generation
React Router
Lucide React
📁 Project Structure
HerHealth/
│
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── lib/
│       └── index.css
│
├── server/
│   ├── index.ts
│   └── routes.ts
│
├── shared/
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
🚀 Getting Started
1. Clone the repository
git clone https://github.com/ameliarubey/HerHealth.git
cd HerHealth
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file in the project root and add the required Firebase configuration.

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

For the optional AI assistant:

OPENAI_API_KEY=your_openai_api_key

Note: The AI assistant is optional. The core HerHealth application works without an OpenAI API key.

4. Start the development server
PORT=5173 npm run dev

Then open:

http://localhost:5173


🔒 Environment Variables

Sensitive credentials are stored using environment variables and are excluded from version control through .gitignore.

Never commit API keys or private credentials to the repository.

🧠 AI Wellness Assistant

HerHealth includes an optional AI-powered wellness assistant designed to provide conversational guidance around general women's health and wellness topics.

The AI functionality is intentionally separated from the core application, allowing HerHealth to remain functional even when an OpenAI API key is not configured.

AI-generated information is intended for educational purposes and should not replace professional medical advice.

📈 Analytics & Reporting

HerHealth transforms tracked cycle and symptom data into meaningful visual insights.

Users can view:

Cycle length trends
Average cycle duration
Average period duration
Cycle regularity
Symptom frequency

Health analytics can also be exported as a PDF report for personal reference.

🎯 Project Goals

HerHealth was built with the goal of creating a women's health platform that is:

Personalized — adapts to individual cycle data
Accessible — simple and intuitive to navigate
Educational — connects users with reliable health information
Privacy-conscious — keeps sensitive configuration outside the repository
Data-driven — converts health tracking into useful insights
User-friendly — designed around a calm and supportive experience
🔮 Future Improvements
 More advanced cycle prediction models
 Personalized wellness recommendations
 Google Calendar integration
 CSV data export
 Push notifications
 Improved AI personalization
 More detailed symptom correlations
 Mobile application

 
 ⚠️ Disclaimer
HerHealth is an educational and personal health-tracking application.

The information provided through the application is not a substitute for professional medical diagnosis, treatment, or advice. Users should consult a qualified healthcare professional for medical concerns.

Author

Amelia Rubey
IIIT Allahabad
