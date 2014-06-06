Meteor.publish('relations', function(){

  if(!this.userId)
    return [];

  return Relations.find({'$or' : [{'clientId': this.userId}, {'vendorId': this.userId}]})
})

Meteor.publish('relation', function(relationId){

  if(!this.userId || !relationId || !canViewRelationById(relationId, this.userId))
    return [];

  var relation = getRelation(relationId);

  var publications = [
    Relations.find({'_id' :relationId}),
    Messages.find({'relationId' : relationId}),
    Meteor.users.find({'_id': {'$in':[relation.clientId, relation.vendorId]}}),
    Files.find({'relationId' : relationId}),
    Objectives.find({'relationId' : relationId})
  ]

  return publications;
})