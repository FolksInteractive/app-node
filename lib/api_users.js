getUser = function(userId){
  return Meteor.users.findOne(userId);
}

getFullname = function(user){  
  // Convert userId to user if it is the case
  user = _.isString(user) ? getUser(user) : user;

  if(!user)
    return "";

  if(user.profile && user.profile.firstname && user.profile.lastname)
    return user.profile.firstname + " " + user.profile.lastname;

  if(user.emails && user.emails.length > 0)
    return user.emails[0].address;

  return "";
}

getAvatar = function(user){  
  // Convert userId to user if it is the case
  user = _.isString(user) ? getUser(user) : user;
  
  if(user && user.profile.pictureUrl)
    return user.profile.pictureUrl;

  return '/img/avatar.png';
}