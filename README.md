## RocketElevators-AI
### Artificial Intelligence as a Service // Week-12
Project of Mykee, Maxime, Alexis, Ukeme, Younes, Agnes

## Alexa's Briefing

Code for ALEXA:
```
|-- **RocketElevatorsAlexa**
|   |-- interactionModels
|       |-- custom
|           `-- en-US.json         
|   |-- lambda
|       `-- **index.js**
|       `-- **package.json**
|       `-- util.js
|   `-- skill.json

```
PATH ```RocketElevatorsAlexa/lambda/index.js```

## Chatbot with Google DialogFlow

### DIFFERENT API SOLUTIONS

We created the Chatbot and Alexa with **REST API** and **GRAPHQL API**
2 agents (basically the face of your bot) were set in DialogFlow to deploy the different code.

Code for GOOGLE CHATBOT:
```
|-- **RocketElevatorsGoogleChatBot**
|   |-- Examples
|   `-- **graphql_api_index.js**
|   `-- **package.json**
|   `-- **rest_api_index.js**
```
PATH FOR GRAPHQL API ```RocketElevatorsGoogleChatBot/graphql_api_index.js```

PATH FOR REST API ```RocketElevatorsGoogleChatBot/rest_api_index.js```

### SLACK CHANNELS ON **Rocket Elevators**

GRAPHQL API SLACK CHANNEL: @rocketelevators
REST API SLACK CHANNEL: @rocketelevatorsbot

**User expressions for different scenarios:**

**BRIEF**
Elevators, elevators, elevators
I need a quick brief
I want to know about our elevators
Brief me

**ELEVATOR STATUS**
I would like to know the status of the Elevator 6?
What is the status of Elevator 4?
elev status 89 

SOURCES:
Repository for GraphQL: https://github.com/mykeeouellet/GraphQL-API

The API is deployed on heroku with the GraphiQL interface at this URL: https://rocketelevatorgraphql.herokuapp.com/graphql

Request for a **BRIEF**:
```
{ 
    chatbot { 
        nb_elevators 
        nb_buildings 
        nb_customers 
        nb_not_active_elevators 
        nb_quotes 
        nb_leads 
        nb_batteries 
        nb_cities
    } 
}
```
Request for a **STATUS**:

