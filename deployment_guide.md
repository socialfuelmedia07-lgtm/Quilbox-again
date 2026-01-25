# QuilBox Deployment Guide 🚀

This guide explains how to deploy the QuilBox full-stack application.

## 1. Frontend Deployment (Vercel)

Vercel is the easiest way to deploy the React/Vite frontend.

1.  **Push to GitHub**: Ensure your latest changes are pushed.
2.  **Connect to Vercel**:
    *   Log in to [vercel.com](https://vercel.com).
    *   Click "Add New" > "Project".
    *   Import the `Quilboxwithoutbackend` repository.
3.  **Configure Environment Variables**:
    *   In the Vercel dashboard, go to "Settings" > "Environment Variables".
    *   Add `VITE_API_URL` with the URL of your deployed backend (e.g., `https://quilbox-backend.onrender.com`).
4.  **Deploy**: Click "Deploy".

## 2. Backend Deployment (Render)

Render is great for hosting Node.js/Express APIs.

1.  **Push to GitHub**: Ensure the `Backend` folder is pushed.
2.  **Connect to Render**:
    *   Log in to [dashboard.render.com](https://dashboard.render.com).
    *   Click "New" > "Web Service".
    *   Select your repository.
3.  **Configure Service**:
    *   **Root Directory**: `Backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  **Environment Variables**:
    *   Add `MONGO_URI`: Your MongoDB Atlas connection string.
    *   Add `JWT_SECRET`: A secure random string.
    *   Add `PORT`: `5000` (or leave default).
5.  **CORS**: Ensure the backend allows requests from your Vercel frontend URL.

## 3. Database (MongoDB Atlas)

Don't use `localhost` in production.
1.  Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Whitelist all IP addresses (`0.0.0.0/0`) or specific deployment IPs.
3.  Copy the connection string and use it as `MONGO_URI` in the backend environment variables.

---

### Verification
Once deployed:
1.  Visit the Vercel URL.
2.  Check if the new logo appears in the Header.
3.  Try to request an OTP; it should talk to the live backend.
