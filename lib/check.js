NonEmptyString = Match.Where(function (value) {
  check(value, String);
  return !_.isEmpty(value);
});