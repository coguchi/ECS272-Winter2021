import * as d3 from "d3";
//import diamondsPath from '../assets/data/extractedData.csv'; //for Final Project
import diamondsPath from '../assets/data/convertedExtractedData.csv'; //for Final Project
/*
    Same as the one above but we made the function itself asynch so we can use await
    The two do the same thing essentially but it is cleaner to read

    The main place to edit:
*/
export async function drawBarFromCsvAsync(){

    //draw chart for HW2
    //const data_year = await d3.csv(csvPath_year);
    //console.log(data_year);
    //drawPCP(data_year, "#PCP");

    //draw diamonds PCP for Final Project
    const data_diamons = await d3.csv(diamondsPath);
    console.log(data_diamons);
    drawDiamondsPCP(data_diamons,"#diamondsPCP")
    //data: https://www.kaggle.com/shivam2503/diamonds
    

    //There will be some delay in console before it prints the array
    //if csv file, this is the main place to work.
}

function drawDiamondsPCP(data, id){
  console.log("hehe");

  //reference: https://www.d3-graph-gallery.com/graph/parallel_custom.html

  /* 0  height & width where am i drawing this thing */
  const margin = { top: 40, right: 5, bottom: 100, left: 40 };
  const parentDiv = document.getElementById(id.substring(1));  //this is the div that you will draw / append the svg to
  const height = 300; // whatever height you want
  const width = parentDiv.clientWidth - 200;

  /* 1st where we are drawing*/
  var svg = d3.select(id).append("svg")
      .attr("viewBox", [0, 0, width, height+65])
      .attr("width", "100%")
      .attr("height", height)
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
              

  // Color scale: give me a specie name, I return a color
  //cut = {"\"Fair\"":"1", "\"Good\"":"2", "\"Very Good\"":"3", "\"Premium\"":"4", "\"Ideal\"":"5"}


  //var colorScale = ["#f9cb35","#e45a31","#bc3754","#8a226a","#210c4a"]; //inferno
  //var colorScale = ["#c6dbef","#6baed6","#4292c6","#2171b5","#08306b"]; //blue
  var colorScale = ["#87CEFA","#00BFFF","#1E90FF","#0000FF","#000D8B"]; //blue brighter
  //var colorScale = ["#e41a1c","#4daf4a","#984ea3","#ff7f00","#f781bf"]; //colorful
  //var colorScale = ["#66c2a5","#fc8d62","#e78ac3","#a6d854","#ffd92f"]; //lighter colorful

  var color = d3.scaleOrdinal()
    //.domain(["Fair", "Good", "Very Good", "Premium", "Ideal" ])
    .domain(["1", "2", "3", "4", "5" ])
    .range(colorScale) //inferno reverse. darker, the better.

  // the list of dimensions we want to keep in the plot.
  var dimensions = ["cut","price","carat","clarity","color"];

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (var i in dimensions) {
    var name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[name]; }) )
      .range([height, 0])
  }
  console.log(y);

  // Build the X scale -> it find the best position for each Y axis
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
    d3.select(".y" + selected_cut)
      .transition().duration(200)
      .style("stroke", color(selected_cut))
      .style("opacity", "1")
  }

  // Unhighlight
  var doNotHighlight = function(d){
    d3.selectAll(".line")
      .transition().duration(200).delay(500)
      .style("stroke", function(d){ return( color(d.cut))} )
      .style("opacity", "1")
  }




  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
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


  // Draw the axis:
  svg.selectAll("myAxis")
  // For each dimension of the dataset I add a 'g' element:
  .data(dimensions).enter()
  .append("g")
  .attr("class", "axis")
  // I translate this element to its right position on the x axis
  .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
  // And I build the axis with the call function
  //.each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
  .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
  // Add axis title
  .append("text")
  .style("text-anchor", "middle")
  .attr("y", -9)
  .text(function(d) { return d; })
  .style("fill", "black")

  //add title
  svg.append("text")
  .attr("x", 0)
  .attr("y", 0 - (margin.top / 2))
  .attr("text-anchor", "left")
  .style("font-size", "15px")
  .style("text-decoration", "underline")
  .text("Overview of the characteristics of diamonds");


    //put legend
    svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",190).attr("r", 6).style("fill", colorScale[0])
    svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",160).attr("r", 6).style("fill", colorScale[1])
    svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",130).attr("r", 6).style("fill", colorScale[2])
    svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",100).attr("r", 6).style("fill", colorScale[3])
    svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",70).attr("r", 6).style("fill", colorScale[4])
     //cut = {"\"Fair\"":"1", "\"Good\"":"2", "\"Very Good\"":"3", "\"Premium\"":"4", "\"Ideal\"":"5"}
    svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 190).text("1: Fair").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 160).text("2: Good").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 130).text("3: Very Good").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 100).text("4: Premium").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 70).text("5: Ideal").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ 10-200).attr("y", 30-30).text("Hover on to see").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ 10-200).attr("y", 45-30).text("individual data").style("font-size", "15px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", parentDiv.clientWidth+ -200).attr("y", 50).text("Cut").style("font-size", "18px").attr("alignment-baseline","left")

}

