const Axios = require('axios').default;
const cheerio = require('cheerio');
const ProxyCheck = require('proxy-check');

/**
 * Proxy Data Filtered for Users in ProxyModel
 */

const Proxy = {
  ip: '',
  port: '',
  code: '',
  country: '',
  type: '',
  updated: '',
  https: false,
  httpsurl: '',
  url: '',
};

class ProxyGen {
  /**
   * @method fetch() -> Fetch Proxy from Valid Website and Returns as Array or undefined on Errors
   * @param {Number|undefined} Limit Max Number of Proxies should be returned
   * @param {String|undefined} ProxyGenWebsite Website to scrap proxies , remain undefined to fetch from default website
   * @param {Boolean|undefined} ValidCheck Package should check its validity as proxy
   * @returns {Promise<Proxy[]|undefined|Error>} array of Proxy or undefined on errors
   */
  static async fetch(
    Limit = 1,
    ProxyGenWebsite = 'https://sslproxies.org/',
    ValidCheck = true,
  ) {
    const RawProxies = {
      ip_addresses: [],
      port_numbers: [],
      country_codes: [],
      country_names: [],
      proxy_types: [],
      https_booleans: [],
      last_updates: [],
    };

    const Response = await Axios.get(ProxyGenWebsite).catch((error) => {
      throw Error(error.message);
    });

    if (Response.status === 200) {
      const $ = cheerio.load(Response.data);
      $('td:nth-child(1)').each(function (index, value) {
        RawProxies.ip_addresses[index] = $(this).text();
      });
      $('td:nth-child(2)').each(function (index, value) {
        RawProxies.port_numbers[index] = $(this).text();
      });
      $('td:nth-child(3)').each(function (index, value) {
        RawProxies.country_codes[index] = $(this).text();
      });
      $('td:nth-child(4)').each(function (index, value) {
        RawProxies.country_names[index] = $(this).text();
      });
      $('td:nth-child(5)').each(function (index, value) {
        RawProxies.proxy_types[index] = $(this).text();
      });
      $('td:nth-child(7)').each(function (index, value) {
        RawProxies.https_booleans[index] = $(this).text();
      });
      $('td:nth-child(8)').each(function (index, value) {
        RawProxies.last_updates[index] = $(this).text();
      });
      return await ProxyGen.#proxyModel(Limit, RawProxies, ValidCheck);
    }
    if (ProxyGenWebsite !== 'https://sslproxies.org/') {
      return await ProxyGen.fetch(Limit, 'https://sslproxies.org/', ValidCheck);
    }
    return void null;
  }

  /**
   * @method fetchBycountry() -> Fetch proxy based on Country Codes or Country Name
   * @param {Array|String|undefined} CountryAlias Country Name or Code | Or Array of names and codes for checking multi countries
   * @param {Number|undefined} Limit max proxies to return
   * @param {String|undefined} ProxyGenWebsite Fetch Proxies Data from Valid Website
   * @param {Boolean|undefined} ValidCheck Package should check its validity as proxy
   * @returns {Promise<Proxy[]|undefined|Error>} array of Proxy or undefined on errors
   */

  static async fetchBycountry(
    CountryAlias = undefined,
    Limit = 1,
    ProxyGenWebsite = 'https://sslproxies.org/',
    ValidCheck = true,
  ) {
    if (!CountryAlias) return void null;
    const Proxies = await ProxyGen.fetch(Limit, ProxyGenWebsite, ValidCheck);
    const CountryBYProxies = [];
    for (let count = 0, len = Proxies.length; count < len; ++count) {
      if (
        (typeof CountryAlias === 'object'
          && CountryAlias[0]
          && ((Proxies[count].code
            && CountryAlias.includes(Proxies[count].code.trim()))
            || (Proxies[count].country
              && CountryAlias.includes(Proxies[count].country.trim()))))
        || (Proxies[count].code
          && CountryAlias.tolowerCase().trim()
            === Proxies[count].code.toLowerCase().trim())
        || (Proxies[count].country
          && CountryAlias.tolowerCase().trim()
            === Proxies[count].country.toLowerCase().trim())
      ) {
        CountryBYProxies.push(Proxies[count]);
      }
    }
    return CountryBYProxies;
  }

  /**
   * @method random() -> Fetch Random Proxy from Default Website and Returns as Array or undefined on Errors
   * @param {Number|undefined} Limit Max Number of Proxies should be returned
   * @param {Boolean|undefined} ValidCheck Package should check its validity as proxy
   * @returns {Promise<Proxy[]|undefined|Error>} array of Proxy or undefined on errors
   */

  static async random(Limit = 1, ValidCheck = true) {
    const Proxiesdata = await ProxyGen.fetch(
      Limit,
      'https://sslproxies.org/',
      ValidCheck,
    );
    const ProxyIndex = Math.floor(Math.random() * (Proxiesdata.length - 1)) + 1;
    const RandomProxyArray = [];
    for (let count = 0, len = Proxiesdata.length; count < len; ++count) {
      if (Limit <= count) break;
      RandomProxyArray.push(Proxiesdata[ProxyIndex - 1]);
    }
    return RandomProxyArray;
  }

  /**
   * @method randomOne() -> Fetch 1 Random Proxy from Default Website and Returns as proxy Data or undefined on Errors
   * @param {Boolean|undefined} ValidCheck Package should check its validity as proxy
   * @returns {Promise<Proxy|undefined|Error>} Proxy Data or undefined on errors
   */

  static async randomOne(ValidCheck = true) {
    return await ProxyGen.random(1, ValidCheck)[0];
  }

  /**
   * @method fetchOne() -> Fetch 1 Proxy from Valid Website and Returns as proxy Data or undefined on Errors
   * @param {Boolean|undefined} ValidCheck Package should check its validity as proxy
   * @returns {Promise<Proxy|undefined|Error>} Proxy Data or undefined on errors
   */

  static async fetchOne(
    ProxyGenWebsite = 'https://sslproxies.org/',
    ValidCheck = true,
  ) {
    return await ProxyGen.fetch(1, ProxyGenWebsite, ValidCheck)[0];
  }

  /**
   * @method validity() -> Checks Proxy Validity with the help of IP and Port
   * @param {Number|String} IP Ip address of the Proxy
   * @param {Number|String} Port Port of the Proxy
   * @returns {Promise<Boolean|undefined>} true if its valid or else false or undefined
   */

  static async validity(IP, Port) {
    const result = await ProxyCheck(`${IP}:${Port}`).catch((error) => void null);
    return result;
  }

  static async #proxyModel(Limit, RawProxiesData, ValidCheckif) {
    const UserProxyArray = [];
    for (
      let count = 0, len = RawProxiesData.ip_addresses.length;
      count < len;
      ++count
    ) {
      if (Limit <= count) break;
      else if (
        ValidCheckif
        && (await ProxyGen.validity(
          RawProxiesData.ip_addresses[count],
          RawProxiesData.port_numbers[count],
        )) === true
      ) {
        UserProxyArray.push({
          ip: RawProxiesData.ip_addresses[count],
          port: RawProxiesData.port_numbers[count],
          code: RawProxiesData.country_codes[count],
          country: RawProxiesData.country_names[count],
          type: RawProxiesData.proxy_types[count],
          updated: RawProxiesData.last_updates[count],
          https: !!RawProxiesData.https_booleans[count] ?? false,
          httpsurl: RawProxiesData.https_booleans[count]
            ? `https://${RawProxiesData.ip_addresses[count]}:${RawProxiesData.port_numbers[count]}`
            : undefined,
          url: `${RawProxiesData.ip_addresses[count]}:${RawProxiesData.port_numbers[count]}`,
        });
      } else if (!ValidCheckif) {
        UserProxyArray.push({
          ip: RawProxiesData.ip_addresses[count],
          port: RawProxiesData.port_numbers[count],
          code: RawProxiesData.country_codes[count],
          country: RawProxiesData.country_names[count],
          type: RawProxiesData.proxy_types[count],
          updated: RawProxiesData.last_updates[count],
          https: RawProxiesData.https_booleans[count] ?? false,
          httpsurl: RawProxiesData.https_booleans[count]
            ? `https://${RawProxiesData.ip_addresses[count]}:${RawProxiesData.port_numbers[count]}`
            : undefined,
          url: `${RawProxiesData.ip_addresses[count]}:${RawProxiesData.port_numbers[count]}`,
        });
      }
    }
    return UserProxyArray;
  }
}

module.exports = {
  default: ProxyGen,
  fetch: ProxyGen.fetch,
  fetchOne: ProxyGen.fetchOne,
  fetchBycountry: ProxyGen.fetchBycountry,
  random: ProxyGen.random,
  randomOne: ProxyGen.randomOne,
  validity: ProxyGen.validity,
};
