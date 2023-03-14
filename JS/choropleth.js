const choropleth_svg = d3.select("#choropleth_div").append("svg")
.style('background','radial-gradient(circle, rgba(32,123,142,1) 0%, rgba(9,33,121,1) 48%, rgba(2,0,36,1) 88%)');
    choropleth_svg.attr("width",window.innerWidth);
    choropleth_svg.attr("height",window.innerHeight-100);
    choropleth_svg.attr("id","map");
    const choropleth_width = +choropleth_svg.attr("width")
    const choropleth_height = +choropleth_svg.attr("height");

// Map and projection
const choropleth_path = d3.geoPath();
const choropleth_projection = d3.geoMercator()
  .scale(180)
  .center([0,40])
  .translate([choropleth_width / 2, choropleth_height / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
      //.domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
      .domain([1000,10000,50000,100000,250000,750000,1000000,1000000000])
      .range(d3.schemeReds[9]);
    
    // Load external data and boot
    Promise.all([d3.json(git_path+"Resources/GeoJsons/Extensive.geojson"),
    d3.csv(git_path+"Dataset/Average_cases/total.csv", function(d) {
    data.set(d.location, +d.total_cases)
})]).then(function(loadData){
    let topo = loadData[0]

    let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .3)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
      console.log(d3.select(this).attr("id"),d3.select(this).attr("fill"))
  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", 1)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "")
  }

  let countryClick = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", 0);
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
      .attr('transform', d3.zoomTransform(this))
    console.log(d3.select(this).attr("id"))
    selected_country=d3.select(this).attr("id");
    createLineChart(selected_country,linechart_width,linechart_height,line_chart_svg,git_path+"Dataset/Processed_files/Time_distributed/total_cases.csv");
    createScatterPlot(selected_country,selected_country,scatter_plot_width,scatter_plot_height,scatter_plot_svg,data_path,"scatter_input");
  }

  // Draw the map
  const final_map=choropleth_svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(choropleth_projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.properties.name) || 0;
        return colorScale(d.total);
      })
      .attr("id", function (d) {return d.properties.name;
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", 1)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .on("click",countryClick)

      /*
    const choroplethbutton_svg = d3.select("#choropleth_div").append("svg")
      .style('background','radial-gradient(circle, rgba(34,195,103,1) 0%, rgba(233,195,112,1) 95%);');
      choroplethbutton_svg.attr("width",window.innerWidth);
      choroplethbutton_svg.attr("height",window.innerHeight-100);
      choroplethbutton_svg.attr("id","button");
      choroplethbutton_svg.append("rect").attr("x", window.innerWidth-10 )
    .attr("y", 10 )
    .attr("width", 100).attr("height", 10)
    .style("fill", "#transparent" )
    .style("stroke", "#69b3a2" )//.text("Hello, world!")
    //.style("text-align", "center")
    //.style("line-height", "320px")
    //.style("font-size", "100px").attr("fill", "green")//.on("click",refresh_map_click())
    */
})