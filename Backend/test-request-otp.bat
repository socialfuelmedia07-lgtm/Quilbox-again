@echo off
curl.exe -X POST http://localhost:5000/auth/request-otp -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\"}"
