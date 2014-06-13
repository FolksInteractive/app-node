var lineChart;
var lineChartData = {
  labels : ["January","February","March","April","May","June","July"],
  datasets : [
    {
      fillColor : "rgba(0,210,255,0)",
      strokeColor : "rgba(0,210,255,1)",
      pointColor : "rgba(0,210,255,1)",
      pointStrokeColor : "rgba(0,210,255,1)",
      data : [28,48,40,19,96,27,100]
    },
    {
      fillColor : "rgba(0,210,255,0)",
      strokeColor : "rgba(0,255,197,1)",
      pointColor : "rgba(0,255,197,1)",
      pointStrokeColor : "rgba(0,255,197,1)",
      pointDot: false,
      data : [28,48,40,19,60,100,80]
    } 
  ]
}

Template.dashboard.rendered = function(){
  var canvas = $('.tc-dashboard .tc-chart canvas')[0];  
  var lineChart = new Chart(canvas.getContext("2d"));
  lineChart.Line(lineChartData, 
    {
      scaleFontColor : "#ccc", 
      scaleShowLabels : false, 
      scaleFontColor : "#999", 
      scaleFontStyle : "bold",
      animationSteps : 150,
    }
  );
}

Template.dashboard.helpers({

  relations : function(){
    return getRelations();
  },

  contact : function(){
    return getContact(this._id);
  },

  role : function(){
    var contact = getContact(this);
    
    if(isVendor(this, contact))
      return "Vendor";

    if(isClient(this, contact))
      return "Client";

    return "Collaborator";
  }
})

Template.dashboard.events({})