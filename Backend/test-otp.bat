@echo off
echo ============================================
echo Testing OTP Authentication Endpoints
echo ============================================
echo.

echo 1. Testing Health Endpoint...
curl.exe http://localhost:5000/health
echo.
echo.

echo 2. Requesting OTP (4-digit)...
curl.exe -X POST http://localhost:5000/auth/request-otp -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\"}"
echo.
echo.

echo ============================================
echo Check the server console to see the 4-digit OTP!
echo Then use that OTP to test verification.
echo ============================================
pause
