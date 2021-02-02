import * as d3 from "d3";
//import csvPath from '../assets/data/SF_Historical_Ballot_Measures.csv';
import csvPath from '../assets/data/data.csv';
import csvPath_year from '../assets/data/data_by_year.csv';
import csvPath_genre from '../assets/data/data_by_genres.csv';

function drawBarFromCsv(){
    //async method
    d3.csv(csvPath).then((data) => {
        // array of objects
        console.log(data.length);
        console.log(data);
        // do something with the data (e.g process and render chart)
        //  const pData = processData();
        //  drawBarChart(pData, id);
        //(data will only exist inside here since it is an async call to read in data) so all rendering and processsing with data has to occur inside the "then"
    });
}
/*
    Same as the one above but we made the function itself asynch so we can use await
    The two do the same thing essentially but it is cleaner to read

    The main place to edit:
*/
export async function drawBarFromCsvAsync(){
    const data_all = await d3.csv(csvPath);
    const data_year = await d3.csv(csvPath_year);
    const data_genre = await d3.csv(csvPath_genre);
    console.log(data_all);
    console.log(data_year);
    console.log(data_genre);
    /*console.log(data[0].acousticness);
    console.log(data[0].key);
    for(var key in data[0]) {
     console.log(key)
    }*/

    //process data()
    //const processedData = processData(data);

    //draw chart ()
    //drawBarChartCSV(processedData, 'example1');
    drawPCP(data_year, "#PCP");
    drawLineDropdown(data_year, "#LineDropdown");


    //drawBarChartCSV(data_yearTempo, "#yearTempo");
    //drawBarChartCSV_genreTempo(data_genreTempo, "#genreTempo");

    //There will be some delay in console before it prints the array
    //if csv file, this is the main place to work.
}

function processData(data){
//Sort data by track numbers group and track the cumulative acousticness and number of data points per group to calculate the average
  const tracknumbersGroups = {};
  data.forEach(d =>{

    if(d.key in tracknumbersGroups){
      tracknumbersGroups[d.key].size = tracknumbersGroups[d.key].size + 1;
      tracknumbersGroups[d.key].cumulativeAcousticness = tracknumbersGroups[d.key].cumulativePrice + d.price;
    }else{
      const tracknumberGroup = {
        name: d.key,
        size: 1,
        cumulativeAcousticness: d.acousticness,
        average: 0
      }
      tracknumbersGroups[d.key] = tracknumberGroup;
    }
  });

  //Compute the average and return an array with our data to be used for our chart
  const formattedData = []
  Object.keys(tracknumbersGroups).forEach(d => {
    tracknumbersGroups[d].average = tracknumbersGroups[d].cumulativeAcousticness / tracknumbersGroups[d].size;
    formattedData.push(tracknumbersGroups[d]);
  });

  // Sort by name
  formattedData.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
  })
  return formattedData;

}

function drawLineDropdown(data, id){

  //reference: https://www.d3-graph-gallery.com/graph/line_select.html

  // set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(id)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// List of groups (here I have one group per column)
var allGroup = ["acousticness","danceability","liveness","tempo"]

// add the options to the button
d3.select("#selectButton")
  .selectAll('myOptions')
 	.data(allGroup)
  .enter()
	.append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button


// A color scale: one color for each group
var myColor = d3.scaleOrdinal()
  .domain(allGroup)
  .range(d3.schemeSet2);


// Add X axis --> it is a date format
var x = d3.scaleLinear()
  .domain([1920,2021])
  .range([ 0, 400]);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
  .domain( [0,1])
  .range([ height, 0 ]);
var yAxis = svg.append("g")
  .call(d3.axisLeft(y));

// Initialize line with group a
var line = svg
  .append('g')
  .append("path")
    .datum(data)
    .attr("d", d3.line()
      .x(function(d) { return x(+d.year) })
      .y(function(d) { return y(+d.acousticness) })
    )
    .attr("stroke", function(d){ return myColor("acousticness") })
    .style("stroke-width", 4)
    .style("fill", "none")

// A function that update the chart
function update(selectedGroup,data) {

  // Create new data with the selection?
  var dataFilter = data.map(function(d){return {year: d.year, value:d[selectedGroup]} })

  console.log(selectedGroup);

  //change the axis according to the value.
  if (selectedGroup == "tempo") {
    y.domain([90,130])
    yAxis.transition().duration(1000).call(d3.axisLeft(y))

  }else{
    y.domain([0,1])
    yAxis.transition().duration(1000).call(d3.axisLeft(y))
  }


  // Give these new data to update line
  line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(+d.year) })
        .y(function(d) { return y(+d.value) })
      )
      .attr("stroke", function(d){ return myColor(selectedGroup) })




}

// When the button is changed, run the updateChart function
d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    update(selectedOption,data)
})




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
  const height = 400; // whatever height you want
  const width = parentDiv.clientWidth;
  /* 1st where we are drawing*/
  var svg = d3.select(id).append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", height);

  // append the svg object to the body of the page
//  var svg = d3.select(id)
//  .append("svg")
//    .attr("width", width + margin.left + margin.right)
//    .attr("height", height + margin.top + margin.bottom)
//  .append("g")
//    .attr("transform",
//          "translate(" + margin.left + "," + margin.top + ")");

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
      colorScale.push("#fde725ff");
    }
  }

  var color = d3.scaleOrdinal()
  .domain(yearName)
  .range(colorScale)

  // the list of dimensions we want to keep in the plot.
  var dimensions = ["year","acousticness","danceability","liveness","tempo"]

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (var i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[name]; }) )
      .range([height, 0])
  }

  // Build the X scale -> it find the best position for each Y axis
  //var x = d3.scalePoint()
  // .range([0, width])
   //.padding(1)
  // .domain(dimensions);

   var x = d3.scalePoint().domain(dimensions).range([margin.left, width - margin.right - margin.left]);

 // Highlight the specie that is hovered
 var highlight = function(d){

   var selected_year = d.year;

   // first every group turns grey
   d3.selectAll(".line")
     .transition().duration(200)
     .style("stroke", "lightgrey")
     .style("opacity", "0.2")
   // Second the hovered specie takes its color
   d3.selectAll(".line" + selected_year)
     .transition().duration(500)
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
 svg
   .selectAll("myPath")
   .data(data)
   .enter()
   .append("path")
   .attr("class", function (d) { return "line " + d.year } )
   .attr("d",  path)
   .style("fill", "none")
   .style("stroke", function(d){ return( color(d.year))} )
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
     // Add axis title
     .append("text")
       .style("text-anchor", "middle")
       .attr("y", -9)
       .text(function(d) { return d; })
       .style("fill", "black")


}

function drawBarChartCSV_genreTempo(data, id) {

  //const margin = { top: 40, right: 5, bottom: 120, left: 40 };
  //const parentDiv = document.getElementById(id.substring(1));
  //const height = 400;
  //const width = parentDiv.clientWidth;

    //stick something above.
    const margin = { top: 40, right: 40, bottom: 120, left: 100 };
    const height = 300;
    const width = 500;

    const x = d3.scaleBand().domain(data.map(d => d.genres))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.0001);

    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.tempo)]).nice()
        .rangeRound([height - margin.bottom, margin.top]);

    let svg = d3.select(id).append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.genres))
        .attr("y", d => y(d.tempo))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.tempo))
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



function drawBarChartCSV(data, id) {

  //const margin = { top: 40, right: 5, bottom: 120, left: 40 };
  //const parentDiv = document.getElementById(id.substring(1));
  //const height = 400;
  //const width = parentDiv.clientWidth;

    //stick something above.
    const margin = { top: 40, right: 40, bottom: 120, left: 100 };
    const height = 300;
    const width = 1200;

    const x = d3.scaleBand().domain(data.map(d => d.year))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.tempo)]).nice()
        .rangeRound([height - margin.bottom, margin.top]);

    let svg = d3.select(id).append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.year))
        .attr("y", d => y(d.tempo))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.tempo))
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

/*
function drawBarChartCsv(data,id){

  var margin = ({top: 40, right: 40, bottom: 40, left: 100});
  var height = 400;
  var width = 400;

  const chartdata = processData(data); //fetch the processed data

  //create svg element
  const svg = d3.create("svg").attr("viewBox", [0,0,width,height]);

  // set x axis scale
  const x = d3.scaleLinear()
  .domain([0, d3.max(chartdata, d => d.average)]) //our average price data ranges from 0 - Max
  .range([margin.left, width - margin.right]);
  //set y axis scale
  const y = d3.scaleBand()
  .domain(chartdata.map(d => d.name))
  .rangeRound([margin.top, height - margin.bottom])
  .padding(0.1);

  //draw the chart
  svg.selectAll("rect") //Selects all defined elements in the DOM and hands off a reference to the next step in the chain.
  .data(chartdata) //connect chart data with DOM <rect/> elements
  .join("rect") // appends a new SVG rect element for each element in our chartdata array.
  .attr('x', (d) => x(0)) //since this is a horizontal bar chart we start the bottom of the chart at the left
  .attr('y', (d) => y(d.name)) // bar y position
  .attr("height", y.bandwidth()) // height of the bar so they all stack nicely near eachother
  .attr("width", (d) =>  x(d.average) - x(0)) // height of the bar so they all stack nicely near eachother
  .attr("fill","green"); // color of the bar

  //initialize the location for the X and Y Axis
  const xAxis = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x))

  const yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y))

  // append each to the svg so they will be rendered
  svg.append("g")
  .call(xAxis)
  .call(g =>
    g .select(".tick:last-of-type text")
    .clone()
    .attr("text-anchor", "middle")
    .attr("x", -(width - margin.left - margin.right) / 2)
    .attr("y", margin.bottom - 10)
    .attr("font-weight", "bold")
    .text("Average Acousticness")
  );

  svg.append("g")
  .call(yAxis)
  .call(g =>
    g.select(".tick:last-of-type text")
    .clone()
    .attr("transform", `rotate(-90)`)
    .attr("text-anchor", "middle")
    .attr("x", -(15 - margin.top - margin.bottom) / 2)
    .attr("y", -80)
    .attr("font-weight", "bold")
    .text("Track number Group")
  );


  return svg.node();

}
*/
