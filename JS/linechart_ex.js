const linechart_margin = {top: 10, right: 30, bottom: 30, left: 60},
linechart_width = window.innerWidth -20 - linechart_margin.left - linechart_margin.right,
linechart_height = window.innerHeight -120  - linechart_margin.top - linechart_margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz1")
.append("svg")
.attr("width", linechart_width + linechart_margin.left + linechart_margin.right)
.attr("height", linechart_height + linechart_margin.top + linechart_margin.bottom)
.append("g")
.attr("transform",
      `translate(${linechart_margin.left}, ${linechart_margin.top})`);

//Read the data
d3.csv(git_path+"Dataset/Processed_files/Time_distributed/total_cases.csv",

// When reading the csv, I must format variables:
function(d){
return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.World }
}).then(

// Now I can use this dataset:
function(data) {

// Add X axis --> it is a date format
const x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.date; }))
  .range([ 0, linechart_width ]);
xAxis = svg.append("g")
  .attr("transform", `translate(0, ${linechart_height})`)
  .call(d3.axisBottom(x));

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) { return +d.World; })])
  .range([ linechart_height, 0 ]);
yAxis = svg.append("g")
  .call(d3.axisLeft(y));

// Add a clipPath: everything out of this area won't be drawn.
const clip = svg.append("defs").append("svg:clipPath")
    .attr("id", "clip")
    .append("svg:rect")
    .attr("width", linechart_width )
    .attr("height", linechart_height )
    .attr("x", 0)
    .attr("y", 0);

// Add brushing
const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
    .extent( [ [0,0], [linechart_width,linechart_height] ] )  // initialise the brush area: start at 0,0 and finishes at linechart_width,linechart_height: it means I select the whole graph area
    .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

// Create the line variable: where both the line and the brush take place
const line = svg.append('g')
  .attr("clip-path", "url(#clip)")

// Add the line
line.append("path")
  .datum(data)
  .attr("class", "line")  // I add the class line to be able to modify this line later on.
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.World) })
    )

// Add the brushing
line
  .append("g")
    .attr("class", "brush")
    .call(brush);

// A function that set idleTimeOut to null
let idleTimeout
function idled() { idleTimeout = null; }

// A function that update the chart for given boundaries
function updateChart(event,d) {

  // What are the selected boundaries?
  extent = event.selection

  // If no selection, back to initial coordinate. Otherwise, update X axis domain
  if(!extent){
    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
    x.domain([ 4,8])
  }else{
    x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
    line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
  }

  // Update axis and line position
  xAxis.transition().duration(1000).call(d3.axisBottom(x))
  line
      .select('.line')
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.World) })
      )
}

// If user double click, reinitialize the chart
svg.on("dblclick",function(){
  x.domain(d3.extent(data, function(d) { return d.date; }))
  xAxis.transition().call(d3.axisBottom(x))
  line
    .select('.line')
    .transition()
    .attr("d", d3.line()
      .x(function(d) { return x(d.date) })
      .y(function(d) { return y(d.World) })
  )
});

})