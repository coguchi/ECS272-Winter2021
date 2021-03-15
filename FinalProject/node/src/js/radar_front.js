//Reference: VisualCinnamon.com: Alangrafu and Nadieh Bremer --> inspired idea

import { RadarChart } from "./radar";
import * as d3 from "d3v4";

var margin = { top: 70, right: 150, bottom: 50, left: 0 },
  width = Math.min(200, window.innerWidth / 4) - margin.left - margin.right,
  height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

//Data
var data = [
  {
    name: "Ideal",
    axes: [
      { area: "Clarity", value: 93 },
      { area: "Color", value: 94 },
      { area: "Carat", value: 95 },
    ],
  },
  {
    name: "Premium",
    axes: [
      { area: "Clarity", value: 90 },
      { area: "Color", value: 91 },
      { area: "Carat", value: 82 },
    ],
  },
  {
    name: "Very Good",
    axes: [
      { area: "Clarity", value: 87 },
      { area: "Color", value: 86 },
      { area: "Carat", value: 74 },
    ],
  },
  {
    name: "Good",
    axes: [
      { area: "Clarity", value: 70 },
      { area: "Color", value: 80 },
      { area: "Carat", value: 72 },
    ],
  },
  {
    name: "Fair",
    axes: [
      { area: "Clarity", value: 52 },
      { area: "Color", value: 70 },
      { area: "Carat", value: 71 },
    ],
  },
];
// var colorArray = [
//   "#FF355E",
//   "#FD5B78",
//   "#FF6037",
//   "#FF9966",
//   "#FF9933",
//   "#FFCC33",
//   "#FFFF66",
//   "#FFFF66",
//   "#CCFF00",
//   "#66FF66",

// ];
var colorArray = ["#66c2a5","#fc8d62","#e78ac3","#a6d854","#ffd92f"]; //lighter colorful
//var colorArray = ["#87CEFA", "#00BFFF", "#1E90FF", "#0000FF", "#000D8B"];

export const myFunction_radar = () => {
  var x = document.getElementById("mySelect_radar").value;
  radar_render(x);
};

export async function radar_render(index) {
  const parentDiv = document.getElementById("classRadar");
  const widthradar = parentDiv.clientWidth - 200;
  if (index == "radar_all") {
    RadarChart("#radar_chart_d3", data, {
      w: widthradar,
      h: 350,
      margin: margin,
      maxValue: 60,
      levels: 3,
      roundStrokes: false,
      color: d3.scaleOrdinal().range(colorArray),
      format: ".0f",
      legend: { title: "Cut", translateX: 100, translateY: 40 },
      unit: "%",
    });
  } else {
    RadarChart("#radar_chart_d3", [data[index]], {
      w: widthradar,
      h: 350,
      margin: margin,
      maxValue: 60,
      levels: 3,
      roundStrokes: false,
      color: d3.scaleOrdinal().range([colorArray[index]]),
      format: ".0f",
      legend: { title: "Cut", translateX: 100, translateY: 40 },
      unit: "%",
    });
  }
}
