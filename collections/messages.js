Messages = new Meteor.Collection('messages');

Meteor.methods({
  'discard_message': function(params){
    check(params, {
      'messageId': String,
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)

    var message = Messages.findOne({
      '_id': params.messageId,
      'draft' : true,
      'authorId' : this.userId
    });

    if(!message)
      throw new Meteor.Error(403)

    // Instead of deleting the draft message,
    // We only clear its data
    // Resetting draft
    Messages.update(params.messageId, {
      '$set' : {
        'body' : '',
        'draftedAt' : new Date()
      }
    });

    // Removing its attachments
    Objectives.remove({'messageId' : params.messageId});
    Files.remove({'messageId' : params.messageId});
    ProgressNotes.remove({'messageId' : params.messageId});

  },


  'write_message' : function(params){
    check(params, {
      'messageId': String,
      'body' : Match.Optional(String),
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)
    
    // Looking for the message
    var message = Messages.findOne({
      '_id' : params.messageId,
      'draft' : true
    });

    if(!message)
      throw new Meteor.Error(403, "Can't find message.");

    if(message.authorId != this.userId)
      throw new Meteor.Error(403, "User doesn't have the rights to edit this message.");

    return Messages.update(params.messageId, {'$set':{
        'body' : params.body || ''
      }
    });
  },


  'draft_message': function(params){
    check(params, {
      'relationId' : Match.Where(function (id) {
        return !!Relations.findOne(id);
      })
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)

    // Makes sure user can post
    if(!canPostMessageInRelationById(params.relationId, this.userId))
      throw new Meteor.Error(403, "User doesn't have the rights to post message in this relation");


    params = _.extend(params, {
      'relationId': params.relationId,
      'authorId' : this.userId,
      'draft' : true,
    })

    // Make sur there isn't already a draft
    if(message = Messages.findOne(params))
      return message._id;


    params.draftedAt = new Date();

    return Messages.insert(params);
  },




  'post_message' : function(params){
    check(params, {
      'messageId' : String
    })

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


    // Delete all empty objectives
    Objectives.remove({
      'messageId' : params.messageId, 
      'title' : '', 
      'draft' : true
    });

    // Delete all empty ProgressNotes
    ProgressNotes.remove({
      'messageId' : params.messageId, 
      'objectiveId' : {'$exists' : false}
    });

    // Remove draft mode on attachments
    Objectives.update( {'messageId' : params.messageId}, {'$set' : {
      'draft' : false
    }}, {'multi': true});
    Files.update( {'messageId' : params.messageId}, {'$set' : {
      'draft' : false
    }}, {'multi': true});
    ProgressNotes.update( {'messageId' : params.messageId}, {'$set' : {
      'draft' : false
    }}, {'multi': true});

    // Apply progress to objectives

    Messages.update(message._id, {'$set' : {
      'draft' : false,
      'postedAt' : new Date()
    }});

    return message._id;
  } 
})