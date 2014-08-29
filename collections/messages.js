Messages = new Meteor.Collection('messages');

Meteor.methods({
  'discard_message': function(params){
    check(params, {
      'messageId': String,
      'wait': Match.Optional(Number),
    });

    // Must be loggedIn
    if(!this.userId)
      throw new Meteor.Error(403)

    var message = Messages.findOne(params.messageId);

    if(!message)
      throw new Meteor.Error(403)

    if(!message.draft)
      throw new Meteor.Error(403, "User cannot discard a non-drafted message.");


    if(message.authorId != this.userId)
      throw new Meteor.Error(403, "User doesn't have the rights to discard this message.");

    Messages.remove(message._id);
    Files.remove({'messageId': message._id});
    Objectives.remove({'messageId': message._id});

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
      '_id' : params.messageId
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
        check(id, String);
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
      'authorId' : this.userId,
      'draft' : true,
      'draftedAt' : new Date()
    })

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


    // Insert default message first
    var insertParams = {
      'authorId' : this.userId,
      'body' : params.body,
      'postedAt' : new Date()
    };

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

    Objectives.update( {'messageId' : params.messageId}, {'$set' : {
      'draft' : false
    }}, {'multi': true});
    Files.update( {'messageId' : params.messageId}, {'$set' : {
      'draft' : false
    }}, {'multi': true});
    ProgressNotes.update( {'messageId' : params.messageId}, {'$set' : {
      'draft' : false
    }}, {'multi': true});

    Messages.update(message._id, {'$set' : {
      'draft' : false
    }});

    Meteor.call('draft_message', {
      'relationId' : message.relationId
    })
    return message._id;
  } 
})