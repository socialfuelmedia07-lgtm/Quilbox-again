@echo off
echo Testing 4-digit OTP generation...
echo.
curl.exe -X POST http://localhost:5000/auth/request-otp -H "Content-Type: application/json" -d "{\"name\":\"New User\",\"email\":\"newuser@example.com\"}"
echo.
echo.
echo Check the server console above to see the 4-digit OTP!
