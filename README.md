## RocketElevators-AI
### Artificial Intelligence as a Service // Week-12
Project of Mykee, Maxime, Alexis, Ukeme, Younes, Agnes

### DIFFERENT API SOLUTIONS

We created the Chatbot with **REST API** and **GRAPHQL API** and and Alexa with **REST API**

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

Start the skill, **"Alexa, Open rocket Elevators"**

Ask for a briefing:  **"What is going on at rocket elevators ?"**


## Chatbot with Google DialogFlow

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

2 agents (basically the face of your bot) were set in DialogFlow to deploy the different code:

GRAPHQL API SLACK CHANNEL: @rocketelevators

REST API SLACK CHANNEL: @rocketelevatorsbot

**User expressions for different scenarios:**

**BRIEF**
```
Elevators, elevators, elevators
I need a quick brief
I want to know about our elevators
Brief me
```

**ELEVATOR STATUS**
```
I would like to know the status of the Elevator 6?
What is the status of Elevator 4?
elev status 89 
```

**ELEVATOR NOTES**
```
What my mate wrote about this elevator 432?
Any notes from elevator 200?
```

### SOURCES

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
Request for a **STATUS and NOTES**:
```
{
  chatbot2(id: 453) {
    building_type
    elevator_model
    elevator_notes
    elevator_status
    elevator_information
    elevator_serial_number
    elevator_commissioning_date
    elevator_last_inspection_date
    elevator_inspection_certificate
    created_at
    updated_at
    column_id
  }
}
```

