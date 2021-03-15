import * as d3 from "d3v4";

import diamondsPath from "../assets/data/convertedExtractedData.csv";

export async function drawScatter() {
  var tooltip = d3.select("body").append("div").attr("id", "tooltip");

  d3.csv(diamondsPath, function (data) {
    var selectedOption = "carat";
    var dataFilter = data.map(function (d) {
      return { price: d.price, value: d[selectedOption] };
    });
    // var cutArray = {1:"#87CEFA",2:"#00BFFF",3:"#1E90FF",4:"#0000FF",5:"#000D8B"};
    var colorScale = {
      carat: "#87CEFA",
      color: "#00BFFF",
      clarity: "#1E90FF",
      cut: "#0000FF",
    }; //blue brighter

    var allGroup = ["carat", "color", "clarity", "cut"];
    // var colorArray = {"carat":"#daskdas"}
    d3.select("#selectButton")
      .selectAll("myOptions")
      .data(allGroup)
      .enter()
      .append("option")
      .text(function (d) {
        return d;
      }) // text showed in the menu
      .attr("value", function (d) {
        return d;
      }); // corresponding value returned by the button

    // var color = d3.scaleOrdinal()
    //   //.domain(["Fair", "Good", "Very Good", "Premium", "Ideal" ])
    //   .domain(allGroup)
    //   .range(colorScale);

    var margin = {
      top: 20,
      right: 10,
      bottom: 30,
      left: 70,
    };
    const parentDiv = document.getElementById("my_dataviz");
    const width = parentDiv.clientWidth - margin.left - margin.right;
    const height = 480 - margin.top - margin.bottom;
    var x = d3.scaleLinear().range([0, width]).nice();

    var y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x).ticks(10),
      yAxis = d3.axisLeft(y).ticks(12);

    var brush = d3
        .brush()
        .extent([
          [0, 0],
          [width, height],
        ])
        .on("end", brushended),
      idleTimeout,
      idleDelay = 350;

    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var clip = svg
      .append("defs")
      .append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("x", 0)
      .attr("y", 0);

    // var xExtent = d3.extent(data, function(d) {
    //   return d.price;
    // });
    // var yExtent = d3.extent(data, function(d) {
    //   return d.cut;
    // });
    x.domain([
      0,
      d3.max(data, function (d) {
        return parseInt(d.carat);
      }) + 1,
    ]).nice();
    y.domain([
      0,
      d3.max(data, function (d) {
        return parseInt(d.price);
      }),
    ]).nice();

    var scatter = svg
      .append("g")
      .attr("id", "scatterplot")
      .attr("clip-path", "url(#clip)");

    scatter.append("g").attr("class", "brush").call(brush);

    scatter
      .selectAll(".dot")
      .data(dataFilter)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", function (d) {
        return x(d.value);
      })
      .attr("cy", function (d) {
        return y(d.price);
      })
      .attr("opacity", 0.5)
      .style("fill", colorScale[selectedOption])
      .on("mouseover", (d) => {
        tooltip.transition().duration(100).style("opacity", 0.9);
        tooltip
          .html(selectedOption + " &#8594; " + d.value + "<br>Price &#8594; " + d.price)
          .style("left", `${d3.event.pageX + 2}px`)
          .style("top", `${d3.event.pageY - 18}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(400).style("opacity", 0);
      });

    // x axis
    var xg = svg
      .append("g")
      .attr("class", "x axis")
      .attr("id", "axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg
      .append("text")
      .attr("class", "xaxislabel")
      .style("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 8)
      .text(selectedOption)
      .attr("fill",colorScale[selectedOption]);

    // y axis
    svg.append("g").attr("class", "y axis").attr("id", "axis--y").call(yAxis);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Price");

    function brushended() {
      var dataFilter = data.map(function (d) {
        return { price: d.price, value: d[selectedOption] };
      });

      var s = d3.event.selection;
      if (!s) {
        if (!idleTimeout) return (idleTimeout = setTimeout(idled, idleDelay));
        x.domain([
          0,
          d3.max(dataFilter, function (d) {
            return parseInt(d.value);
          }) + 1,
        ]).nice();
        y.domain([
          0,
          d3.max(data, function (d) {
            return parseInt(d.price);
          }),
        ]).nice();
      } else {
        x.domain([s[0][0], s[1][0]].map(x.invert, x));
        y.domain([s[1][1], s[0][1]].map(y.invert, y));
        scatter.select(".brush").call(brush.move, null);
      }
      zoom();
    }

    function idled() {
      idleTimeout = null;
    }

    function zoom() {
      // var selectedOption = d3.select(this).property("value");
      var dataFilter = data.map(function (d) {
        return { price: d.price, value: d[selectedOption] };
      });

      var t = scatter.transition().duration(750);
      svg.select("#axis--x").transition(t).call(xAxis);
      svg.select("#axis--y").transition(t).call(yAxis);
      scatter
        .selectAll("circle")
        .data(dataFilter)
        .transition(t)
        .attr("cx", function (d) {
          // console.log(d);
          return x(d.value);
        })
        .attr("cy", function (d) {
          return y(d.price);
        });
    }

    function update(selectedGroup) {
      // Create new data with the selection?
      var dataFilter = data.map(function (d) {
        return { price: d.price, value: d[selectedGroup] };
      });
      svg
        .select(".xaxislabel")
        .text(selectedGroup)
        .attr("fill",colorScale[selectedGroup])
        .style("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 8);
      // Give these new data to update line
      // line
      //     .datum(dataFilter)
      //     .transition()
      //     .duration(1000)
      //     .attr("d", d3.line()
      //       .x(function(d) { return x(+d.time) })
      //       .y(function(d) { return y(+d.value) })
      //     )

      x.domain([
        0,
        d3.max(dataFilter, function (d) {
          // console.log(d.value);
          return parseInt(d.value);
        }) + 1,
      ])
        .nice()
        .range([0, width]);

      xg.attr("class", "x axis")
        .attr("id", "axis--x")
        .attr("transform", "translate(0," + height + ")")
        .transition(1000)
        .call(xAxis);

      scatter
        .selectAll("circle")
        .data(dataFilter)
        .transition()
        .duration(1000)
        .attr("cx", function (d) {
          return x(+d.value);
        })
        .attr("cy", function (d) {
          return y(+d.price);
        })
        .attr("opacity", 0.5)
        .style("fill", colorScale[selectedOption]);
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function (d) {
      // recover the option that has been chosen
      selectedOption = d3.select(this).property("value");
      dataFilter = data.map(function (d) {
        return { price: d.price, value: d[selectedOption] };
      });
      // run the updateChart function with this selected option
      update(selectedOption);
    });
  });
}
