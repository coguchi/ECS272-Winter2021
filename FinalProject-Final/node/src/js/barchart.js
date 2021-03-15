import * as d3 from "d3";
import diamondsPath from '../assets/data/convertedExtractedData.csv';

export async function drawBarFromCsvAsync(){
    const data_diamons = await d3.csv(diamondsPath);
    // console.log(data_diamons);
    drawDiamondsPCP(data_diamons,"#diamondsPCP")
    //data: https://www.kaggle.com/shivam2503/diamonds
}

function drawDiamondsPCP(data, id){

  //reference: https://www.d3-graph-gallery.com/graph/parallel_custom.html

  const margin = { top: 40, right: 5, bottom: 100, left: 0 };
  const parentDiv = document.getElementById("classBar");  
  const height = 500; 
  const width = parentDiv.clientWidth - 250;

  var svg = d3.select(id).append("svg")
      .attr("viewBox", [100,0, width-100, height+65])
      .attr("width", "100%")
      .attr("height", height)
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
              

  //cut = {"\"Fair\"":"1", "\"Good\"":"2", "\"Very Good\"":"3", "\"Premium\"":"4", "\"Ideal\"":"5"}
  //var colorScale = ["#f9cb35","#e45a31","#bc3754","#8a226a","#210c4a"]; //inferno
  //var colorScale = ["#c6dbef","#6baed6","#4292c6","#2171b5","#08306b"]; //blue
  //var colorScale = ["#87CEFA","#00BFFF","#1E90FF","#0000FF","#000D8B"]; //blue brighter
  //var colorScale = ["#e41a1c","#4daf4a","#984ea3","#ff7f00","#f781bf"]; //colorful
  var colorScale = ["#66c2a5","#fc8d62","#e78ac3","#a6d854","#ffd92f"]; //lighter colorful

  var color = d3.scaleOrdinal()
    //.domain(["Fair", "Good", "Very Good", "Premium", "Ideal" ])
    .domain(["1", "2", "3", "4", "5" ])
    .range(colorScale) //inferno reverse. darker, the better.

  var dimensions = ["cut","price","carat","clarity","color"];

  var y = {}
  for (var i in dimensions) {
    var name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[name]; }) )
      .range([height, 0])
  }

  var x = d3.scalePoint().domain(dimensions).range([margin.left, width - margin.right - margin.left]);
  
  //update highlight function will come here
  // Highlight the specie that is hovered
  var highlight = function(e,d){

    var selected_cut = d.cut;

    // first every group turns grey
    d3.selectAll(".line")
      .transition().duration(200)
      .style("stroke", "lightgray")
      .style("opacity", "0.2")
    // Second the hovered specie takes its color
    d3.selectAll(".y" + selected_cut)
      .transition().duration(200)
      .style("stroke", color(selected_cut))
      .style("opacity", "1")
  }

  // Un-highlight
  var doNotHighlight = function(d){
    d3.selectAll(".line")
      .transition().duration(200).delay(500)
      .style("stroke", function(d){ return( color(d.cut))} )
      .style("opacity", "1")
  }


  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw 
  function path(d) {
    return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  var line = svg
  .selectAll("myPath")
  .data(data)
  .enter()
  .append("path")
  .attr("class", function (d) { return "line y" + d.cut } )
  .attr("d",  path)
  .style("fill", "none")
  .style("stroke", function(d){return(color(d.cut))} )
  .style("opacity", 0.5)
  .on("mouseover", highlight)
  .on("mouseleave", doNotHighlight )


  // axis:
  svg.selectAll("myAxis")
  .data(dimensions).enter()
  .append("g")
  .attr("class", "axis")
  .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
  .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
  .append("text")
  .style("text-anchor", "middle")
  .attr("y", -9)
  .text(function(d) { return d; })
  .style("fill", "black")

  //add title
  // svg.append("text")
  // .attr("x", -10)
  // .attr("y", 0 - (margin.top / 2))
  // .attr("text-anchor", "left")
  // .style("font-size", "15px")
  // .style("text-decoration", "underline")
  // .text("Overview of the characteristics of diamonds");


    //put legend
    svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",190).attr("r", 6).style("fill", colorScale[4])
    svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",160).attr("r", 6).style("fill", colorScale[3])
    svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",130).attr("r", 6).style("fill", colorScale[2])
    svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",100).attr("r", 6).style("fill", colorScale[1])
    svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",70).attr("r", 6).style("fill", colorScale[0])
     //cut = {"\"Fair\"":"1", "\"Good\"":"2", "\"Very Good\"":"3", "\"Premium\"":"4", "\"Ideal\"":"5"}
    svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 190).text("1: Fair").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 160).text("2: Good").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 130).text("3: Very Good").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 100).text("4: Premium").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 70).text("5: Ideal").style("font-size", "15px").attr("alignment-baseline","middle")
    //svg.append("text").attr("x", parentDiv.clientWidth+ 10-200).attr("y", 30-30).text("Hover on to see").style("font-size", "15px").attr("alignment-baseline","middle")
    //svg.append("text").attr("x", parentDiv.clientWidth+ 10-200).attr("y", 45-30).text("individual data").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ -200).attr("y", 50).text("Cut").style("font-size", "18px").attr("alignment-baseline","left")

}


