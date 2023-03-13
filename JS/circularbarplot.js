
// set the dimensions and margins of the graph
const circular_bar_plot_margin = {top: 100, right: 90, bottom: 90, left: 90},
    circular_bar_plot_width = window.innerHeight - circular_bar_plot_margin.left - circular_bar_plot_margin.right,
    circular_bar_plot_height = window.innerHeight - circular_bar_plot_margin.top - circular_bar_plot_margin.bottom,
    circular_bar_plot_innerRadius = 90,
    circular_bar_plot_outerRadius = Math.min(circular_bar_plot_width, circular_bar_plot_height) / 2;   // the circular_bar_plot_outerRadius goes from the middle of the SVG area to the border

// append the svg object
const circular_bar_plot_svg = d3.select("#my_circular_bar_plot")
  .append("svg")
    .attr("width", circular_bar_plot_width + circular_bar_plot_margin.left + circular_bar_plot_margin.right)
    .attr("height", circular_bar_plot_height + circular_bar_plot_margin.top + circular_bar_plot_margin.bottom)
  .append("g")
    .attr("transform", `translate(${circular_bar_plot_width/2+circular_bar_plot_margin.left}, ${circular_bar_plot_height/2+circular_bar_plot_margin.top})`);

//d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv").then( function(data) {
d3.csv(git_path+"/Dataset/Average_cases/total_for_continents.csv").then( function(data) {

  // Scales
  const circular_bar_plot_x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(d => d.continent)); // The domain of the X axis is the list of states.
  const circular_bar_plot_y = d3.scaleRadial()
      .range([circular_bar_plot_innerRadius, circular_bar_plot_outerRadius])   // Domain will be define later.
      .domain([0, 7000000]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  circular_bar_plot_svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("fill", "#69b3a2")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(circular_bar_plot_innerRadius)
          .outerRadius(d => circular_bar_plot_y(d['total_cases']))
          .startAngle(d => circular_bar_plot_x(d.continent))
          .endAngle(d => circular_bar_plot_x(d.continent) + circular_bar_plot_x.bandwidth())
          .padAngle(0.01)
          .padRadius(circular_bar_plot_innerRadius))

  // Add the labels
  circular_bar_plot_svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("text-anchor", function(d) { return (circular_bar_plot_x(d.continent) + circular_bar_plot_x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((circular_bar_plot_x(d.continent) + circular_bar_plot_x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (circular_bar_plot_y(d['total_cases'])+10) + ",0)"; })
      .append("text")
        .text(function(d){return(d.continent)})
        .attr("transform", function(d) { return (circular_bar_plot_x(d.continent) + circular_bar_plot_x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")

});
