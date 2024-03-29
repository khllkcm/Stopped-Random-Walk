plotST();
plotRW();


function plotST() {
  var pad = 30;
  var margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
  };
  var width = 600 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;
  var max_games = 60;


  var ST_plot = d3.select("#plotST").append("svg").attr("width", "100%")
    .attr("height", "600px")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom-100))
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x_axis_ST_plot = ST_plot.append("g").attr("class", "x axis");
  var x_axis_ST_plot_text = ST_plot.append("text").attr("text-anchor", "middle").text("Number of Games");
  var y_axis_ST_plot = ST_plot.append("g").attr("class", "y axis");
  var y_axis_ST_plot_text = ST_plot.append("text").attr("text-anchor", "middle").text("Stopping Time");
  var path_ST_plot = ST_plot.append("path").attr("id", "ss");
  var path_tau = ST_plot.append("path").attr("id", "tau");

  var a = -document.getElementById("ast").value;
  var b = +document.getElementById("bst").value;


  d3.select("#ast").on("input", function () {
    a = -this.value;
    d3.selectAll("#plotST > *").remove();
    plotST();
  });


  d3.select("#bst").on("input", function () {
    b = +this.value;
    d3.selectAll("#plotST > *").remove();
    plotST();
  });


  var tau = -a * b;
  var x_scale_ST_plot = d3.scaleLinear().domain([1, max_games]);

  var y_scale_ST_plot = d3.scaleLinear().domain([0, 2 * tau]);

  var x_axis_ST = d3.axisBottom(x_scale_ST_plot).ticks(3);

  var y_axis_ST = d3.axisLeft(y_scale_ST_plot).ticks(6);

  var rounds = [];
  var expectedData = [];

  function expectation(data) {
    var line = d3.line()
      .x(function (d) {
        return x_scale_ST_plot(d[0])
      })
      .y(function (d) {
        return y_scale_ST_plot(d[1])
      });

    if (data.length > max_games * 0.8) {
      max_games = max_games * 1.6;
    };
    x_scale_ST_plot.domain([1, max_games]);
    ST_plot.select(".x.axis")
      .transition()
      .call(x_axis_ST.ticks(3));

    path_tau
      .datum([
        [1, tau],
        [max_games, tau]
      ])
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .style("stroke-dasharray", ("5, 5"))
      .attr("d", line);

    path_ST_plot
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5);

    
  };

  d3.select("#simulate1").on("click", function () {
    magic();
  });


  d3.select("#simulate50").on("click", function () {
    var count = 0;
    var interval = setInterval(function () {
      magic();
      if (++count === 50) {
        clearInterval(interval);
      }
    }, 15);
  });

  function magic(data = [{
    Sum: 0,
    Round: 0
  }]) {
    while (data[data.length - 1].Sum < b && data[data.length - 1].Sum > a) {
      draw(data);
    }
    var roundmax = d3.max(data, function (d) {
      return d.Round;
    });
    rounds.push(roundmax);
    expectedData.push(average(rounds));
    expectation(expectedData);
  };

  function average(data) {
    var total = data.length;
    var sum = data.reduce(function (c, d) {
      return c + d;
    }, 0);
    return [total, sum / total];
  };

  function draw(data) {
    var num = Math.random();
    if (num < 0.5) {
      data.push({
        Sum: data[data.length - 1].Sum - 1,
        Round: data[data.length - 1].Round + 1
      });
    } else {
      data.push({
        Sum: data[data.length - 1].Sum + 1,
        Round: data[data.length - 1].Round + 1
      });
    }
  };


  function drawtau() {

    var w = d3.select('#plotST').node().clientWidth;
    w = width;
    var h = height;
    var padTau = pad;

    ST_plot.attr("width", w).attr("height", h);

    x_scale_ST_plot.range([padTau, (w - padTau)]);
    y_scale_ST_plot.range([(h - padTau), padTau]);

    x_axis_ST_plot.attr("transform", "translate(0," + (h - padTau) + ")").call(x_axis_ST);
    y_axis_ST_plot.attr("transform", "translate(" + padTau + ",0)").call(y_axis_ST);

    x_axis_ST_plot_text.style("font", "14px times")
      .attr("class", "titles")
      .attr("transform", "translate(" + (width - margin.left) / 2 + "," + (height + pad) + ")")
      .attr("alignment-baseline", "hanging");

    y_axis_ST_plot_text.style("font", "14px times")
      .attr("class", "titles")
      .attr("transform", "translate(" + -pad / 1.5 + "," + (height + margin.top) / 2 + ")rotate(-90)")
      .attr("alignment-baseline", "baseline");

    expectation(expectedData);
  };
  drawtau();
};

function plotRW() {


  var a = -2;
  var b = 2;

  function draw(data) {
    var num = Math.random();
    if (num < 0.5) {
      data.push({
        Sum: data[data.length - 1].Sum - 1,
        Round: data[data.length - 1].Round + 1
      });
    } else {
      data.push({
        Sum: data[data.length - 1].Sum + 1,
        Round: data[data.length - 1].Round + 1
      });
    };
  };

  simRW();


  function simRW() {
    var data = [{
      Sum: 0,
      Round: 0
    }];
    while (data[data.length - 1].Sum < b && data[data.length - 1].Sum > a) {
      draw(data);
    }
    data.push({
      Sum: data[data.length - 1].Sum,
      Round: data[data.length - 1].Round + 1
    });
    drawChart(data);
  };


  d3.select('#draw').on("click", function () {

    simRW();
  });

  d3.select("#a").on("input", function () {
    a = -this.value;
    simRW();
  });


  d3.select("#b").on("input", function () {
    b = +this.value;
    simRW();
  });


  function drawChart(data) {
    d3.selectAll("#plotRW > *").remove();
    var pad = 30;
    var margin = {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40
    };
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#plotRW").append("svg").attr("width", "100%")
      .attr("height", "600px")
      .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom - 100))
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var g = svg.append("g");


    var roundmax = d3.max(data, function (d) {
      return d.Round;
    });
    summin = d3.min(data, function (d) {
      return d.Sum;
    });
    summax = d3.max(data, function (d) {
      return d.Sum;
    });


    var x = d3.scaleLinear()
      .domain(d3.extent(data, function (d) {
        return +d.Round
      }))
      .range([0, width]);

    var y = d3.scaleLinear()
      .domain(d3.extent(data, function (d) {
        return +d.Sum
      }))
      .range([height, 0]);


    var line = d3.line()
      .x(function (d) {
        return x(d.Round)
      })
      .y(function (d) {
        return y(d.Sum)
      })
      .curve(d3.curveStepAfter);


    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(Math.min(10, roundmax), "s"));

    g.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(0,0)")
      .call(d3.axisLeft(y).ticks(summax - summin, "s"));

    g.append("text")
      .text("round")
      .style("font", "14px times")
      .attr("class", "titles")
      .attr("transform", "translate(" + (width - margin.left) / 2 + "," + (height + pad) + ")")
      .attr("alignment-baseline", "hanging");

    g.append("text")
      .text("sum")
      .style("font", "14px times")
      .attr("class", "titles")
      .attr("transform", "translate(" + -pad / 1.5 + "," + (height + margin.top) / 2 + ")rotate(-90)")
      .attr("alignment-baseline", "baseline");


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

    function startdraw() {
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .style("display", null)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);
    };

    startdraw();

    d3.select("#button").on("click", function () {
      startdraw();
    });


  }
};

