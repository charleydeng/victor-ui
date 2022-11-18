const _bem = (
  prefixedName = '',
  blockSuffix = '',
  element = '',
  modifier = ''
) => {
  if (blockSuffix) {
    prefixedName += `-${blockSuffix}`
  }
  if (element) {
    prefixedName += `__${element}`
  }
  if (modifier) {
    prefixedName += `--${modifier}`
  }
  return prefixedName
}
function createBEM(prefixedName: string) {
  const b = (blockSuffix = '') => _bem(prefixedName, blockSuffix, '', '')
  const e = (element = '') =>
    element ? _bem(prefixedName, '', element, '') : ''
  const m = (modifier = '') =>
    modifier ? _bem(prefixedName, '', '', modifier) : ''
  const be = (blockSuffix = '', element = '') =>
    blockSuffix && element ? _bem(prefixedName, blockSuffix, element, '') : ''
  const em = (element = '', modifier = '') =>
    element && modifier ? _bem(prefixedName, '', element, modifier) : ''
  const bm = (blockSuffix = '', modifier = '') =>
    blockSuffix && modifier ? _bem(prefixedName, blockSuffix, '', modifier) : ''
  const bem = (blockSuffix = '', element = '', modifier = '') =>
    blockSuffix && element && modifier
      ? _bem(prefixedName, blockSuffix, element, modifier)
      : ''
  const is = (name = '', state: boolean) => (state ? `is-${name}` : '')
  return {
    b,
    e,
    m,
    be,
    em,
    bm,
    bem,
    is
  }
}
export function createNamespace(name: string) {
  const prefixedName = `v-${name}`
  return createBEM(prefixedName)
}

/*测试能否使用 */
// const bem = createNamespace('button');
// console.log(bem.b())
// console.log(bem.b('box'))
// console.log(bem.e('element'));
// console.log(bem.m('disabled'))
// console.log(bem.is('checked',true))
// console.log(bem.bem('box', 'element','disabled'))
