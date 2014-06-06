getRelations = function(options){
  options = options || {};

  return Relations.find(options).fetch();
}

getRelation = function(relationId){
  return Relations.findOne(relationId);
}

getFirstRelation = function(userId){
  return Relations.findOne({'$or' : [{'clientId': userId}, {'vendorId': userId}]})
}

isClient = function(relationId, userId){
  var relation = getRelation(relationId);
  return !!relation && relation.clientId === userId;
}

isVendor = function(relationId, userId){
  var relation = getRelation(relationId);
  return !!relation && relation.vendorId === userId;
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