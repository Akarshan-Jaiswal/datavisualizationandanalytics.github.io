// set the dimensions and margins of the graph
const line_chart_margin = {top: 10, right: 30, bottom: 30, left: 60},
line_chart_width = 460 - line_chart_margin.left - line_chart_margin.right,
line_chart_height = 400 - line_chart_margin.top - line_chart_margin.bottom;

// append the svg object to the body of the page
const line_chart = d3.select("#my_dataviz1")
.append("svg")
.attr("width", line_chart_width + line_chart_margin.left + line_chart_margin.right)
.attr("height", line_chart_height + line_chart_margin.top + line_chart_margin.bottom)
.append("g")
.attr("transform", `translate(${line_chart_margin.left},${line_chart_margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

// When reading the csv, I must format variables:
function(d){
return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
}).then(

// Now I can use this dataset:
function(data) {

// Add X axis --> it is a date format
const line_chart_x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.date; }))
  .range([ 0, line_chart_width ]);
line_chart.append("g")
  .attr("transform", `translate(0, ${line_chart_height})`)
  .call(d3.axisBottom(line_chart_x));

// Add Y axis
const line_chart_y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.value; })])
  .range([ line_chart_height, 0 ]);
line_chart.append("g")
  .call(d3.axisLeft(line_chart_y));

// Add the line
line_chart.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return line_chart_x(d.date) })
    .y(function(d) { return line_chart_y(d.value) })
    )

})