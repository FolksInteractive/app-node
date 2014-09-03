Template.relation_bar.rendered = function(){
  
}

Template.relation_bar.helpers({
  'relations' : function(){
    return getRelations();
  },

  'current_relation' : function(){
    return getRelation(Session.get('currentRelationId'));
  },

  'current_relation_id' : function(){
    return Session.get('currentRelationId');
  }
});


Template.relation_bar_contact.rendered = function(){
}

Template.relation_bar_contact.helpers({
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