var url = Npm.require('url');

Accounts.onCreateUser(function(options, user) {

  if(options.profileUrl){
    var profileUrl = url.parse(options.profileUrl);
    console.log(profileUrl);
  }
  // We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;

  return user;
});