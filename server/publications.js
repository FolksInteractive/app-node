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
  var messagesCursor = Messages.find({
    'relationId' : relationId, 
    '$or': [
      {'draft': false},
      {'$and':[{
        'draft':true, 
        'authorId':this.userId
      }]}
    ]      
  });

  var messagesId = _.pluck(messagesCursor.fetch(), '_id');

  var publications = [
    Relations.find({'_id' :relationId}),
    // Publish published message and the draft one which the user is the author
    messagesCursor,
    Comments.find({
      'messageId' : {
        '$in' : messagesId
      }
    }),
    Meteor.users.find({'_id': {'$in':[relation.clientId, relation.vendorId]}}),
    Files.find({'relationId' : relationId}),
    Objectives.find({'relationId' : relationId}),
    ProgressNotes.find({'relationId' : relationId})
  ]

  return publications;
})