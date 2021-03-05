import * as d3 from "d3";
//import csvPath from '../assets/data/SF_Historical_Ballot_Measures.csv';
import csvPath_year from '../assets/data/data_by_year.csv';  //for HW2
//import diamondsPath from '../assets/data/extractedData.csv'; //for Final Project
import diamondsPath from '../assets/data/convertedExtractedData.csv'; //for Final Project

function drawBarFromCsv(){
    //async method
    //d3.csv(csvPath).then((data) => {
        // array of objects
        //console.log(data.length);
        //console.log(data);
        // do something with the data (e.g process and render chart)

        //(data will only exist inside here since it is an async call to read in data) so all rendering and processsing with data has to occur inside the "then"
    //});
}
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
  var color = d3.scaleOrdinal()
    //.domain(["Fair", "Good", "Very Good", "Premium", "Ideal" ])
    .domain(["Fair", "Good", "Very Good", "Premium", "Ideal" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff","#00908dff", "#fde72522"])

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


}



function drawPCP(data,id){

  //reference: https://www.d3-graph-gallery.com/graph/parallel_custom.html

  // set the dimensions and margins of the graph
  //var margin = {top: 30, right: 10, bottom: 10, left: 0},
  //width = 400 - margin.left - margin.right,  //700
  //height = 250 - margin.top - margin.bottom; //400


  const margin = { top: 40, right: 5, bottom: 100, left: 40 };
  /* 0  height & width where am i drawing this thing */
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

  // Color scale. I return a color
  var yearName = [];
  var seedYear = 1920;
  var tmpYear = 0;
  var stringTmpYear = tmpYear.toString();
  for (var i=0; i <= 101; i++){
    tmpYear = seedYear + i;
    stringTmpYear = tmpYear.toString();
    yearName.push(stringTmpYear);
  }

  var colorScale = []
  for (var i=0; i <= 101; i++){
    tmpYear = seedYear + i;
    if (tmpYear <= 1953){
      colorScale.push("#440154ff");
    }else if (tmpYear <= 1986){
      colorScale.push("#21908dff");
    }else{
      colorScale.push("orange");
    }
  }
  //yellow: #fde725ff
  var color = d3.scaleOrdinal()
  .domain(yearName)
  .range(colorScale)

  var allGroup = ["Show all", "Focus 1987-2021", "Focus 1954-1986", "Focus 1920-1953"];

  // add the options to the button
  d3.select("#selectButtonPCP")
    .selectAll('myOptions')
   	.data(allGroup)
    .enter()
  	.append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button




  // the list of dimensions we want to keep in the plot.
  var dimensions = ["year","acousticness","danceability","liveness","tempo"]



  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (var i in dimensions) {
    var name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[name]; }) )
      .range([height, 0])
  }

  //put legend
  svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",190).attr("r", 6).style("fill", "#440154ff")
  svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",160).attr("r", 6).style("fill", "#21908dff")
  svg.append("circle").attr("cx",parentDiv.clientWidth+ 10-200).attr("cy",130).attr("r", 6).style("fill", "orange")
  svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 190).text("Year 1920-1953").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 160).text("Year 1954-1986").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 130).text("Year 1987-2021").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 30).text("Hover on to see").style("font-size", "15px").attr("alignment-baseline","middle")
  svg.append("text").attr("x", parentDiv.clientWidth+ 20-200).attr("y", 45).text("individual data").style("font-size", "15px").attr("alignment-baseline","middle")

 var x = d3.scalePoint().domain(dimensions).range([margin.left, width - margin.right - margin.left]);

 // Highlight the specie that is hovered
 var highlight = function(e,d){

   var selected_year = d.year;
   //console.log(d.year);

   // first every group turns grey
   d3.selectAll(".line")
     .transition().duration(200)
     .style("stroke", "lightgray")
     .style("opacity", "0.2")
   // Second the hovered specie takes its color
  /* d3.selectAll("." + selected_year)
     .transition().duration(200)
     .style("stroke", color(selected_year))
     .style("opacity", "1")
*/
     //console.log(typeof selected_year);
     //d3.selectAll(".line"+"1998")
     d3.select(".y" + selected_year)
       .transition().duration(200)
       .style("stroke", color(selected_year))
       .style("opacity", "1")
 }

 // Unhighlight
 var doNotHighlight = function(d){
   d3.selectAll(".line")
     .transition().duration(200).delay(1000)
     .style("stroke", function(d){ return( color(d.year))} )
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
   .attr("class", function (d) { return "line y" + d.year } )
   .attr("d",  path)
   .style("fill", "none")
   .style("stroke", function(d){return(color(d.year))} )
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
   .text("Overview of the characteristics of music");

 function update(selectedGroup,data) {

   function path(d) {
       return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
   }

   var allGroup = ["Show all", "Focus 1987-2021", "Focus 1954-1986", "Focus 1920-1953"];
   var yearName = [];
   var seedYear = 1920;
   var tmpYear = 0;
   var stringTmpYear = tmpYear.toString();
   for (var i=0; i <= 101; i++){
     tmpYear = seedYear + i;
     stringTmpYear = tmpYear.toString();
     yearName.push(stringTmpYear);
   }
   var colorScale = []

   if (selectedGroup == allGroup[0]){
     // Color scale. I return a color

     tmpYear = 0
     colorScale = []
     for (var i=0; i <= 101; i++){
       tmpYear = seedYear + i;
       if (tmpYear <= 1953){
         colorScale.push("#440154ff");
       }else if (tmpYear <= 1986){
         colorScale.push("#21908dff");
       }else{
         colorScale.push("orange");
       }
     }
     //yellow: #fde725ff
     var color = d3.scaleOrdinal()
     .domain(yearName)
     .range(colorScale);
   }else if (selectedGroup == allGroup[1]){

     colorScale = []
     tmpYear = 0
     for (var i=0; i <= 101; i++){
       tmpYear = seedYear + i;
       if (tmpYear <= 1953){
         colorScale.push("gray");
       }else if (tmpYear <= 1986){
         colorScale.push("gray");
       }else{
         colorScale.push("orange");
       }
     }
     //yellow: #fde725ff
     var color = d3.scaleOrdinal()
     .domain(yearName)
     .range(colorScale);

     console.log(colorScale);

   }





   // Give these new data to update line

   line
   .datum(data)
   .transition()
   .attr("d",path)
   .style("fill", "none")
   .style("stroke", function(d){  console.log(d.year); return color(d)})
   .style("opacity", 0.5)

   console.log("uuuuuuuum");

     }

}



export function drawBarChart(data, id) {

  //const margin = { top: 40, right: 5, bottom: 120, left: 40 };
  //const parentDiv = document.getElementById(id.substring(1));
  //const height = 400;
  //const width = parentDiv.clientWidth;



    //stick something above.
    const margin = { top: 40, right: 40, bottom: 120, left: 100 };
    const height = 300;
    const width = 500;

    const x = d3.scaleBand().domain(data.map(d => d.y))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.x)]).nice()
        .rangeRound([height - margin.bottom, margin.top]);

    let svg = d3.select(id).append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.y))
        .attr("y", d => y(d.x))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.x))
        .attr("fill", "green");

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .attr("font-weight", "bold");

    svg.append("g")
        .call(yAxis)
        .call(g => g.select(".tick:last-of-type text")
                .clone()
                .attr("transform", `rotate(-90)`)
                .attr("text-anchor", "middle")
                .attr("x", -(15 - margin.top - margin.bottom) / 2)
                .attr("y", -80)
                .attr("font-weight", "bold"))
}


