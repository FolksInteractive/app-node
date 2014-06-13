getFile = function(fileId){
  return Files.findOne(fileId);
}
getFiles = function(options){
  options = options || {};
  return Files.find(options).fetch();
}
countFiles = function(options){
  options = options || {};
  return Files.find(options).count();
 }