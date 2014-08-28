Objectives = new Meteor.Collection('objectives');

Meteor.methods({
  'draft_objective' : function(params){    
    check(params, {
      'messageId' : String,
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)

    // Looking for a draft message created by the user
    var message = Messages.findOne({
      '_id' : params.messageId,
      'authorId' : this.userId,
      'draft' : true
    });

    if(!message)
      throw new Meteor.Error(403, "Can't find draft message.");

    var insertParams = {
      'draft' : true,
      'title' : '',
      'progress' : 0,
      'relationId' : message.relationId,
      'messageId'  : message._id,
      'createdAt' : new Date(),
    }

    return Objectives.insert(insertParams);

  },

  'write_objective' : function(params){
    check(params, {
      'objectiveId' : String,
      'title' : Match.Optional(String),
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)
    
    // Looking for the objective
    var objective = Objectives.findOne({
      '_id' : params.objectiveId
    });

    if(!objective)
      throw new Meteor.Error(403, "Can't find draft objective.");

    var message = Messages.findOne(objective.messageId);

    if(message.authorId != this.userId)
      throw new Meteor.Error(403, "User doesn't have the rights to edit this message.");

    return Objectives.update(params.objectiveId, {'$set':{
        'title' : params.title || ''
      }
    });
  },

  'remove_objective' : function(params){
    check(params, {
      'objectiveId' : String
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)
    
    // Looking for the objective
    var objective = Objectives.findOne({
      '_id' : params.objectiveId
    });

    if(!objective)
      throw new Meteor.Error(403, "Can't find draft objective.");

    var message = Messages.findOne(objective.messageId);

    if(message.authorId != this.userId)
      throw new Meteor.Error(403, "User doesn't have the rights to edit this message.");

    return Objectives.remove(params.objectiveId);
  }
});