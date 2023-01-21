const assert = (pred, msg) => {
  console.assert(pred, msg)
  if (pred === false) throw Error(msg)
}

export const prefixToKey = (prefix) => {
  let key = prefix.trim()
  // todo: optimize -- use indices instead of slicing
  while (true) {
    if (key.startsWith("'")) return key
    // todo: support other kinds of newlines
    const nli = key.indexOf('\n')
    if (nli === -1) break
    key = key.slice(nli + 1).trimStart()
  }
  return key
}

export const toMap = (jevko) => {
  const {subjevkos, tag, suffix} = jevko
  if (subjevkos.length === 0) return Object.create(null)
  // assert(suffix.trim() === '')
  assert(tag === undefined, `Unexpected tag: ${tag}`)
  const ret = Object.create(null)
  for (const {prefix, jevko} of subjevkos) {
    let key = prefixToKey(prefix)
    // skip over commented-out entries
    if (key.startsWith("-")) continue

    if (key.startsWith("'")) {
      // note: allow unclosed string literals
      if (key.at(-1) === "'") key = key.slice(1, -1)
      else key = key.slice(1)
    }

    if (key === '') throw Error('Empty key!')
    if (key in ret) throw Error(`Duplicate key '${key}'!`)
    ret[key] = jevko
  }
  return ret
}

export const mapAt = (map, key) => map[key]

export const toNumber = (jevko) => {
  const {subjevkos, tag, suffix} = jevko

  assert(subjevkos.length === 0, `Expected 0 subjevkos, got ${subjevkos.length}`)
  assert(tag === undefined, `Unexpected tag: ${tag}`)

  const trimmed = suffix.trim()

  assert(trimmed !== '', `Unexpected blank suffix!`)

  if (trimmed === 'NaN') return NaN

  const num = Number(trimmed)

  if (Number.isNaN(num) === false) return num

  throw Error('NaN')
}

export const toList = (jevko) => {
  const {subjevkos, tag, suffix} = jevko
  if (subjevkos.length === 0) return []
  // assert(suffix.trim() === '')
  assert(tag === undefined, `Unexpected tag: ${tag}`)
  const ret = []
  for (const {prefix, jevko} of subjevkos) {
    let key = prefixToKey(prefix)
    // skip over commented-out entries
    if (key.startsWith("-")) continue

    if (key !== '') throw Error('Nonempty key!')
    ret.push(jevko)
  }
  return ret
}

export const toBoolean = (jevko) => {
  const {subjevkos, tag, suffix} = jevko

  assert(subjevkos.length === 0, `Expected 0 subjevkos, got ${subjevkos.length}`)
  assert(tag === undefined, `Unexpected tag: ${tag}`)

  const trimmed = suffix.trim()

  if (trimmed === 'true') return true
  if (trimmed === 'false') return false
  
  throw Error('oops')
}

export const toString = (jevko) => {
  const {subjevkos, tag, suffix} = jevko

  assert(subjevkos.length === 0, `Expected 0 subjevkos, got ${subjevkos.length}`)
  assert(tag === undefined, `Unexpected tag: ${tag}`)

  const trimmed = suffix.trim()

  if (trimmed.startsWith("'")) {
    // note: allow unclosed string literals
    if (trimmed.at(-1) === "'") return trimmed.slice(1, -1)
    return trimmed.slice(1)
  }

  return trimmed
}

export const asJson = (jevko) => {
  const {subjevkos, tag, suffix} = jevko

  assert(subjevkos.length === 0, `Expected 0 subjevkos, got ${subjevkos.length}`)
  assert(tag === 'json', `Expected tag to be 'json', got '${tag}'`)

  return JSON.parse(suffix)
}