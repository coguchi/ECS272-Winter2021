import * as d3 from "d3";
//import csvPath from '../assets/data/SF_Historical_Ballot_Measures.csv';
//import csvPath from '../assets/data/data.csv';
import csvPath_yearTempo from '../assets/data/data_by_year.csv';
import csvPath_genreTempo from '../assets/data/data_by_genres.csv';

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
    const data_yearTempo = await d3.csv(csvPath_yearTempo);
    const data_genreTempo = await d3.csv(csvPath_genreTempo);
    console.log(data_yearTempo);
    console.log(data_genreTempo);
    /*console.log(data[0].acousticness);
    console.log(data[0].key);
    for(var key in data[0]) {
     console.log(key)
    }*/

    //process data()
    //const processedData = processData(data);

    //draw chart ()
    //drawBarChartCSV(processedData, 'example1');
    drawBarChartCSV(data_yearTempo, "#yearTempo");
    drawBarChartCSV_genreTempo(data_genreTempo, "#genreTempo");

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
    const width = 500;

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
