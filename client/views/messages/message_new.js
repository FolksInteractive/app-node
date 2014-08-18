Template.message_new.rendered = function(){
  Session.set('newMessageCurrentTab', 'discuss');
  Session.set('newMessageFiles', []);
}

//                                                                            //
//                                  Tabs                                      //
//                                                                            //
Template.message_new.helpers({
  currentTab : function(){
    return Session.get('newMessageCurrentTab');
  },
  isCurrentTab : function(value){
    return Session.equals('newMessageCurrentTab', value)
  },
  activeTabClass : function(value){
    return Session.equals('newMessageCurrentTab', value) ? 'active' : 'no';
  }
});

Template.message_new.events({
  //When a tab is click
  'click #newMessageForm .nav a' : function(e){
    e.preventDefault();

    var selectedTab = $(e.target).data('tab');
    
    Session.set('newMessageCurrentTab', selectedTab);
  },

  // When submitting the form
  'submit #newMessageForm' : function(e){
    e.preventDefault();

    var $form = $(e.target);
    var relationId = Session.get('currentRelationId')

    // Makes draft file as attachments to message
    var draftFiles = getDraftFilesByRelationId(relationId);
    var draftFileIds = _.map(draftFiles, function(file){
      return file._id;
    });

    var params = {
      'body' : $form.find('.tc-message-body .form-control').val(),
      'relationId' : relationId,
      'files' : draftFileIds
    }
    // Cleaning params
    params.body = _.trim(params.body)|| "";

    // Do nothing if no content
    if(_.isBlank(params.body))
      return

    // Convert current tab to message type
    switch(Session.get('newMessageCurrentTab')){
      case 'discuss'  : params.type = MessageTypes.DISCUSS; break;
      case 'objective': params.type = MessageTypes.OBJECTIVE; break;
      case 'progress' : params.type = MessageTypes.PROGRESS; break;
    }
    

    // Build objective MESSAGE type
    if(MessageTypes.OBJECTIVE == params.type){
      var $objectives = $form.find('.tc-new-objective');
      //Extract objective
      params.objectives = _.map($objectives, function(objectiveElem){
        return $(objectiveElem).find('input').val();
      });

      // Keep none empty objectives
      params.objectives = _.filter(params.objectives, function(value){
        return !_.isBlank(_.trim(value));
      });

      // Stop everything if no objective is specified
      if(params.objectives.length === 0)
        return;
    }

    
    // Build progress PROGRESS type
    if(MessageTypes.PROGRESS == params.type){
      params.progress = {
        objective : _.trim($form.find('select[name=progressObjective]').val()),
        value : _.toNumber(_.trim($form.find('select[name=progressValue]').val()))
      }

      // Stop everything if no objective or value is specified
      if(_.isBlank(params.progress.objective) || _.isBlank(params.progress.value))
        return;
    }
    
    Meteor.call('post_message', params, function(err, messageId){
      if(!err)
        $('#newMessageForm')[0].reset();
    });
  },
});

//                                                                            //
//                                  Files                                     //
//                                                                            //
Template.message_new.helpers({
  files : function(){
    return getFiles({draft : true})
  },
  hasDraftFiles : function(){
    return hasDraftFilesByRelationId(Session.get('currentRelationId'));
  },
});

Template.message_new.events({
  'click #newMessageForm .tc-message-files .tc-remove' : function(e){
    e.preventDefault();

    Meteor.call('remove_file', this._id)
  },

  'change #newMessageForm input[type=file]': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      var fsFile = new FS.File(file);
      fsFile.relationId = Session.get('currentRelationId');
      fsFile.draft = true;
      fsFile.uploaderId = Meteor.userId();

      Files.insert(fsFile, function (err, fileResult) {
        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if(err)
          return console.log(err);

          var newMessageFiles = Session.get('newMessageFiles')
          newMessageFiles.push(fileResult);
          Session.set('newMessageFiles', newMessageFiles);
      });
    });
  }
});
