Template.message_edit_objective.helpers({
  objectives : function(){
    return getNewObjectives();
  },
});

Template.message_edit_objective.events({
  'click #addNewObjectiveBtn' : function(e, template){
    var list = $('.tc-new-message .tc-message-objectives');
    var newLine = UI.render(Template.message_new_objective_line);
    console.log(UI.insert(newLine, list[0], list.find('.form-group:last')[0]));
  },

  // Remove an objective line
  'click .tc-edit-objective .tc-remove' : function(e){
    $(e.target).parents('.tc-new-objective').remove();
  }
})