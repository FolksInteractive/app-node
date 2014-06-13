_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

renderOnServer = function(path, data){
  data = data || {};

  var template = Assets.getText(path);
  templateCompiled = _.template(template);

  return templateCompiled(data);
}