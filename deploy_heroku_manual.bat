@echo off
setlocal

echo 🚀 MessWalha Heroku Manual Deployment
echo =======================================

:: Step 1: Configuration
set APP_NAME=messwalha-api-pg
set HEROKU_API_KEY=YOUR_HEROKU_API_KEY_HERE

:: Step 2: Login
echo 🔑 Logging into Heroku...
call heroku labs:enable runtime-dyno-metadata -a %APP_NAME%

:: Step 3: Create App (if it doesn't exist)
echo 📦 Creating Heroku app "%APP_NAME%"...
call heroku create %APP_NAME%

:: Step 4: Add Postgres
echo 🗄️ Adding Heroku Postgres (Essential-0 tier)...
call heroku addons:create heroku-postgresql:essential-0 -a %APP_NAME%

:: Step 5: Set Config Vars
echo ⚙️ Setting environment variables...
call heroku config:set NODE_ENV=production -a %APP_NAME%
call heroku config:set JWT_SECRET=messwalha_prod_secret_2026 -a %APP_NAME%
call heroku config:set RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY -a %APP_NAME%
call heroku config:set RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET -a %APP_NAME%
call heroku config:set FRONTEND_URL=https://frontend-one-swart-57.vercel.app -a %APP_NAME%

:: Step 6: Deploy
echo 🚀 Deploying from "server/" directory...
cd server
:: Check if .git exists, if so, just add and commit
if not exist .git (
    git init
    git checkout -b main
)
git add .
git commit -m "Initial Heroku deployment"
git remote add heroku https://git.heroku.com/%APP_NAME%.git
git push heroku master -f

echo.
echo ✅ Deployment sequence complete! 
echo 🔗 URL: https://%APP_NAME%.herokuapp.com
echo.
pause
