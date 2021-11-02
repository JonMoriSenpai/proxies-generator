<div align="center">
  <br />
  <br />
  <p>
<h1>Proxies Generator</h1>
  </p>
</div>

## About

Free Proxies Generator is a Generator/Scrapper and Helps Players to fetch Proxies from Custom Scrappers , as Per reduces extra work and credentials.

- Object-oriented , means Value returned in a structure format
- Customisable Validator
- Performant

## Installation

**Node.js 16 or newer is required.**

```
npm install proxies-generator
```

## Example usage

Fetch proxy :-

```
import { fetch, fetchOne } from 'proxies-generator'
                OR
const { fetch, fetchOne } = require('proxies-generator')

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
```

## Strucutre of Proxy

```
Proxy = {
  ip: String
  port: String
  code: String
  country: String
  type: String
  updated: String
  https: Boolean
  httpsurl: String
  url: String
}
```

## Links

- [Source Code](https://github.com/SidisLiveYT/proxies-generator.git)
- [GitHub Repo Link](https://github.com/SidisLiveYT/proxies-generator)
- [NPM Package](https://www.npmjs.com/package/proxies-generator)
- [Yarn Package](https://yarn.pm/proxies-generator)

## Contributing

Before creating an issue, please ensure that it hasn't already been reported/suggested, and double-check the ReadMe.md

## Help

If you don't understand something in the ReadMe.md , you are experiencing problems, or you just need a gentle
nudge in the right direction, please don't hesitate to join our official [Support Server](https://discord.gg/MfME24sJ2a).
