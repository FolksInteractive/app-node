Meteor.publish('relations', function(){

  if(!this.userId)
    return this.ready();

  var relationsCriteria = { '$or' : [{'clientId': this.userId}, {'vendorId': this.userId} ]};

  var usersIds = _.map(getRelations(relationsCriteria), function(relation){
    return [relation.clientId, relation.vendorId];
  });

  usersIds = _.flatten(usersIds);

  return [
    Relations.find(relationsCriteria),
    Meteor.users.find({'_id': {'$in':usersIds}}),    
  ]
})

Meteor.publish('relation', function(relationId){

  if(!this.userId || !relationId || !canViewRelationById(relationId, this.userId))
    return this.ready();

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