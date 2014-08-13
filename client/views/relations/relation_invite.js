// Helper object for select2 (used in .rendered())
var select2Formats = {
  result : function(state){

    data = _.defaults($(state.element).data(), {
      'img' : '/img/avatar.png',
      'name' : ''
    });

    return "<div class='media'>"+
      "<div class='media-object pull-left'>"+
      "  <img src='"+data.img+"' class='img-circle' width='30' height='30' />"+
      "</div>"+
      "<div class='media-body'>"+
      "  <div class=''>"+data.name+"</div>"+
      "  <div class='small'>"+data.headline+"</div>"+
      "</div>"+
   "</div>";
  },
  selection : function(state){
    data = _.defaults($(state.element).data(), {
      'img' : '/img/avatar.png',
      'name' : ''
    });

    return "<div class='media text-center'>"+
      "<div class='media-object'>"+
      "  <img src='"+data.img+"' class='img-circle' width='80' height='80' />"+
      "</div>"+
      "<div class='media-body'>"+
      "  <div class=''>"+data.name+"</div>"+
      "  <div class='small'>"+data.headline+"</div>"+
      "</div>"+
   "</div>";
  }
}

Template.relation_invite.rendered = function(){
  $('.tc-invite-global .role-btn-group .btn').button();

  // Cache user's connections in the Session and LocalStorage
  if(!Session.get('connections')){
    Session.set('connections', []);

    // Check in localStorage
    var localConnections = localStorage.getItem('connections');
    try{
      // Throw error is localConnections to get to the catch
      if(!localConnections)
        throw Error("localConnections can't be null");

      localConnections =  JSON.parse(localConnections)
      Session.set('connections', localConnections);
    }catch(e){
      delete localStorage.connections;
      Meteor.call('IN_connections', function(err, connections){
        Session.set('connections', connections);
        localStorage.setItem('connections', JSON.stringify(connections));
      });
    }
  }
}


Template.relation_invite.helpers({
  'connectionsReady' : function(){
    return Session.get('connections') && Session.get('connections').length>0;
  }
});


Template.relation_invite.events({
  'submit .tc-invite-global form' : function(e){
    var formValid = true;
    var $form = $(e.target);
    var $contact = $form.find('select[name="contact"]');
    var $role = $form.find('input[name=role]');
    var connections = Session.get('connections') || [];

    var contact = _.find(connections, function(connection){
      return connection.linkedinId == $contact.val();
    });

    var params = {
      linkedinApiId: contact.linkedinApiId,
      linkedinId : contact.linkedinId,
      role: _.trim($role.filter(':checked').val()) || ''
    };


    // Validating contact
    if(!contact){
      $contact.parents('.form-group').addClass('has-error');
      formValid = false;
    }else{
      $contact.parents('.form-group').removeClass('has-error');
    }

    // Validating role selection
    if(_.isBlank(params.role)){
      $role.parents('.form-group').addClass('has-error');
      formValid = false;
    }else{
      $role.parents('.form-group').removeClass('has-error')
    }

    // Execute relation creation and invitation if form is valid
    if(formValid) {
      Meteor.call('relation_invite', params, function(err, relationId){
        if(err)
          return console.log(err);

        Router.go('relation', {'relationId': relationId});
      });
    }    

    return false;
  }
});
//                                                                            //
//                                 FORM                                       //
//                                                                            //
Template.relation_invite_form.helpers({
  'connections' : function(){
    return Session.get('connections');
  }
});

Template.relation_invite_form.rendered = function(){
  // Select 2
  $('.tc-invite-global select[name="contact"]').select2({
    formatResult : select2Formats.result,
    formatSelection : select2Formats.selection,
    dropdownCssClass : 'tc-invite-dropdown',
    containerCssClass : "tc-invite-select2",
    placeholder: "Select a LinkedIn contact to start doing business with him",
  });
}