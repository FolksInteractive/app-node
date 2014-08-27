Template.relation_bar.rendered = function(){
  $('a.tc-invite-link').tooltip()

}

Template.relation_bar.helpers({
  'relations' : function(){
    return getRelations();
  },

  'status' : function(){
    if(!Meteor.user() || !Meteor.user().status)
      return "";

    if (Meteor.user().status.idle)
      return "tc-away"
    else if (Meteor.user().status.online)
      return "tc-online"
    else
      return ""
  } 
});


Template.relation_bar_item.rendered = function(){
  $('a[rel=tooltip]').tooltip()

}

Template.relation_bar_item.helpers({
  'contact' : function(){
    return getContact(this._id);
  },

  'active' : function(){
    return Session.equals('currentRelationId', this._id) ? 'active' : '';
  },

  'status' : function(){
    var contact = getContact(this._id);
    if(!contact || !contact.status)
      return "";

    if (contact.status.idle)
      return "tc-away"
    else if (contact.status.online)
      return "tc-online"
    else
      return ""
  } 
});