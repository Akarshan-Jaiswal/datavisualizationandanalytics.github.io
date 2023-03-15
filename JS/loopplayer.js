const mapLoop_svg = d3.select("#loopmap_div").append("svg")
.style('background','radial-gradient(circle, rgba(132,123,142,1) 0%, rgba(9,33,121,1) 48%, rgba(2,0,36,1) 88%)');
    mapLoop_svg.attr("width",window.innerWidth);
    mapLoop_svg.attr("height",window.innerHeight-100);
    mapLoop_svg.attr("id","map");
    const mapLoop_width = +mapLoop_svg.attr("width")
    const mapLoop_height = +mapLoop_svg.attr("height");

choropleth_plotter(mapLoop_width,mapLoop_height,mapLoop_svg,
      [1000,10000,50000,100000,250000,750000,1000000,1000000000],git_path+"Resources/GeoJsons/Extensive.geojson",
      git_path+"Dataset/Average_cases/total.csv",1,[["mouseover",function (d) {console.log(d3.select(this).attr("id"));}]])
/*

Promise.all([d3.json(git_path+"Resources/GeoJsons/Extensive.geojson"),
d3.csv(git_path+"Dataset/Processed_files/Time_distributed/total_cases.csv", function(da) {
data.set(da.location, +da.total_cases)
})]).then(function(loadData){
let topo = loadData[0]

let mouseOverPlayer = function(da) {
  
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
    console.log(topo);
    d3.selectAll(".Country").data(topo.features).attr("fill",function(da){
      da.total = data.get(da.properties.iso_a3)||0;
        return colorScale(da.total);
    })
    
}
d3.select("body").append("div").attr('id',"choroplethloop_div");
const choroplethbutton_svg = d3.select("#choroplethloop_div").append("svg")
    .style('background','radial-gradient(circle, rgba(34,195,103,1) 0%, rgba(233,195,112,1) 95%);');
    choroplethbutton_svg.attr("width",window.innerWidth);
    choroplethbutton_svg.attr("height",window.innerHeight-100);
    choroplethbutton_svg.attr("id","map_loopplay");
    choroplethbutton_svg.append("rect")
    choroplethbutton_svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath()
      .projection(map_projection)
    )
    // set the color of each country
    .attr("fill", function (da) {
      da.total = data.get(da.properties.name) || 0;
      return colorScale(da.total);
    })
    .attr("id", function (da) {return da.properties.name+"_loopPlay";
    })
    .style("stroke", "transparent")
    .attr("class", function(da){ return "Country" } )
    .style("opacity", 1).on("mouseleave", mouseOverPlayer )
    //.on("click",countryClick)
    .on("mouseover",mouseOverPlayer)
})*/