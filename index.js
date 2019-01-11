
function addSVG(div, width, height, margin) {

    var svg = d3.select(div).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return svg;
} 


function draw(data){
        var num = Math.random();
        if(num<0.5) {
            data.push({Sum:data[data.length-1].Sum-1, Round:data[data.length-1].Round+1});
        } else {
            data.push({Sum:data[data.length-1].Sum+1, Round:data[data.length-1].Round+1});
        }
    }

d3.select('#draw').on("click",function() {
        var count = 10;
        var data = [{Sum:0, Round:0}]
        for (var i = 1; i < count; i++) {
          draw(data);
        }
        data.push({Sum:data[data.length-1].Sum, Round:data[data.length-1].Round+1})
        drawChart(data);
    });


// function generateData(){
//     var sum = [0];
//     var step = [0];
//     data = {Sum: sum, Round: step};
//     d3.select('#drawOne').on("click",function() {
//         data=draw(sum,step);
//         });
//         //draw one-hundred times
//     d3.select('#drawHundred').on("click",function() {
//             var count = 0;
//             var interval = setInterval(function() {
//                     data =draw(sum,step);
//                 if (++count === 100){
//                     clearInterval(interval);
//                 }    
//             }, 15);
//     });
//     return data;
// }

function drawChart(data) {
  d3.selectAll("svg > *").remove();
var pad = 30;
var margin = {top: 40, right: 40, bottom: 40, left: 40};
var width = 300 - margin.left - margin.right;
var height = 200 - margin.top - margin.bottom;


var svg = addSVG('svg', width, height, margin);

var g = svg.append("g");




var roundmax = d3.max(data, function(d) { return d.Round; });
    summin = d3.min(data, function(d) { return d.Sum; });
    summax =d3.max(data, function(d) { return d.Sum; });


var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return +d.Round }))
    .range([0, width]);
    
var y = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return +d.Sum }))
    .range([height, 0]);




var line = d3.line()
    .x(function(d) { return x(d.Round)})
    .y(function(d) { return y(d.Sum)})
    .curve(d3.curveStepAfter);




g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(roundmax, "s"));

g.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(y).ticks(summax-summin, "s"));

g.append("text")
      .text("round")
      .attr("class", "titles")
      .attr("transform", "translate(" + (width - margin.left)/ 2 + "," + (height + pad) + ")")
      .attr("alignment-baseline","hanging"); 

g.append("text")
      .text("sum")
      .attr("class", "titles")
      .attr("transform", "translate(" + -pad/1.5 + "," + (height+margin.top) / 2 + ")rotate(-90)")
      .attr("alignment-baseline","baseline");  


var path = g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line)
    .style("display", null);

 var totalLength = path.node().getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .style("display", null) // now we can display it
    .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);  // we animate the offset down to 0.





    // this is repetitive with the above, but it shows how you would repeat the drawing...

  d3.select("#button").on("click", function() {
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .style("display", null)
        .transition()
          .duration(3000)
          .attr("stroke-dashoffset", 0);
    });


}

