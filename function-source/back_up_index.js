// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

// Make http requests from node.js, need to add the version to package.json file, 'dependencies':{}
const axios = require('axios');

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    
    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }
    
    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }
    // with const something = agent.parameters.something we can extract the VALUE what PARAMETER holds.
    function RocketElevators(agent){
        var response = {};
        // axios.get will call the URL and return the response. We can insert this in the end: /Elevators/${elevator_id} => whatever value the variable hold will be inserted
        return axios.get('https://rocketelevatorsrestapi.herokuapp.com/api/Elevators')
        // .then is a Promise, when we receive the result, execute this function
        .then((result) => {
            console.log(result.data);
            response.nb_elevators = result.data.length;
            // agent.add('There are currently elevators ' + nb_elevators + ' deployed.');
        })
        .then(() => {
            return axios.get('https://rocketelevatorsrestapi.herokuapp.com/api/Elevators/notinoperation')
            // .then is a Promise, when we receive the result, execute this function
            .then((result) => {
                console.log(result.data);
                response.nb_not_active_elevators = result.data.length;
                agent.add('There are currently elevators ' + response.nb_elevators + ' deployed. Currently, ' + response.nb_not_active_elevators + 'elevators are not in Running Status and are being serviced.');

            });
        });
    }

    function ElevatorStatus(agent){
        const id = agent.parameters.elevator_id;
        // axios.get will call the URL and return the response. We can insert this in the end: /Elevators/${elevator_id} => whatever value the variable hold will be inserted
        return axios.get('https://rocketelevatorsrestapi.herokuapp.com/api/Elevators/'+ id)
            // .then is a Promise, when we receive the result, execute this function
            .then((result) => {
                console.log(result.data);
                var status = result.data.status;
                agent.add('The status of the elevator ' + id + ' is ' + status);
            });
    }
  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('RocketElevators', RocketElevators);
  intentMap.set('ElevatorStatus', ElevatorStatus);  
  agent.handleRequest(intentMap);
});