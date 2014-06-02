getRelation = function(relationId){
  return Relations.findOne(relationId);
}

isClient = function(relationId, userId){
  var relation = getRelation(relationId);
  return !!relation && relation.clientId === userId;
}

isVendor = function(relationId, userId){
  var relation = getRelation(relationId);
  return !!relation && relation.vendorId === userId;
}