// set the dimensions and margins of the graph
const scatter_plot_margin = {top: 10, right: 30, bottom: 30, left: 60},
    scatter_plot_width = window.innerWidth - scatter_plot_margin.left - scatter_plot_margin.right,
    scatter_plot_height = window.innerHeight - scatter_plot_margin.top - scatter_plot_margin.bottom;

// append the svg object to the body of the page
const scatter_plot_svg = d3.select("#my_scatter_plot")
  .append("svg")
    .attr("width", scatter_plot_width + scatter_plot_margin.left + scatter_plot_margin.right)
    .attr("height", scatter_plot_height + scatter_plot_margin.top + scatter_plot_margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${scatter_plot_margin.left}, ${scatter_plot_margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv").then( function(data) {

  // Add X axis
  const scatter_plot_x = d3.scaleLinear()
    .domain([3, 9])
    .range([ 0, scatter_plot_width ]);
  const scatter_plot_xAxis = scatter_plot_svg.append("g")
    .attr("transform", `translate(0, ${scatter_plot_height})`)
    .call(d3.axisBottom(scatter_plot_x));

  // Add Y axis
  const scatter_plot_y = d3.scaleLinear()
    .domain([0, 9])
    .range([ scatter_plot_height, 0]);
  scatter_plot_svg.append("g")
    .call(d3.axisLeft(scatter_plot_y));

  // Add dots
  scatter_plot_svg.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
      .attr("cx", function (d) { return scatter_plot_x(d.Sepal_Length); } )
      .attr("cy", function (d) { return scatter_plot_y(d.Petal_Length); } )
      .attr("r", 10)
      .style("fill", "#transparent" )
      .style("stroke", "#69b3a2" )


  // A function that update the plot for a given xlim value
  function updatePlot() {

    // Get the value of the button
    xlim = this.value

    // Update X axis
    scatter_plot_x.domain([3,xlim])
    scatter_plot_xAxis.transition().duration(1000).call(d3.axisBottom(scatter_plot_x))

    // Update chart
    scatter_plot_svg.selectAll("circle")
       .data(data)
       .transition()
       .duration(1000)
       .attr("cx", function (d) { return scatter_plot_x(d.Sepal_Length); } )
       .attr("cy", function (d) { return scatter_plot_y(d.Petal_Length); } )
  }

  // Add an event listener to the button created in the html part
  d3.select("#buttonXlim").on("input", updatePlot )

})