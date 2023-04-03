
var http = require("http");
var crypto = require("crypto");

authParams_t = {
  username: '',
  nonce: '',
  cnonce: '',
  realm: '',
  algorithm: '',
  response: '',
}

JRPCPost_t = {
  id: 0,
  method: '',
  params: '',
  auth: {}
}


shellyHttpHashAlgo = "sha256";

HexHash = (str) => {
  return crypto.createHash(shellyHttpHashAlgo).update(str).digest("hex");
};

// const static_noise_sha256 = ':auth:6370ec69915103833b5222b368555393393f098bfbfbb59f47e0590af135f062'; // = ':auth:'+HexHash("dummy_method:dummy_uri");

isauthParams = (p) => {
  return (
    p && typeof (p) == 'object'
    && typeof (p.nonce) == 'string'
    && typeof (p.realm) == 'string'
    && typeof (p.algorithm) == 'string'
  );
}

complementAuthParams = (authParams, username, password) => {

  /*
  Authorization: Digest username="admin", realm="shellyplus1-7c87ce7213ec", nonce="642ac5d0", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", qop=auth, nc=00000001, cnonce="12", response="29a74f81d950dd606e27fefd2251d6ca70195c758b688ab1cc15e113f37e260d"
  */

  authParams.username = "admin";
  authParams.nonce = "642ac5d0" // String(parseInt(authParams.nonce, 16));
  authParams.cnonce ="12"       // String(Math.floor(Math.random() * 10e8));

  let resp = HexHash(username + ":" + authParams.realm + ":" + password);
  resp += ":" + authParams.nonce;
  resp += ":1:" + authParams.cnonce + ':auth:' + HexHash("GET:/rpc/Switch.Set?id=0&on=true&toggle_after=1");;

  authParams.response = HexHash(resp);

};


shellyHttpUsername = "admin"; // always


const match_dquote_re = /^\"|\"$/g;
const match_coma_space_re = /,? /;

//throws error on unexpected algos or missing/invalid header parts!
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

//shellyHttpCall = (postdata, host, password) => {
//  return new Promise((resolve, reject) => {

//    const options = {
//      hostname: host,
//      port: 80,
//      path: (postdata.method || "/rpc"),
//      method: "POST",
//      headers: {
//        "Content-Type": "application/json",
//      },
//      timeout: 10000
//    };

//    const req = http.request(options, async (response) => {
//      let buffer = Buffer.alloc(0);

//      if (response.statusCode == 401) {
//        // Not authenticated
//        if (password == '') {
//          return reject(new Error("Failed to authenticate!"));
//        }
//        // look up the challenge header
//        let authHeader = response.headers["www-authenticate"];
//        if (authHeader == undefined) {
//          return reject(new Error("WWW-Authenticate header is missing in the response?!"));
//        }
//        try {
//          const authParams = extractAuthParams(authHeader);
//          complementAuthParams(authParams, shellyHttpUsername, password);

//          // Retry with challenge response object
//          postdata.auth = authParams;
//          return resolve(await shellyHttpCall(postdata, host, ''));
//        } catch (e) {
//          if (!(e instanceof Error)) e = new Error(String(e));
//          return reject(e);
//        }
//      }

//      //Authenticated, or no auth needed! fetch data:

//      response.on("error", (error) => {
//        reject(error);
//      });

//      response.on("timeout", () => {
//        reject(new Error("Timeout"));
//      });

//      response.on("data", (chunk) => {
//        buffer = Buffer.concat([buffer, chunk]);
//      });

//      response.on("end", () => {
//        resolve(buffer.toString("utf8"));
//      });

//    });

//    //setup request error listeners, write post data, indicate write end:

//    req.on("timeout", () => {
//      req.destroy();
//      reject(new Error("Timeout"));
//    });

//    req.on("error", (error) => {
//      reject(new Error("Request error:" + String(error)));
//    })

//    req.write(JSON.stringify(postdata));
//    req.end();
//  });
//};

//exports.shellyHttpCall = shellyHttpCall
exports.HexHash = HexHash
exports.extractAuthParams = extractAuthParams
exports.complementAuthParams = complementAuthParams
