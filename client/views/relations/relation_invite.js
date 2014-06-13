Template.relation_invite.rendered = function(){
  $('.tc-invite-global .role-btn-group .btn').button();
  $('.tc-invite-global input[name=email]').focus();
}

Template.relation_invite.events({
  'submit .tc-invite-global form' : function(e){
    var formValid = true;
    var $form = $(e.target);
    var $email = $form.find('input[name=email]');
    var $role = $form.find('input[name=role]');

    var params = {
      email: _.trim($email.val()),
      role: _.trim($role.filter(':checked').val()) || ''
    };

    // Validating email
    if(_.isBlank(params.email) || !_.isEmail(params.email)){
      $email.parents('.form-group').addClass('has-error');
      $email.focus();
      formValid = false;
    }else{
      $email.parents('.form-group').removeClass('has-error');
    }

    // Validating role sleection
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