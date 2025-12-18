# Smart Badminton Court Booking Platform 🏸

## Project Overview
CourtEase is a premium, full-stack web application designed to simplify the management and booking of badminton courts. It provides a seamless experience for users to book courts, rent equipment, and hire coaches, while offering administrators powerful tools to manage resources and dynamic pricing.

The application features a modern "Glassmorphism" UI, responsive design, and a robust pricing engine that facilitates complex billing rules.

## ✨ Features

### User Features
*   **Court Booking**: Browse available courts (Indoor/Outdoor) and book them for specific time slots.
*   **Dynamic Pricing**: Real-time cost calculation based on court type, time of day (peak hours), and added extras.
*   **Equipment & Coaching**: Option to rent rackets/shoes and hire professional coaches during the booking process.
*   **Booking History**: View past and upcoming bookings with status indicators (Confirmed, Cancelled).
*   **Responsive Design**: Fully optimized experience for Mobile, Tablet, and Desktop.

### Admin Features
*   **Dashboard**: A secure area (PIN-protected) to manage all platform resources.
*   **Resource Management**: Add, edit, or delete Courts, Equipment, and Coaches.
*   **Pricing Engine**: Configure dynamic pricing rules (e.g., "Evening Surcharge" adds 20% after 6 PM).
*   **Visual Analytics**: Quick view of stock levels and resource pricing.

## 🛠 Tech Stack

### Frontend
*   **React + Vite**: For a fast, responsive Single Page Application (SPA).
*   **Tailwind CSS**: For utility-first styling and complex animations.
*   **Glassmorphism**: Custom CSS approach for a premium, modern aesthetic.
*   **Axios**: For efficient HTTP requests.

### Backend
*   **Node.js & Express**: robust RESTful API architecture.
*   **MongoDB & Mongoose**: Flexible NoSQL database for handling booking relationships.
*   **CORS & Dotenv**: Middleware for security and configuration.

## 🚀 Setup Instructions

### Prerequisites
*   [Node.js](https://nodejs.org/) (v14 or higher)
*   [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a compiled URI)

### 1. Clone the Repository
```bash
git clone <repository_url>
cd court-booking-platform
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (if not present) and add your MongoDB URI:
```env
MONGO_URI=mongodb://127.0.0.1:27017/court_booking
PORT=5000
```

Start the server:
```bash
npm start
# OR for development with hot-reload
npm run dev
```
The backend should now be running on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```
The application will launch in your browser at `http://localhost:5173`.

## 📝 Assumptions Made
*   **Authentication**: For this specific milestone, a full User Auth system (Login/Signup) was out of scope. I utilized a simplified "Email-based" identification for User Bookings and a secure PIN (`admin123`) for Admin access.
*   **Availability**: The system assumes 60-minute booking slots starting at the top of the hour for simplicity.
*   **Currency**: All monetary values are in INR (₹).
*   **Timezone**: The application operates in the local server time.


