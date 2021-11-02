import { fetch, fetchOne } from 'proxies-generator'
const Proxies = fetch() // Proxy Array with validity checks
/**
 * [ 
 {
  ip: String
  port: String
  code: String
  country: String
  type: String
  updated: String
  https: Boolean
  httpsurl: String
  url: String
},
]
 */

const Proxy = fetchOne() //Fetch One Proxy
const Proxy = fetchBycountry('Brazil') //Fetch Proxy from brazil if present in Cache
const Proxies = random() //Fetch Array of Random Proxy
const Proxy = randomOne() //Fetch One Random Proxy
