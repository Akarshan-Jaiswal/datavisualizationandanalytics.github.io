//const winwidth = window.innerWidth;
//const winheight = window.innerHeight;
const svg = d3.select("#my_dataviz2").append("svg");
    svg.attr("width",window.innerWidth-100);
    svg.attr("height",window.innerHeight-100);
    const width = +svg.attr("width")
    const height = +svg.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(170)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  //.range(d3.schemeBlues[9]);
  .range(d3.schemeSpectral[8]);

// Load external data and boot
Promise.all([
//d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
//d3.json("./Resources/GeoJsons/Extensive.geo.json"),
d3.json("https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/0fc1e7546891c72229284fc3b27d192a62bad4b7/Resources/GeoJsons/world.geojson"),
//d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) {
d3.csv("https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/25918413839b04f05c92aa011480707a805533f7/Dataset/Average_cases/total.csv", function(d) {
    //data.set(d.code, +d.pop)
    data.set(d.iso_code, +d.total_cases)
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

  const handleZoom = (e) => g.attr('transform', e.transform);
  const zoom = d3.zoom().on('zoom', handleZoom);

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
    console.log(this)
  }

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", 1)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .on("click",countryClick).call(zoom)

})

