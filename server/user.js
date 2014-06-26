Accounts.onCreateUser(function(option, user){
  console.log(option);
  // Normalizing linkedin user
  if(_.isObject(user.services.linkedin)){
    normalized = normalizeLinkedinUser(user.services.linkedin);
    user = _.extend(user, normalized);
  }

  // Check if there is a pending registration
  var linkedinId = user.services.linkedin.id;
  existingUser = Meteor.users.findOne({'linkedinId': linkedinId});

  if(!existingUser)
    return user;

  existingUser = _.extend(existingUser, _.omit(user, "_id"));
  existingUser.services.linkedin = _.pick(user.services.linkedin, ['accessToken']);

  // even worse hackery
  Meteor.users.remove({_id: existingUser._id}); // remove existing record
  return existingUser;                          // record is re-inserted
});