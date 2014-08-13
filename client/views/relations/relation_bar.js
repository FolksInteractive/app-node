Template.relation_bar.rendered = function(){
  $('a.tc-invite-link').tooltip()

}

Template.relation_bar.helpers({
  'relations' : function(){
    return getRelations();
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
  }  
});