## INSTRUCTIONS TO RUN LOCALLY

Before attempting to run the application, ensure that node.js and mongodb are installed.
Note: Sample data is under sample_data folder and needs to be manually added to mongodb compass (an automation script was not used as it would have the effect of adding duplicate data every time the app is run locally).

To run the program locally:
1. In server.js, line 37 and 41, change process.env.port to 3000 and set the argument of mongoose.connect to 'mongodb://127.0.0.1:27017/labdb'.
2. Type "npm install" in the terminal
3. Type "npm start" in the terminal
4. Navigate to http://localhost:3000 in a browser, this should load the home page of the app

## Sample Accounts

Format:\
email\
name\
password\
type of account

michael_stevens@dlsu.edu.ph\
Michael Stevens\
michaelpassword\
student


michael_jordan@dlsu.edu.ph\
Michael Jordan\
michaelpassword\
student

owen_wilson@dlsu.edu.ph\
Owen Wilson\
owenpassword\
student

thetechnician@dlsu.edu.ph\
The Technician\
technicianpassword\
technician

xiao_chua@dlsu.edu.ph\
Xiao Chua\
xiaopassword\
student