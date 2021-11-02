import { Proxy } from './instances'

export class ProxyGen {
  fetch (
    Limit?: Number | undefined,
    ProxyGenWebsite?: String | undefined,
    ValidCheck?: Boolean | undefined
  ): Promise<Proxy[] | undefined | Error>
  random (
    Limit?: Number | undefined,
    ValidCheck?: Boolean | undefined
  ): Promise<Proxy[] | undefined | Error>
  randomOne (
    ValidCheck?: Boolean | undefined
  ): Promise<Proxy | undefined | Error>
  fetchOne (
    ProxyGenWebsite?: String | undefined,
    ValidCheck?: Boolean | undefined
  ): Promise<Proxy | undefined | Error>
  validity (
    IP: Number | String,
    Port: String | Number
  ): Promise<Boolean | undefined>
}
