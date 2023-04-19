GET /rpc/Switch.Set?id=0&on=true&toggle_after=1 HTTP/1.1
Authorization: Digest username="admin", realm="shellyplus1-7c87ce7213ec", nonce="642daba1", uri="/rpc/Switch.Set?id=0&on=true&toggle_after=1", algorithm="SHA-256", qop=auth, nc=00000001, cnonce="12", response="50318346e0870bbcecc4110a9268b1a0928bc312c6639ee16ab69e45c08b3e37"
Host: 192.168.2.149

HTTP/1.1 200 OK
Server: Mongoose/6.18
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: *
Content-Length: 18
Connection: keep-alive

{"was_on":false}
