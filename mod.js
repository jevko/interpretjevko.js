const assert = (pred, msg) => {
  console.assert(pred, msg)
  if (pred === false) throw Error(msg)
}

export const toMap = (jevko) => {
  const {subjevkos, suffix} = jevko
  assert(suffix.trim() === '')
  const ret = Object.create(null)
  for (const {prefix, jevko} of subjevkos) {
    if (prefix === '') throw Error('oops')

    let key
    //?todo: extract & dedupe w/ inner
    if (prefix.startsWith("'")) {
      // note: allow unclosed string literals
      if (prefix.at(-1) === "'") key = prefix.slice(1, -1)
      else key = prefix.slice(1)
    } else key = prefix

    if (key in ret) throw Error('dupe')
    ret[key] = jevko
  }
  return ret
}

export const mapAt = (map, key) => map[key]

export const toNumber = (jevko) => {
  const {subjevkos, tag, suffix} = jevko

  assert(subjevkos.length === 0)
  assert(tag === undefined)

  const trimmed = suffix.trim()

  assert(trimmed !== '')

  if (trimmed === 'NaN') return NaN

  const num = Number(trimmed)

  if (Number.isNaN(num) === false) return num

  throw Error('NaN')
}