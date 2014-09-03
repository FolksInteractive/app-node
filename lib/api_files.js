getFile = function(fileId){
  return Files.findOne(fileId);
}
getFiles = function(options){
  options = options || {};

  options = _.defaults(options, {
    "draft" : false
  });
  
  return Files.find(options);
}
countFiles = function(options){
  options = options || {};
  return Files.find(options).count();
}

sizeToKoOrMo = function(size) {
  var fixedSize = (size/(1024));
  return (fixedSize > 1000) ? (fixedSize / 1024).toFixed(2) + "Mo" : 
  fixedSize.toFixed(2) + "Ko";
};