Template.relation_aside_item.rendered = function(){
}

Template.relation_aside_item.helpers({
  'progress_state' : function(){
    return this.progress < 100 ? 'pending' : 'completed';
  },

  'active_state' : function(){
    return Session.equals('selectedObjectiveId', this._id) ? 'active' : '';
  },

  'completed' : function()  {
    return this.progress >= 100;
  },
})

Template.relation_aside_item.events({
  'click li' : function(e){
    e.preventDefault();

    Session.set('selectedObjectiveId', this._id);
  },
});
