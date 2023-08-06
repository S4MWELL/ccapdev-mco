## INSTRUCTIONS TO RUN LOCALLY

Before attempting to run the application, ensure that node.js and mongodb are installed.
Note: Sample data is under sample_data folder and needs to be manually added to mongodb compass (an automation script was not used as it would have the effect of adding duplicate data every time the app is run locally).

To run the program locally:
1. In server.js, line 37 and 41, change process.env.port to 3000 and set the argument mongoose.connect to 'mongodb://127.0.0.1:27017/labdb'.
1. Delete the node_modules folder
2. Type "npm install" in the terminal
3. Type "npm start" in the terminal
4. Navigate to http://localhost:3000 in a browser, this should load the home page of the app
