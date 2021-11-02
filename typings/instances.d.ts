export type Proxy = {
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

export type FilterOptions = {
  country: Boolean | undefined
  random: Boolean | undefined
}
