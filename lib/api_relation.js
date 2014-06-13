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

  userId =  _.isObject(user) ? user._id :  user;

  return !!relation && relation.clientId === userId;
}

isVendor = function(relation, user){
  if(_.isString(relation))
    relation = getRelation(relation);

  userId =  _.isObject(user) ? user._id :  user;

  return !!relation && relation.vendorId === userId;
}

getContact = function(relation){
  if(_.isString(relation))
    relation = getRelation(relation);
  
  if(isClient(relation, Meteor.userId()))
    return getUser(relation.vendorId);

  if(isVendor(relation, Meteor.userId()))
    return getUser(relation.clientId);
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