@echo off
echo Testing verify-otp endpoint...
curl.exe -X POST http://localhost:5000/auth/verify-otp -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"otp\":\"983122\"}"
echo.
echo.
echo Testing complete-profile endpoint...
curl.exe -X POST http://localhost:5000/auth/complete-profile -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"firstName\":\"Test\",\"lastName\":\"User\",\"age\":25}"
