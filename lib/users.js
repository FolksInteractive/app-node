getUser = function(userId){
  return Meteor.users.findOne(userId);
}

getFullname = function(user){
  console.log(user);
  
  // Convert userId to user if it is the case
  user = _.isString(user) ? getUser(user) : user;

  if(!user)
    return;

  if(user.profile && user.profile.firstname && user.profile.lastname)
    return user.profile.firstname + " " + user.profile.lastname;
}

getAvatar = function(user){  
  // Convert userId to user if it is the case
  user = _.isString(user) ? getUser(user) : user;

  if(!user)
    return '/img/avatar.png';

  return '/img/avatar.png';
}