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

/**
 * Default Filter Options for fetch method
 */
const DefaultFilter = {
  country: false,
  random: true,
};

class ProxyGen {
  static #RandomProxyCache = undefined;

  /**
   * @method fetch() -> Fetch Proxy from Valid Website and Returns as Array or undefined on Errors
   * @param {String|Number|undefined} Limit Max Number of Proxies should be returned | "all" to get all proxies at once or 1,2,3...
   * @param {String|undefined} ProxyGenWebsite Website to scrap proxies , remain undefined to fetch from default website
   * @param {Boolean|undefined} ValidCheck Package should check its validity as proxy
   * @param {DefaultFilter<Object>|undefined} Filter Filters for fetch method like country or https
   * @returns {Promise<Proxy[]|undefined|Error>} array of Proxy or undefined on errors
   */
  static async fetch(
    Limit = 10,
    ProxyGenWebsite = 'https://sslproxies.org/',
    ValidCheck = true,
    Filter = DefaultFilter,
  ) {
    if (Limit <= 0) return void null;
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
      return await ProxyGen.#proxyModel(
        Limit.toLowerCase().trim() === 'all'
          ? RawProxies.ip_addresses.length - 1
          : Limit,
        RawProxies,
        ValidCheck,
        Filter,
      );
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
    return await ProxyGen.fetch(Limit, ProxyGenWebsite, ValidCheck, {
      country: true,
    });
  }

  /**
   * @method random() -> Fetch Random Proxy from Default Website and Returns as Array or undefined on Errors
   * @param {Number|undefined} Limit Max Number of Proxies should be returned
   * @param {Boolean|undefined} ValidCheck Package should check its validity as proxy
   * @returns {Promise<Proxy[]|undefined|Error>} array of Proxy or undefined on errors
   */

  static async random(Limit = 10, ValidCheck = true) {
    return await ProxyGen.fetch(Limit, 'https://sslproxies.org/', ValidCheck, {
      random: true,
    });
  }

  /**
   * @method randomOne() -> Fetch 1 Random Proxy from Default Website and Returns as proxy Data or undefined on Errors
   * @param {Boolean|undefined} ValidCheck Package should check its validity as proxy
   * @returns {Promise<Proxy|undefined|Error>} Proxy Data or undefined on errors
   */

  static async randomOne(ValidCheck = true) {
    return (await ProxyGen.random(1, ValidCheck))[0];
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
    return (await ProxyGen.fetch(1, ProxyGenWebsite, ValidCheck))[0];
  }

  /**
   * @method validity() -> Checks Proxy Validity with the help of IP and Port
   * @param {Number|String} IP Ip address of the Proxy
   * @param {Number|String} Port Port of the Proxy
   * @returns {Promise<Boolean|undefined>} true if its valid or else false or undefined
   */

  static async validity(IP, Port) {
    return await ProxyCheck(`${IP}:${Port}`).catch((error) => void null);
  }

  /**
   * @private "CountryFilter() -> Filter of Data m"
   * @param {Object[]} RawProxies Raw Proxies from axios
   * @param {String|Object[]} CountryAlias Country name or code alais in String or Array
   * @returns {Object[]|undefined} Country Filtered Data
   */

  static #CountryFilter(Limit = 1, RawProxies, CountryAlias) {
    const CountryBYProxies = [];
    for (let count = 0, len = RawProxies.length; count < len; ++count) {
      if (Limit <= CountryBYProxies.length) break;
      else if (
        (typeof CountryAlias === 'object'
          && CountryAlias[0]
          && ((RawProxies.country_codes[count]
            && CountryAlias.includes(RawProxies.country_codes[count].trim()))
            || (RawProxies.country_names[count]
              && CountryAlias.includes(
                RawProxies.country_names[count].trim(),
              ))))
        || (RawProxies.country_codes[count]
          && CountryAlias.tolowerCase().trim()
            === RawProxies.country_codes[count].toLowerCase().trim())
        || (RawProxies.country_names[count]
          && CountryAlias.tolowerCase().trim()
            === RawProxies.country_names[count].toLowerCase().trim())
      ) {
        CountryBYProxies.ip_addresses.push(RawProxies.ip_addresses[count]);
        CountryBYProxies.port_numbers.push(RawProxies.port_numbers[count]);
        CountryBYProxies.country_codes.push(RawProxies.country_codes[count]);
        CountryBYProxies.country_names.push(RawProxies.country_names[count]);
        CountryBYProxies.proxy_types.push(RawProxies.proxy_types[count]);
        CountryBYProxies.last_updates.push(RawProxies.last_updates[count]);
        CountryBYProxies.https_booleans.push(
          !!RawProxies.https_booleans[count] ?? false,
        );
      }
    }
    return CountryBYProxies;
  }

  static async #proxyModel(Limit = 1, RawProxiesData, ValidCheckif, Filter) {
    RawProxiesData = Filter.country
      ? ProxyGen.#CountryFilter(Limit, RawProxiesData, Filter.country)
      : RawProxiesData;
    const UserProxyArray = [];
    let ProxyIndex = null;
    for (
      let count = 0, len = RawProxiesData.ip_addresses.length;
      count < len;
      ++count
    ) {
      if (Limit <= UserProxyArray.length) break;
      else if (Filter && Filter.random) {
        ProxyIndex = Math.floor(Math.random() * (RawProxiesData.ip_addresses.length - 1)) + 1;
        if (
          ProxyGen.#RandomProxyCache
            !== RawProxiesData.ip_addresses[ProxyIndex - 1]
          && ValidCheckif
          && (await ProxyGen.validity(
            RawProxiesData.ip_addresses[ProxyIndex - 1],
            RawProxiesData.port_numbers[ProxyIndex - 1],
          )) === true
        ) {
          UserProxyArray.push({
            ip: RawProxiesData.ip_addresses[ProxyIndex - 1],
            port: RawProxiesData.port_numbers[ProxyIndex - 1],
            code: RawProxiesData.country_codes[ProxyIndex - 1],
            country: RawProxiesData.country_names[ProxyIndex - 1],
            type: RawProxiesData.proxy_types[ProxyIndex - 1],
            updated: RawProxiesData.last_updates[ProxyIndex - 1],
            https: !!RawProxiesData.https_booleans[ProxyIndex - 1] ?? false,
            httpsurl: RawProxiesData.https_booleans[ProxyIndex - 1]
              ? `https://${RawProxiesData.ip_addresses[ProxyIndex - 1]}:${
                RawProxiesData.port_numbers[ProxyIndex - 1]
              }`
              : undefined,
            url: `${RawProxiesData.ip_addresses[ProxyIndex - 1]}:${
              RawProxiesData.port_numbers[ProxyIndex - 1]
            }`,
          });
          if (
            ProxyGen.#RandomProxyCache
            !== RawProxiesData.ip_addresses[ProxyIndex - 1]
          ) ProxyGen.#RandomProxyCache = RawProxiesData.ip_addresses[ProxyIndex - 1];
        }
      } else if (
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
      } else if (
        !(
          Filter
          && Filter.random
          && ProxyGen.#RandomProxyCache === RawProxiesData.ip_addresses[count]
        )
        && !ValidCheckif
      ) {
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
