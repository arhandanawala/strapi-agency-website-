@echo off
echo Starting Strapi on port 1337...
cd /d C:\Users\irsha\business-website\my-strapi-project
set PATH=C:\Users\irsha\node-v20.18.0-win-x64\node-v20.18.0-win-x64;%PATH%
start /B cmd /c "node node_modules/@strapi/strapi/bin/strapi.js develop 2>&1"
echo Waiting for Strapi...
timeout /t 15 /nobreak >nul
echo Strapi should be running at http://localhost:1337
echo.
echo Starting Frontend on port 5173...
cd /d C:\Users\irsha\business-website
start /B cmd /c "npm run dev"
echo Frontend should be running at http://localhost:5173
echo.
echo DONE! Both servers starting:
echo - Strapi: http://localhost:1337
echo - Frontend: http://localhost:5173
pause