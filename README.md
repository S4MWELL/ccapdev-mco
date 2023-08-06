## INSTRUCTIONS TO RUN

This server requires node.js and mongodb to be installed in order to run.
All dependencies are already in the node_modules folder. In case they are not, running "npm install" in the root folder of the folder should install all missign dependencies.

To start the server, open a terminal in the root folder of the folder and type "npm start" (without quotations).
Note that the mongodb database is populated by a script every time the server is run. This may result in duplicate entries. 
This may be prevented by deleting the database before restarting the server, which can be done through mongodb compass.


Note: labdb.reservations.json is in the folder named sample_data in case the program fails to automatically import the data.