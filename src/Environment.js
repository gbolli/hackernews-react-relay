import { GC_AUTH_TOKEN } from './constants'
import { SubscriptionClient } from 'subscriptions-transport-ws'

const {
  Environment,
  Network,
  RecordSource,
  Store,
} = require('relay-runtime')

const store = new Store(new RecordSource())

const fetchQuery = (operation, variables) => {
  return fetch('https://api.graph.cool/relay/v1/cj6q1r7d901rs0109ql91ozhr', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem(GC_AUTH_TOKEN)}`
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

const setupSubscription = (config, variables, cacheConfig, observer) => {
  const query = config.text

  const subscriptionClient = new SubscriptionClient('wss://subscriptions.ap-northeast-1.graph.cool/v1/cj6q1r7d901rs0109ql91ozhr', {reconnect: true})
  subscriptionClient.subscribe({query, variables}, (error, result) => {
    observer.onNext({data: result})
  })
}

const network = Network.create(fetchQuery, setupSubscription)

const environment = new Environment({
  network,
  store,
})

export default environment
