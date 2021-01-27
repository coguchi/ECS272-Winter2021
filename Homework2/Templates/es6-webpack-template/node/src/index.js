
import testData from "./assets/data/test.json"; /* Example of reading in data */
import './css/style.scss';
import './css/styles.css'; /* Example of connecting a style-sheet */
import {drawBarChart, drawBarFromCsvAsync} from "./js/barchart"; /* Example of importing one function from a js file for multiple {f(x), f(y), f(z)}*/


let x = 2;
console.log(testData);
drawBarChart(testData["data"], "#bar");
drawBarChart(testData["data"], "#bar2");
drawBarChart(testData["data"], "#bar3");
drawBarFromCsvAsync();


/*
    TODO: all the other logic for implementing your charts + adding in some basic filters
    (e.g. dropdown menus for seeing different aspects of the data)

    if json file, this is the main place to edit.
*/
