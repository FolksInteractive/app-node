Deps.autorun(function(c) {
  try{
    // if(UserStatus.isMonitoring)
    //   return

    UserStatus.startMonitor({
      'threshold': 10000,
      'interval': 1000,
      'idleOnBlur': true
    });
  }catch(e){}
});