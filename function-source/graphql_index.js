// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues

'use strict';
 
// var https = require ('https');
// const url = "https://rocketelevatorgraphql.herokuapp.com/graphql";
const functions = require('firebase-functions');
const DialogFlowApp = require('actions-on-google').DialogFlowApp;

// import the graphql client
const graphqlFetch = require('graphql-fetch')('https://rocketelevatorgraphql.herokuapp.com/graphql')

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Request Headers: ' + JSON.stringify(request.headers));
  console.log('Request Body: ' + JSON.stringify(request.body));
  
  let action = request.body.queryResult.action;
  console.log(action);

  response.setHeader('Content-Type','applicaiton/json');

const parameters = request.body.queryResult.parameters;
// var companyName = parameters['company_name'];
// var priceType = parameters['price_type'];
// var date = parameters ['date'];

// function to get the data with graphQL API
  function getBrief (CloudFnResponse){
    console.log('In Function Get Brief');
    // var answer = {};
      // https.get(url, res => {
      //   res.setEncoding("utf8");
      //   let body = "";
      //   res.on("data", data => {
      //     body += data;
      //   });
      //   res.on("end", () => {
      //     body = JSON.parse(body);
      //     console.log(body);
      //   });
      // });

  'input.elvator_brief: () => {
    const query = `
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
      return graphqlFetch(query).then(pkmn => {
      return sendResponse(pkmn)
      })
  }

  // Here is the message to return to the chat
  var chat = "Hello, Here is a little brief to you about Rocket Elevators:"
  "There are currently" + nb_elevators + "elevators deployed in the" + nb_buildings + "buildings of your" + nb_customers + "customers."
  "Currently, " + nb_not_active_elevators + "elevators are not in Running Status and are being serviced."
  nb_batteries + "Batteries are deployed across" + nb_cities + "cities."
  "On another note you currently have" + nb_quotes + "quotes awaiting processing."
  "You also have" + nb_leads + "in your contact requests";
  
  CloudFnResponse.send(buildChatResponse(chat));
  });

function buildChatResponse(chat) {
  return JSON.stringify({"fulfillmentText": chat});
}

// REQUIREMENT:
// The dialogue must be initiated in Slack via an initial brief:
// Greetings
// There are currently XXX elevators deployed in the XXX buildings of your XXX customers
// Currently, XXX elevators are not in Running Status and are being serviced
// XXX Batteries are deployed across XXX cities
// On another note you currently have XXX quotes awaiting processing
// You also have XXX leads in your contact requests
  
// What is the status of Elevator XXX?


fetch('/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: {
      input: {
        author,
        content,
      }
    }
  })
})
  .then(r => r.json())
  .then(data => console.log('data returned:', data));