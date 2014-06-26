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
    console.log(state);

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
    if(localStorage.getItem('connections')){
      Session.set('connections', JSON.parse(localStorage.getItem('connections')));
    }else{
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

    var params = {
      linkedinId: _.trim($contact.val()),
      role: _.trim($role.filter(':checked').val()) || ''
    };

    var connections = Session.get('connections') || [];

    // Validating contact
    if(_.isBlank(params.linkedinId) || !_.contains(_.pluck(connections, 'linkedinId'), params.linkedinId)){
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