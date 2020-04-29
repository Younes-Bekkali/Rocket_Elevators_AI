
const Alexa = require("ask-sdk-core");
const http = require("https");



// the greating message Handler
// to start with : "rocket elevators"

const GetLaunchHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText = "Hi, I'm your personal Rocket Elevators Voice Assistant, ask me commands like 'what is the status of X elevator' or 'what is going on' to get a global overview";
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt()
      .getResponse();
  }
};


// ----- Main Job Handler  -----
// sample 1:  "a briefing please"
// sample 2: "what is the rocket elevators situation"

const GetRemoteDataHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "GetRemoteDataIntent"
    );
  },
  async handle(handlerInput) {
    let outputSpeech = "This is the default message.";

    const elevatorData = await getRemoteElevatorData(
      "https://rocketapi.azurewebsites.net/api/elevator/notinoperation"
    );

    const elevatorAllData = await getRemoteElevatorAllData(
      "https://rocketapi.azurewebsites.net/api/elevator/all"
   );

    const buildingData = await getRemoteBuildingData(
      "https://rocketapi.azurewebsites.net/api/building/all"
    );
    
    const customerData = await getRemoteCustomerData(
      "https://rocketapi.azurewebsites.net/api/customer/all"
    );
    
    const batteryData = await getRemoteBatteryData(
      "https://rocketapi.azurewebsites.net/api/battery/all"
    );

    const AddressCityData = await getRemoteCityData(
      "https://rocketapi.azurewebsites.net/api/address/all"
    );
    
    
    const QuoteData = await getQuoteData(
      "https://rocketapi.azurewebsites.net/api/lead/notcustomers"
    );
    
    const LeadData = await getLeadData(
      "https://rocketapi.azurewebsites.net/api/lead/all"
    );
    
    const elevator = JSON.parse(elevatorData);
    const elevatorAll = JSON.parse(elevatorAllData);
    const building = JSON.parse(buildingData);
    const customer = JSON.parse(customerData);
    const batteries = JSON.parse(batteryData);
    const cities = JSON.parse(AddressCityData);
    const quotes = JSON.parse(QuoteData);
    const leads = JSON.parse(LeadData);

    outputSpeech = `Greetings ! There are currently ${elevatorAll.length} elevators in the ${building.length} buildings of your ${customer.length} customers. Currently, ${elevator.length} elevators are not in running state and are being serviced. ${batteries.length} are deployed across ${cities.length} cities. On another note you currently have ${quotes.length} quotes awaiting processing. You also have ${leads.length} leads in your contact requests `; 

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};

// Option: Find the elevator status of a specific elevator  Handler 
// sample 1: "Elevator {id} status"
// sample 2 : "what is the status of elevator {id}"

const GetStatusHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.intent.name === "GetStatusIntent"
    );
  },
  async handle(handlerInput) {
    let outputSpeech = "This is the default message.";
    const id = handlerInput.requestEnvelope.request.intent.slots.id.value;
    if (id > 200) {
      outputSpeech = "Are you sure it is a valid number? Please enter the elevator id!";
      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .reprompt()
        .getResponse();
    }

    const elevatorStatus = await getRemoteElevatorData(
      "https://rocketapi.azurewebsites.net/api/elevator/" + id
    );

    const elevator = JSON.parse(elevatorStatus).status;

    outputSpeech = `The status of elevator ${id} is ${elevator} `;

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt()
      .getResponse();
  }
};


// ----- help/error_messages Hendlers -----

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speechText =
      "Here is the list of all commands : what is the status of elevator {id},Can you tell me the status of elevator {id}, change elevator {id} status to {status}, change status to {status} for elevator {id}, how rocket elevators is going, what happen at rocket elevators, what is going on, what is the serial number of elevator {id}, what is the SN of elevator {id}, can you tell me the serial number of elevator {id}, give me some information about elevator {id}, what happen with the elevator {id}, can you tell me some information about elevator {id}";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      (handlerInput.requestEnvelope.request.intent.name ===
        "AMAZON.CancelIntent" ||
        handlerInput.requestEnvelope.request.intent.name ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speechText = "Goodbye!";

    return handlerInput.responseBuilder.speak(speechText).getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  }
};


const getLeadData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};
const getRemoteElevatorData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};
const getRemoteElevatorAllData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};
const getQuoteData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};
const getRemoteBuildingData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};
const getRemoteCityData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};
const getRemoteCustomerData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};
const getRemoteBatteryData = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};
// Skill Builder 
const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetLaunchHandler,
    GetRemoteDataHandler,
    GetStatusHandler
  )
  .lambda();
function uppercaseFirstCharacter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}