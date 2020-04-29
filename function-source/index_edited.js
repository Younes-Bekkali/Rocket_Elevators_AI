// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

// Make http requests from node.js, need to add the version to package.json file, "dependencies":{}
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
        const elevators = agent.parameters.elevators;
        agent.add('Here is the list of elevators ${elevators}');
        // axios.get will call the URL and return the response. We can insert this in the end: /Elevators/${elevator_id} => whatever value the variable hold will be inserted
        return axios.get('https://rocketelevatorsrestapi.herokuapp.com/api/Elevators')
        // .then is a Promise, when we receive the result, execute this function
        .then((result) => {
            console.log(result.data);
            agent.add(result.data);
    //         // // .map is a function which looks through of the objects/elements of an array => elevators object
    //         // result.data.map(elevatorsObj => {
    //         //     // this will extract the "id" from the result array
    //         //     console.log(elevatorsObj.id);
    //         //     agent.add(elevatorsObj.id);
    //         // });
        });
    }

    // function getElevators(agent){
    //     var elevators = {};
    //     // axios.get will call the URL and return the response. 
    //     return axios.get('https://rocketelevatorsrestapi.herokuapp.com/api/Elevators')
    //     // .then is a Promise, when we receive the result, execute function if it has
    //     .then(result => result.json())
    //     .then((result) => {
    //         console.log(result.data);
    //         agent.add(result.data);
    //         var nb_elev = result.lenght;
    //         agent.add('There are currently' + nb_elev + 'elevators deployed. WOow');
    //     })
    // }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('RocketElevators', RocketElevators);  
//   intentMap.set('RocketElevators', getElevators);
  agent.handleRequest(intentMap);
});


//   function getActiveElevators(agent){
//     const status= agent.parameters.status;
//     axios.get(`'https://rocketelevatorsrestapi.herokuapp.com/api/Elevators/${status}`)
//     .then((result) => {
//       result.data.map(statusObj => {
//         var id = statusObj.id;
//         var building = statusObj.building_type;
//         agent.add(`Here are all the ${status} elevators of building ${id}(${building} building)`);
//       });
//     });
//   }
