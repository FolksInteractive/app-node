canViewRelationById = function(relationId, userId){
  // Must a client or a vendor to see a Relation
  return(isVendor(relationId, userId) || isClient(relationId, userId));
}

canEditRelationById = function(relationId, userId){
  // Must a client or a vendor to see a Relation
  return(isVendor(relationId, userId) || isClient(relationId, userId));
}

canPostMessageInRelationById = function(relationId, userId){
  // if user can view the relation he can also post messages
  return canViewRelationById(relationId, userId);
}