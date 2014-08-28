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
      'messageId' : String,
      'body' : String,
      // Message Type Objective Params
      'objectives' : Match.Optional([String]),
      // Message Type Progress Param
      'progress' : Match.Optional({
        'objectiveId' : String,
        'value' : Number
      })
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
    //
    //
    // For Objective Message
    //
    if(params.objectives){

      // Insert Objectives and remember their ids
      var objectivesIds = _.map(params.objectives, function(title){
        return Objectives.insert({
          'messageId' : message._id,
          'title' : title,
          'progress' : 0,
          'createdAt' : new Date(),
          'relationId' : message.relationId 
        })
      });
      // Update insert params to specify objectives
      insertParams = _.extend(insertParams, {
        'objectives' : objectivesIds
      });
    }
    //
    //
    // For Progress Message
    //
    if(params.progress){

      // Update objective progress
      Objectives.update(params.progress.objectiveId, {
        '$set':{
          'progress': params.progress.value
      }});  

      // Update insert params with progress data
      insertParams = _.extend(insertParams, {
        'objectiveId' : params.progress.objectiveId, 
        'progress': params.progress.value
      });  
    }

    return Messages.update(message._id, insertParams);
  } 
})