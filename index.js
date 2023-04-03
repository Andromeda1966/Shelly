
var { JRPCPost_t, shellyHttpCall, HexHash, extractAuthParams } = require("./utility")
var axios = require('axios')


//function usage ()  {
//  console.error(
//    `To modify the JRPC call you can use this parameters:

//  --host|-h <host>
//      the host to call to, ip addres or DNS resolvable name this is also
//      loaded from .env or HOST envirnoment variable

//  --pass|-p <password>
//      the passwod to use. Better store this in .env or pass via envirnoment
//      variable PASS

//  --method|-m <method>
//      The method to be envoked on the device, if not set 
//      Shelly.GetStatus is called.

//  --params|--args|-a '<parameters>'
//      JSON formated parameters to pass to the remote method. This must be 
//      strict JSON parsable: strings and keys always doble quoted, no trailing
//      coma. Most probably the parameters JSON must be surrownded with single
//      quotes as shown.

//  -q
//      Print only result on stdout. N.B. this is almost equivalent 
//      to 2>/dev/null

//  --no-format|--noformat
//      explicityl strip any formating from device response. This should
//      collapse the response to single line.

//Any unknown param is considered error and this help is shown
//`);
//  process.exit(-1);
//}

//let i = 2;
//const argl = process.argv.length;
//for (; i < argl; i++) {

//  let opt = process.argv[i];
//  let opt_arg  = process.argv[i + 1];
//  switch (opt) {
//    case "--host":
//    case "-h": {
//      if (opt_arg == undefined) usage();
//      host = opt_arg.trim();
//      i++;
//      continue;
//    }
//    case "--pass":
//    case "-p": {
//      if (opt_arg == undefined) usage();
//      password = opt_arg.trim();
//      i++;
//      continue;
//    }
//    case "--method":
//    case "-m": {
//      postData.method = opt_arg.trim();
//      i++;
//      continue;
//    }
//    case "--params":
//    case "--args":
//    case "-a": {
//      //if (opt_arg == undefined) usage();
//      try {
//        postData.params =  { "id": 0 } 
//      } catch (err) {
//        console.error("Params fail to parse. This MUST be strinct JSON. Check if you need to wrap the params in ' ");
//        process.exit(-1);
//      };
//      i++;
//      continue;
//    }
//    case "--quiet":
//    case "-q": {
//      console.error = () => { };
//      continue;
//    }
//    case "--noformat":
//    case "--no-format": {
//      noformat = true;
//      continue;
//    }
//    default: {
//      usage();
//    }
//  }
//}

//if (host == '') {
//  console.error("You need to provide host via .env file or  envirnoment variable HOST or via --host parameter!");
//  usage();
//}


//const postData = {
//  id: 1,
//  method: "Switch.Set",
//  id: 0
//};

//const postdata = {
//  hostname: host,
//  port: 80,
//  path: "/rpc",
//  method: "POST",
//  headers: {
//    "Content-Type": "application/json",
//  },
//  timeout: 10000
//};

let password = "NuovaPassword";
let host = "192.168.3.212";
let noformat = false;

const setWiFi = async () => {
  const ssid = 'shellyplus1-7c87ce7213ec'
  var url = `http://${host}/rpc/WiFi.SetConfig?config={"ap":{"ssid":"${ssid}","pass":"${password}","enable":true}}`
  var response = await axios.get(url)
    .catch((error) => {
      console.log('setAuth Error: ', error);
    });

  console.log('setWiFi response:', response);
}

const setAuth = async () => {
  const ssid = 'shellyplus1-7c87ce7213ec'
  const ha1 = HexHash(`admin:${ssid}:NuovaPassword`)  // "7a89f0e64fac6814c3e5281dd0698532bc93d7d7f20ccf8ae995dcd58c22c8a7"

  var url = `http://${host}/rpc/Shelly.SetAuth?user="admin"&realm="${ssid}"&ha1="${ha1}"`
  var response = await axios.get(url)
    .catch((error) => {
      console.log('setAuth Error: ', error);
    });

  console.log('setAuth response:', response);
}

const toggleSwitch = async () => {
  const ssid = 'shellyplus1-7c87ce7213ec'
  var url = `http://${host}/rpc/Switch.Set?id=0&on=true&toggle_after=1`

  try {
    var response = await axios({ method: 'get', url: url, headers: { 'Parametro': 'PAR1' } })

    //var response = await axios.get(url, {
    //  headers: { 'x-custom-header': 'super header value' }
    //})

  } catch (error) {

    if (error.response.status == 401) {
      // look up the challenge header
      let authHeader = error.response.headers["www-authenticate"];
      if (authHeader == undefined)
        return reject(new Error("WWW-Authenticate header is missing in the response?!"));

      try {
        const authParams = extractAuthParams(authHeader);
        complementAuthParams(authParams, shellyHttpUsername, password);

        // authParams["Content-Type"] = "application/json"

        //console.log({ headers: { 'Authorization': authParams } });
        // Retry with challenge response object
        var parToSend = JSON.stringify(authParams).replace('{', '')
        var parToSend = parToSend.replace('}', ', uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1"')
        var parToSend = parToSend.replace(':', '=')
        var parToSend = parToSend.replace(':', '=')
        var parToSend = parToSend.replace(':', '=')
        var parToSend = parToSend.replace(':', '=')
        var parToSend = parToSend.replace(':', '=')
        var parToSend = parToSend.replace(':', '=')
        var parToSend = parToSend.replace(':', '=')
        var parToSend = parToSend.replace(':', '=')
        var parToSend = parToSend.replace(':', '=')

        var response = await axios({
          method: 'get',
          url: url,
          headers: {
            //'Authorization': `Digest username="admin", realm="shellyplus1-7c87ce7213ec", nonce="${authParams.nonce}", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", response="${authParams.response}"`
            /*
            Authorization: Digest username="admin", realm="shellyplus1-7c87ce7213ec", nonce="642ac396", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", qop=auth, nc=00000001, cnonce="12", response="5778486ab9905150faed5caa303c433ace85b602a4c8d7dfe6811234ed6e605e"
            Authorization: Digest username="admin", realm="shellyplus1-7c87ce7213ec", nonce="642ac5d0", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", qop=auth, nc=00000001, cnonce="12", response="29a74f81d950dd606e27fefd2251d6ca70195c758b688ab1cc15e113f37e260d"
            */
            Authorization: `Digest username="admin", realm="shellyplus1-7c87ce7213ec", nonce="642ac5d0", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", qop=auth, nc=00000001, cnonce="12", response="29a74f81d950dd606e27fefd2251d6ca70195c758b688ab1cc15e113f37e260d"`

          }
        })
        //        var response = await axios({ method: 'get', url: url, headers: { 'Authorization': 'Digest ' + parToSend } })

        //var response = await axios.get(url, {
        //  headers: { 'x-custom-header': 'super header value' } 
        //})

        console.log('toggleSwitch response:', response);

      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}

complementAuthParams = (authParams, username, password) => {
  /*
  Authorization: Digest username="admin", realm="shellyplus1-7c87ce7213ec", nonce="642ac396", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", qop=auth, nc=00000001, cnonce="12", response="5778486ab9905150faed5caa303c433ace85b602a4c8d7dfe6811234ed6e605e"
  Authorization: Digest username="admin", realm="shellyplus1-7c87ce7213ec", nonce="642ac5d0", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", qop=auth, nc=00000001, cnonce="12", response="29a74f81d950dd606e27fefd2251d6ca70195c758b688ab1cc15e113f37e260d"
  */
  authParams.username = 'admin';
  authParams.nonce = "642ac5d0" // authParams.nonce // String(parseInt(authParams.nonce, 16));
  authParams.cnonce = String(Math.floor(Math.random() * 10e8));

  let resp = HexHash(username + ":" + authParams.realm + ":" + password);
  resp += ":" + authParams.nonce;
  resp += ":1:" + authParams.cnonce + ':auth:' + ':auth:' + HexHash("GET:/rpc/Switch.Set?id=0&on=true&toggle_after=1"); // + HexHash("dummy_method:dummy_uri");

  authParams.response = HexHash(resp);
  console.log('response:', authParams.response);

  //let resp = HexHash(username + ":" + authParams.realm + ":" + password);
  //resp += ":" + authParams.nonce;
  //resp += ":1:" + authParams.cnonce + ':auth:' + HexHash("GET:/rpc/Switch.Set?id=0&on=true&toggle_after=1");


};



// Set Password WiFi
// setWiFi()

// Set Password Accesso
// setAuth()

// toggleSwitch
toggleSwitch()


//let config = {
//  method: 'get',
//  maxBodyLength: Infinity,
//  url: 'http://192.168.3.212/rpc/Switch.Set?id=0&on=true&toggle_after=1',
//  headers: {
//    'Authorization': 'Digest username="admin", realm="shellyplus1-7c87ce7213ec", nonce="642a9b0e", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", response="a7d9265d727cfaf22d5342f0e92afda69f4c838d013b3cdd75b7877403dafd49"'
//  },
//  timeout: 60
//};

//axios.request(config)
//  .then((response) => {
//    console.log(JSON.stringify(response.data));
//  })
//  .catch((error) => {
//    console.log(error);
//  });


//var options = {
//  'method': 'GET',
//  'url': 'http://192.168.3.212/rpc/Switch.Set?id=0&on=true&toggle_after=1',
//  'headers': {
//    'Authorization': 'Digest username="admin", realm="shellyplus1-7c87ce7213ec", nonce="642a7c5c", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", response="eda405e30d913858b4c2a9c2862eae3fd9a24cdbf13790f84a3cf34ed2d2036d"'
//  }
//};

//var request = require('request');

//request(options, function (error, response) {
//  if (error)
//    console.log(error);;
//  console.log('Response: "%s"', response.body);
//});



//console.error("Calling method " + postData.method + " on " + host);

//shellyHttpCall(postData, host, password).then((data) => {
//  if (postData.auth) {
//    console.error("Device response post auth: ");
//  } else {
//    console.error("Device response pre auth: ");
//  }
//  try {
//    if (noformat) {
//      console.log(JSON.stringify(JSON.parse(data)));
//    } else {
//      console.log(JSON.stringify(JSON.parse(data), null, 2));
//    }
//  } catch (e) {
//    console.error("failed to parse the responce from the device!");
//    console.error(data);
//    process.exit(-3);
//  }
//}).catch((err) => {
//  console.error("Request failed :", String(err));
//  process.exit(-1);
//});

