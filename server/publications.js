Meteor.publish('relation', function(relationId){

  if(!this.userId || !relationId || !canViewRelationById(relationId, this.userId))
    return [];

  var relation = getRelation(relationId);

  return [
    Relations.find({'_id' :relationId}),
    Messages.find({'relationId' : relationId}),
    Meteor.users.find({'_id': {'$in':[relation.clientId, relation.vendorId]}})
  ]
})