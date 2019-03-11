# Example - NODE.js api with redis

My humble attempt on the simple Node.js Api.


**Project, Is still work in progress.**

## Description

Little nodejs app. Build with these parameters:

+ Receives HTTP POST requests only on a "/track" route
    * gets data in JSON format passed in the request body 
    * saves the JSON data into a local file (append) 
    * if the data contains a "count" parameter, the application increments the value of the "count" key by the value of the 'count' parameter in a Redis database 

+ Receives HTTP GET requests only on a "/count" route 
    * returns the value of the "count" key from the Redis database 


## Dependency

* node 
* Redis server

## How to use it

* Download this project
* Open project in terminal, and run ``` npm install```
* Make sure, that Redis server is running
* Run App ``` npm run start```
* Run tests ``` npm run test```

### To-dos

* Fix mocking of Config, save to file url in tests
