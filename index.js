
var axios = require('axios')
//var util = require('util')
var crypto = require("crypto");

let ShellyPassword = "NuovaPassword";
let host = "192.168.33.1" //  "192.168.2.240";
const ShellyRealm = 'shellyplus1-7c87ce7213ec'

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

complementAuthParams = (authParams, username, password) => {

  var digestAuthObject = {}

  digestAuthObject.nc = '00000001'
  digestAuthObject.qop = 'auth'
  digestAuthObject.nonce = authParams.nonce
  digestAuthObject.cnonce = String(Math.floor(Math.random() * 10e8))
  digestAuthObject.method = 'GET'
  digestAuthObject.realm = authParams.realm
  digestAuthObject.uri = '/rpc/Switch.Set?id=0&on=true&toggle_after=1'

  digestAuthObject.ha1 = HexHash(username + ':' + authParams.realm + ':' + password);
  digestAuthObject.ha2 = HexHash(`${authParams.method}:${authParams.uri}`)

  digestAuthObject.resp = digest(username, password, digestAuthObject.realm, digestAuthObject.method, digestAuthObject.uri, digestAuthObject.nonce, digestAuthObject.nc, digestAuthObject.cnonce)

  return digestAuthObject
};

const setWiFi = async () => {
  var url = `http://${host}/rpc/WiFi.SetConfig?config={"ap":{"ssid":"${ShellyRealm}","pass":"${ShellyPassword}","enable":true}}`
  var response = await axios.get(url)
    .catch((error) => {
      console.log('setAuth Error: ', error);
    });

  console.log('setWiFi response:', response);
}

const setAuth = async () => {
  //const ssid = 'shellyplus1-7c87ce7213ec'
  const ha1 = HexHash(`admin:${ShellyRealm}:${ShellyPassword}`)  // "7a89f0e64fac6814c3e5281dd0698532bc93d7d7f20ccf8ae995dcd58c22c8a7"

  var url = `http://${host}/rpc/Shelly.SetAuth?user="admin"&realm="${ShellyRealm}"&ha1="${ha1}"`
  var response = await axios.get(url)
    .catch((error) => {
      console.log('setAuth Error: ', error);
    });

  console.log('setAuth response:', response);
}

const toggleSwitch = async () => {

   var url = `http://${host}/rpc/Switch.Set?id=0&on=true&toggle_after=1`

  try {
    var response = await axios({ method: 'get', url: url, headers: { 'Parametro': 'PAR1' } })

  } catch (error) {
    if (!error.response) {
      console.error('NON FUNZIONA toggleSwitch response:', error.message);
    }

    if (error.response.status == 401) {
      // look up the challenge header
      let authHeader = error.response.headers["www-authenticate"];
      if (authHeader == undefined)
        return reject(new Error("WWW-Authenticate header is missing in the response?!"));

      try {

        const authParams = extractAuthParams(authHeader);
        const result = complementAuthParams(authParams, "admin", ShellyPassword);

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


// Set Password WiFi - Setta la password del WiFi. Bisogna ricollegarsi nuovamente specificando la password usata
// setWiFi()

// Set Password Accesso - Una volta collegato al WiFi bisogna settare l'autenticazione per tutte le route
// setAuth()

// Toggle Switch On e Off dopo 1 sec
toggleSwitch()

