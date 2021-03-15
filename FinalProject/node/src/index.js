import testData from "./assets/data/test.json"; /* Example of reading in data */
import "./css/style.scss";
import "./css/styles.css"; /* Example of connecting a style-sheet */
import { drawBarFromCsvAsync } from "./js/barchart"; /* Example of importing one function from a js file for multiple {f(x), f(y), f(z)}*/
import { radar_render, myFunction_radar } from "./js/radar_front";
import { drawScatter } from "./js/scatter_zoom";

// let x = 2;
// console.log(testData);
//drawBarChart(testData["data"], "#bar");
//drawBarChart(testData["data"], "#bar2");
//drawBarChart(testData["data"], "#bar3");
//drawBarChart(testData["data"], "#bar4");
document
  .getElementById("mySelect_radar")
  .addEventListener("change", myFunction_radar);

drawScatter();
drawBarFromCsvAsync();
radar_render("radar_all");

/*
    TODO: all the other logic for implementing your charts + adding in some basic filters
    (e.g. dropdown menus for seeing different aspects of the data)

    if json file, this is the main place to edit.
*/
