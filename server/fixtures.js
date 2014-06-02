if(Meteor.users.find().count() === 0){
  var clientId = Accounts.createUser({
    'email' : 'alexlm@timecrumbs.com',
    'password' : 'alexlm',
    'profile' : {
      'firstname' : 'Alex',
      'lastname' : 'Le Moëligou'
    }
  });

  var vendorId = Accounts.createUser({
    'email' : 'fpoirier@timecrumbs.com',
    'password' : 'fpoirier',
    'profile' : {
      'firstname' : 'Francis',
      'lastname' : 'Poirier'
    }
  });

  var relationId = Relations.insert({
    'clientId' : clientId,
    'vendorId' : vendorId,
    'createdAt' : new Date().getTime()
  });

  var messageId = Messages.insert({
    'body' : "Fixture Message",
    'type' : MessageTypes.NORMAL,
    'relationId' : relationId,
    'createdAt' : new Date().getTime(),
    'authorId' : clientId
  });

  console.log(relationId);
}