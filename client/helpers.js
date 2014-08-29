
UI.registerHelper('fullname', function(user){
  return getFullname(user);
});

UI.registerHelper('avatar', function(user){
  return getAvatar(user);
});

UI.registerHelper('isLoggedIn', function(user){
  return !!Meteor.userId();
});

UI.registerHelper('isLoggedOut', function(user){
  return !Meteor.userId();
});

UI.registerHelper('date', function(date){
  return moment(date).format('MMMM Do YY');
});



UI.registerHelper('isEmpty', function(array){
  return array.length == 0;
})

UI.registerHelper('isNotEmpty', function(array){
  // check if it a Meteor.Collection
  if(array.count)
    return array.count() > 0;

  return array.length > 0;
})