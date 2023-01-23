import * as mod from './mod.js'
import {jevkoFromString} from 'https://cdn.jsdelivr.net/gh/jevko/jevko.js@v0.1.5/mod.js'
import { assertEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";

Deno.test('basic', () => {
  const jevko = jevkoFromString(`
    list [
      [a]
      [b]
      [hello]
      [400.9]
      [
        [x][y][z]
      ]
    ]
    person [
      first name [John]
      last name [Smith]
      is alive [true]
      age [27]
      address [
        street address [21 2nd Street]
        city [New York]
        state [NY]
        postal code [10021-3100]
      ]
      phone numbers [
        [
          type [home]
          number [212 555-1234]
        ]
        [
          type [office]
          number [646 555-4567]
        ]
      ]
      children [seq]
      spouse [nil]
    ]
  `)

  const parsePhoneNumber = (jevko) => {
    let _ = mod.toMap(jevko)
    return {
      type: mod.toString(_.type),
      number: mod.toString(_.number),
    }
  }

  const parseSpouse = (jevko) => {
    if (jevko.subjevkos.length === 0) {
      if (jevko.suffix === 'nil') return null
    }
    throw Error('not implemented')
  }

  const parsePerson = (jevko) => {
    let _ = mod.toMap(jevko)
    let address
    {
      let a = mod.toMap(_.address)
      address = {
        streetAddress: mod.toString(a['street address']),
        city: mod.toString(a.city),
        state: mod.toString(a.state),
        postalCode: mod.toString(a['postal code']),
      }
    }
    return {
      firstName: mod.toString(_['first name']),
      lastName: mod.toString(_['last name']),
      isAlive: mod.toBoolean(_['is alive']),
      age: mod.toNumber(_.age),
      address,
      phoneNumbers: mod.toList(_['phone numbers']).map(_ => parsePhoneNumber(_)),
      children: mod.toList(_.children),
      spouse: parseSpouse(_.spouse),
    }
  }

  let _ = mod.toMap(jevko)

  assertEquals(parsePerson(_.person), {
    firstName: "John",
    lastName: "Smith",
    isAlive: true,
    age: 27,
    address: {
      streetAddress: "21 2nd Street",
      city: "New York",
      state: "NY",
      postalCode: "10021-3100"
    },
    phoneNumbers: [
      { type: "home", number: "212 555-1234" },
      { type: "office", number: "646 555-4567" }
    ],
    children: [],
    spouse: null
  })

  _ = mod.toList(_.list)

  const str = mod.toString(_[2])
  const num = mod.toNumber(_[3])
  const lis = mod.toList(_[4]).map(_ => mod.toString(_))

  assertEquals(str, "hello")
  assertEquals(num, 400.9)
  assertEquals(lis, ["x", "y", "z"])
})
