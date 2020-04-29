// https://decoupledkit-react.readthedocs.io/en/develop/react-chatbot/

// import the graphql client
const graphqlFetch = require('graphql-fetch')('http://path-to-graphql.com/graphql')

'input.pokmon_stats': () => {
  const query = `
    query q (title: String!) {
      user(title: $title) {
        title
        speed
        hp
        defense
        special_defense
        attack
        special_attack
        pokemon_height
        pokemon_weight
      }
    }
  `
  const queryVars = {
    title: parameters['pokemon-name']
  }

  return graphqlFetch(query, queryVars).then(pkmn => {
    return sendResponse(pkmn[parameters['stat']])
  })
}
