Template.message_edit_objectives.helpers({
  objectives : function(){
    return getNewObjectives();
  },
});

Template.message_edit_objectives.events({
  'click #addObjectiveBtn' : function(e, template){
    var list = $('.tc-message-objectives');
    var newLine = UI.render(Template.message_edit_objective_line);
    UI.insert(newLine, list[0], list.find('.form-group:last')[0]);
  },

  // Remove an objective line
  'click .tc-edit-objective .tc-remove' : function(e){
    $(e.target).parents('.tc-edit-objective').remove();
  }
})