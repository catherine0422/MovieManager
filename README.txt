*************** Requirement *****************

Nodejs
Angular
Mongodb

*************** Installation ********************

1.Install Mongodb at : https://www.mongodb.com

2.Import the movie data using the file "movies.json", go
 to the folder where the file is saved,and tap in the 
terminal:

     mongoimport --db moviemanager --collection movies --file movies.json

3.Start the server, enter into the folder "MovieManagerServer" :

     npm install
     node index

4.Open the web, enter into the folder "MovieManagerAngular":

    npm install -g @angular/cli
    npm install
    ng serve

5. Go to the site : http://localhost:4200

*************** Utilisation ********************

1.Press "Create a new data" button to create a 
new data

2.You can edit, delete, collect one record

3.Select a type(title, stars, director) and use search 
to search

4.Press filter and select your requirement, then press 
run filter 

5.Select a way to sort the data using "sort by" button

6.See more information of the movie in "/info"
