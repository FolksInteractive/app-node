Template.message_new_progress.rendered = function(){
  $('select[name=progressObjective]').select2();
  
  $('select[name=progressValue]').select2({
    minimumResultsForSearch: -1
  });
}

Template.message_new_progress.helpers({
  objectives : function(){
    return getObjectives();
  },
})