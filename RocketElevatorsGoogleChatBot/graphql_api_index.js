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
        return axios({
            url: 'https://rocketelevatorgraphql.herokuapp.com/graphql',
            method: 'get',
            data: ({
            query: `
                query {
                    chatbot {
                        nb_elevators
                        nb_buildings
                        nb_customers
                        nb_not_active_elevators
                        nb_batteries
                        nb_cities
                        nb_quotes
                        nb_leads
                        }
                    }
                `
            })
          })
          .then(result => {
            console.log(result.data);
            var response = result.data.data.chatbot;
            agent.add('Hello, Here is a little brief to you about Rocket Elevators: There are currently '  + response.nb_elevators + ' elevators deployed in the ' + response.nb_buildings + ' buildings of your ' + response.nb_customers + ' customers. Currently, ' + response.nb_not_active_elevators + ' elevators are not in "Running Status" and are being serviced. ' + response.nb_batteries + ' batteries are deployed across ' + response.nb_cities + ' cities. On another note you currently have ' + response.nb_quotes + ' quotes awaiting processing. You also have ' + response.nb_leads + ' in your contact requests. Have a wonderful day! Rocket Team');

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

// REQUIREMENT:
// The dialogue must be initiated in Slack via an initial brief:
// Greetings
// There are currently XXX elevators deployed in the XXX buildings of your XXX customers
// Currently, XXX elevators are not in Running Status and are being serviced
// XXX Batteries are deployed across XXX cities
// On another note you currently have XXX quotes awaiting processing
// You also have XXX leads in your contact requests
  
// agent.add('Hello, Here is a little brief to you about Rocket Elevators: There are currently ' + response.nb_elevators + ' elevators deployed in the ' + response.nb_buildings + ' buildings of your ' + response.nb_customers + ' customers. Currently, ' + response.nb_not_active_elevators + ' elevators are not in "Running Status" and are being serviced. ' + response.nb_batteries + ' batteries are deployed across ' + response.nb_cities + ' cities. On another note you currently have ' + response.nb_quotes + ' quotes awaiting processing. You also have ' + response.nb_leads + ' in your contact requests. Have a wonderful day! Rocket Team');

// What is the status of Elevator 1?

// MANUAL
// // .map is a function which looks through of the objects/elements of an array => elevators object
// result.data.map(elevatorsObj => {
//     // this will extract the 'id' from the result array
//     console.log(elevatorsObj.id);
//     agent.add(elevatorsObj.id);
// });

