Deps.autorun(function(c) {
  try{
    UserStatus.startMonitor({
      'threshold': 120000,
      'interval': 60000,
      'idleOnBlur': true
    });
  }catch(e){}
});