const loop_svg = d3.select("#svg_loop").append("svg")
  .attr("width",window.innerWidth-100).attr("height",window.innerHeight-100);
  loop_svg.append("image").attr("xlink:href","https://upload.wikimedia.org/wikipedia/commons/d/d8/Compass_card_(de).svg")
    .style("transform", "rotate(-180deg) scale(0.001, 0.001)")
    .transition()
    .duration(1500)
    .style("transform", null);
