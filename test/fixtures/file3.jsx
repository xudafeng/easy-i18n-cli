function render() {
  const foo = 'bar';
  let test = (__i18n('{foo}， xxx！', { foo }));
  test = __i18n(
    '-{foo}-， xxx！-'
  , {
    foo
  });
  return test;
}
