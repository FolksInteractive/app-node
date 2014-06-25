getRelations = function(options){
  options = options || {};

  return Relations.find(options).fetch();
}

getClients = function(){
  return getRelations({'vendorId' : Meteor.userId()});
}

getVendors = function(){
  return getRelations({'clientId' : Meteor.userId()});
}

getRelation = function(relationId){
  return Relations.findOne(relationId);
}

getFirstRelation = function(userId){
  return Relations.findOne({'$or' : [{'clientId': userId}, {'vendorId': userId}]})
}

isClient = function(relation, user){
  if(_.isString(relation))
    relation = getRelation(relation);

  if(!relation)
    return false;

  if(_.isString(user))
    user = getUser(user);

  if(relation.clientId && user)
    return relation.clientId === user._id;
 
  // We need to check more than the clientId because a pending invitation is possible. 
  // So we need to also check the email in the relation invitation
  if(user && user.emails)
    return _.contains(_.pluck(user.emails, 'address')||[], relation.invitation.email);

  return false;
}

isVendor = function(relation, user){
  if(_.isString(relation))
    relation = getRelation(relation);

  if(!relation)
    return false;

  if(_.isString(user))
    user = getUser(user);

  if(relation.vendorId && user)
    return relation.vendorId === user._id;

  // We need to check more than the vendorId because a pending invitation is possible. 
  // So we need to also check the email in the relation invitation
  if(user && user.emails)
    return _.contains(_.pluck(user.emails, 'address')||[], relation.invitation.email);

  return false;
}

getContact = function(relation){
  if(_.isString(relation))
    relation = getRelation(relation);
  
  if(!relation)
    return null;

  var contact;

  if(isClient(relation, Meteor.userId()))
    contact = getUser(relation.vendorId);

  if(isVendor(relation, Meteor.userId()))
    contact = getUser(relation.clientId);

  if(contact)
    return contact;

  // Check if the contact could in a pending invitation
  // We create a stub contact with the correct email address
  if(relation.invitation)
    return {
      'emails' : [{
        'address' : relation.invitation.email
      }]
    }

  return null;
}

getDraftFilesByRelationId = function(relationId){
  return getFiles({'relationId' : relationId, 'draft' : true});
}

hasDraftFilesByRelationId = function(relationId){
  return countFiles({'relationId' : relationId, 'draft' : true}) > 0;
}

getFilesByRelationId = function(relationId){
  return getFiles({'relationId': relationId});
}