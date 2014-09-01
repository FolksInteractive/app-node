Template.message_edit_discuss.events({

  'keyup textarea' : _.debounce(function(e, template){
    var params = {
      'messageId' : this._id,
      'body' : _.trim($(e.target).val())
    }

    Meteor.call('write_message', params, function(err){
      if(err)
        return console.log(err);
    })
  }, 800)
})