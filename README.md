# interpretjevko.js

Explicit decoding of Jevko syntax trees into specific types.

```js
let port
{
  let _ = parseJevko(`
last modified 1 April 2001 by John Doe
owner [
  name [John Doe]
  organization [Acme Widgets Inc.]
]
database [
  use IP if name resolution is not working
  server [192.0.2.62]
  port [143]
  file ['payroll.dat']
  select columns [
    [name]
    [address]
    [phone number]
  ]
]
`)
  _ = toMap(_)
  _ = mapAt(_, 'database')
  _ = toMap(_)
  _ = mapAt(_, 'port')
  port = toNumber(_)
}
```