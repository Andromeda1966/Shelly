
var axios = require('axios')
var util = require('util')
var crypto = require("crypto");
var ShellyPassword = "NuovaPassword";
var host = "192.168.33.1"
var ShellyRealm = 'shellyplus1-7c87ce7213ec'

const match_dquote_re = /^\"|\"$/g;
const match_coma_space_re = /,? /;

HexHash = (str) => {
  return crypto.createHash("sha256").update(str).digest("hex");
};

isauthParams = (p) => {
  return (
    p && typeof (p) == 'object'
    && typeof (p.nonce) == 'string'
    && typeof (p.realm) == 'string'
    && typeof (p.algorithm) == 'string'
  );
}

extractAuthParams = (authHeader) => {

  let [authType, ...auth_parts] = authHeader.trim().split(match_coma_space_re);

  if (authType.toLocaleLowerCase() != 'digest') {
    throw new Error("WWW-Authenticate header is requesting unusial auth type " + authType + "instead of Digest");
  }

  let authParams = {};
  for (let part of auth_parts) {
    let [_key, _value] = part.split("=");
    _value = _value.replace(match_dquote_re, '');

    if (_key == 'algorithm' && _value != 'SHA-256') {
      throw new Error("WWW-Authenticate header is requesting unusial algorithm:" + _value + " instead of SHA-256");
    }

    if (_key == 'qop') {
      if (_value != 'auth') {
        throw new Error("WWW-Authenticate header is requesting unusial qop:" + _value + " instead of auth");
      }
      continue;
    }

    authParams[_key.trim()] = _value.trim();
  }
  if (!isauthParams(authParams)) {
    throw new Error("invalid WWW-Authenticate header from device?!");
  }
  return authParams;
}

const digest = (username, password, realm, method, uri, nonce, nc, cnonce) => {
  const ha1 = crypto.createHash('sha256').update(`${username}:${realm}:${password}`).digest('hex');
  const ha2 = crypto.createHash('sha256').update(`${method}:${uri}`).digest('hex');
  const response = crypto.createHash('sha256').update(`${ha1}:${nonce}:${nc}:${cnonce}:auth:${ha2}`).digest('hex');

  return response;
}

complementAuthParams = (authParams, uri, username, password) => {

  var digestAuthObject = {}

  digestAuthObject.nc = '00000001'
  digestAuthObject.qop = 'auth'
  digestAuthObject.nonce = authParams.nonce
  digestAuthObject.cnonce = String(Math.floor(Math.random() * 10e8))
  digestAuthObject.method = 'GET'
  digestAuthObject.realm = authParams.realm
  digestAuthObject.uri = uri

  digestAuthObject.ha1 = HexHash(username + ':' + authParams.realm + ':' + password);
  digestAuthObject.ha2 = HexHash(`${digestAuthObject.method}:${digestAuthObject.uri}`)

  digestAuthObject.resp = digest(username, password, digestAuthObject.realm, digestAuthObject.method, digestAuthObject.uri, digestAuthObject.nonce, digestAuthObject.nc, digestAuthObject.cnonce)

  return digestAuthObject
};

const shellySetWiFi = async () => {
  var url = `http://${host}/rpc/WiFi.SetConfig?config={"ap":{"ssid":"${ShellyRealm}","pass":"${ShellyPassword}","enable":true}}`

  try {
    var response = await axios({ method: 'get', url: url })
  } catch (error) {
    if (!error.response) {
      console.error('NON FUNZIONA shellySetWiFi response:', error.message);
    }

    if (error.response.status == 401) {
      let authHeader = error.response.headers["www-authenticate"];
      if (authHeader == undefined)
        return reject(new Error("WWW-Authenticate header is missing in the response?!"));

      try {

        const authParams = extractAuthParams(authHeader);
        const result = complementAuthParams(authParams, `/rpc/WiFi.SetConfig?config={"ap":{"ssid":"${ShellyRealm}","pass":"${ShellyPassword}","enable":true}}`, "admin", ShellyPassword);

        var response = await axios({
          method: 'get',
          url: url,
          headers: {
            Authorization: `Digest username="admin", realm="${result.realm}", nonce=${result.nonce}, uri=${result.uri}, algorithm="SHA-256", qop=${result.qop}, nc=${result.nc}, cnonce=${result.cnonce}, response=${result.resp}`
          }
        })

        console.log('shellySetWiFi response:', response);

      } catch (error) {
        console.error('shellySetWiFi Error:', error);
        return
      }
    }
  }
  console.log('shellySetWiFi Password OK');
}

const shellySetAuth = async () => {
  const ha1 = HexHash(`admin:${ShellyRealm}:${ShellyPassword}`)  // "7a89f0e64fac6814c3e5281dd0698532bc93d7d7f20ccf8ae995dcd58c22c8a7"

  var url = `http://${host}/rpc/Shelly.SetAuth?user="admin"&realm="${ShellyRealm}"&ha1="${ha1}"`
  var response = await axios.get(url)
    .catch((error) => {
      console.error('shellySetAuth Error: ', error);
      return
    });
  console.log('shellySetAuth Password OK');
}

const shellyReboot = async () => {

  var url = `http://${host}/rpc/Shelly.Reboot`
  var response = await axios.get(url)
    .then((result) => {
      console.log('shellyReboot OK');
    })
    .catch((error) => {
      console.error('shellyReboot Error: ', error);
    });
}

const shellyReset = async () => {

  var url = `http://${host}/rpc/Shelly.FactoryReset`
  await axios.get(url)
    .catch((error) => {
      console.error('shellyReset Error: ', error);
    });
  console.log('shellyReset OK');
}

const shellyToggleSwitch = async () => {

  var url = `http://${host}/rpc/Switch.Set?id=0&on=true&toggle_after=1`

  try {
    var response = await axios({ method: 'get', url: url })
  } catch (error) {
    if (!error.response) {
      console.error('NON FUNZIONA toggleSwitch response:', error.message);
    }

    if (error.response.status == 401) {
      let authHeader = error.response.headers["www-authenticate"];
      if (authHeader == undefined)
        return reject(new Error("WWW-Authenticate header is missing in the response?!"));

      try {

        const authParams = extractAuthParams(authHeader);
        const result = complementAuthParams(authParams, '/rpc/Switch.Set?id=0&on=true&toggle_after=1', "admin", ShellyPassword);

        var response = await axios({
          method: 'get',
          url: url,
          headers: {
            Authorization: `Digest username="admin", realm="${result.realm}", nonce=${result.nonce}, uri=${result.uri}, algorithm="SHA-256", qop=${result.qop}, nc=${result.nc}, cnonce=${result.cnonce}, response=${result.resp}`
          }
        })

        console.log('!!! FUNZIONA !!! toggleSwitch response:', response);

      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}

const shellyGetDeviceName = async () => {

  var url = `http://${host}/rpc/Shelly.GetDeviceInfo`
  var response = await axios.get(url)
    .catch((error) => {
      console.error('shellyGetDeviceName Error: ', error);
      return 'shellyGetDeviceName Error:' + error
    });

  console.log('shellyGetDeviceName response:', response.data.id);
  return response.data.id
}


// Inizializzazione

//shellyGetDeviceName()
//  .then((realm) => {
//    console.log('shellyGetDeviceName OK');
//    // Restituisce il nome del device
//    ShellyRealm = realm
//    // Set Password WiFi - Setta la password del WiFi.
//    shellySetWiFi()
//      .then((result) => {
//        // Password WiFi settata - Bisogna ricollegarsi nuovamente specificando la password usata
//        console.log('setWiFi OK');
//        // Set Password Accesso - Una volta collegato al WiFi bisogna settare l'autenticazione per tutte le route
//        shellySetAuth()
//          .then((result) => {
//            // Password Auth settata
//            console.log('shellySetAuth OK');
//            // Toggle Switch On e Off dopo 1 sec
//            shellyToggleSwitch()
//          })
//      })
//  })
//  .catch((error) => {
//    console.error('shellyGetDeviceName Error: ', error);
//  });

// Apri Cancello
shellyToggleSwitch()
