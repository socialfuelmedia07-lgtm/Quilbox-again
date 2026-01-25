# QuilBox Deployment Guide (Firebase Edition) 🚀

This guide explains how to deploy the QuilBox full-stack application using Firebase for the frontend.

## 1. Frontend Deployment (Firebase Hosting)

Firebase provides a reliable and fast way to host your React/Vite frontend.

1.  **Install Firebase Tools**:
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase**:
    ```bash
    npx firebase login
    ```
3.  **Initialize/Connect Project**:
    *   If you already have a project, run:
        ```bash
        npx firebase use --add
        ```
    *   Then select your project from the list.
4.  **Build and Deploy**:
    ```bash
    npm run build
    ```
    ```bash
    npx firebase deploy --only hosting
    ```
    *   **Your URL will be**: `https://<your-project-id>.web.app`

## 2. Backend Deployment (Render) - REQUIRED for OTP

The frontend needs a live API to handle Login, OTP, and Cart persistence.

1.  **Push the `Backend` folder to GitHub**.
2.  **Deploy to Render**:
    *   **Root Directory**: `Backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
3.  **Get your Backend URL** (e.g., `https://quilbox-api.onrender.com`).

## 3. Link Frontend to Backend

1.  In your Firebase project settings (or in the `src/services/api.ts` file if you are building locally), ensure the `VITE_API_URL` points to your Render URL.
2.  You can set this in Firebase by adding an environment variable during the build process if using CI/CD, or by updating your local `.env` before running `npm run build`.

---

### Verification
Once deployed:
1.  Visit your `.web.app` URL.
2.  Check if the logo and all sections appear.
3.  The app is now fully live on Firebase!
