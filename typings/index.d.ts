import { Proxy } from './instances'

export function fetch (
  Limit?: Number | undefined,
  ProxyGenWebsite?: String | undefined,
  ValidCheck?: Boolean | undefined
): Promise<Proxy[] | undefined | Error>
export function random (
  Limit?: Number | undefined,
  ValidCheck?: Boolean | undefined
): Promise<Proxy[] | undefined | Error>
export function randomOne (
  ValidCheck?: Boolean | undefined
): Promise<Proxy | undefined | Error>
export function fetchBycountry (
  CountryAlias?: String[] | String | undefined,
  Limit?: Number | undefined,
  ProxyGenWebsite?: String | undefined,
  ValidCheck?: Boolean | undefined
): Promise<Proxy[] | undefined | Error>
export function fetchOne (
  ProxyGenWebsite?: String | undefined,
  ValidCheck?: Boolean | undefined
): Promise<Proxy | undefined | Error>
export function validity (
  IP: Number | String,
  Port: String | Number
): Promise<Boolean | undefined>
