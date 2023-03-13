
const loop_svg = d3.select("#svg_loop").append("svg")
  .attr("width", 400).attr("height", 400);

loop_svg.append("image")
  .attr("xlink:href", git_path+"Resources/Images/covid-19.svg")
  .attr("width", 100).attr("height", 100) // set the image size
  .attr("x", 150).attr("y", 150) // set the image position
  .style("position", "absolute")
  .style("top", "50%")
  .style("left", "50%")
  .style("margin-top", "-50px")
  .style("margin-left", "-50px")
  .attr("transform", "rotate(0, 200, 200)") // set the initial rotation angle and center point

d3.select('#svg_loop').select('image')
  .transition()
  .duration(3000)
  .attrTween("transform", () => d3.interpolateString("rotate(0, 200, 200)", "rotate(360, 200, 200)")) // rotate the image for 3 seconds around the center point
  //.repeat(Infinity)