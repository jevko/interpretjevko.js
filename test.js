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
  `)

  let _ = mod.toMap(jevko)
  _ = mod.toList(_.list)

  const str = mod.toString(_[2])
  const num = mod.toNumber(_[3])
  const lis = mod.toList(_[4]).map(_ => mod.toString(_))

  assertEquals(str, "hello")
  assertEquals(num, 400.9)
  assertEquals(lis, ["x", "y", "z"])
})