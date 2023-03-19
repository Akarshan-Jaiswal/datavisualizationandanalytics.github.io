//Making Map
const choropleth_svg = d3.select("#choropleth_div").append("svg")
.style('background','radial-gradient(circle, rgba(32,123,142,1) 0%, rgba(9,33,121,1) 48%, rgba(2,0,36,1) 88%)');
    choropleth_svg.attr("width",window.innerWidth);
    choropleth_svg.attr("height",window.innerHeight-100);
    choropleth_svg.attr("id","map");
    const choropleth_width = +choropleth_svg.attr("width")
    const choropleth_height = +choropleth_svg.attr("height");

  choropleth_plotter(choropleth_width,choropleth_height,choropleth_svg,
    [1000,10000,50000,100000,250000,750000,1000000,50000000],git_path+"Resources/GeoJsons/Extensive.geojson",
    git_path+"Dataset/Average_cases/total.csv",0,["",""],0)

  function choropleth_plotter(map_width,map_height,map_svg,scale_domain,geojson_path,csv_path,map_state,map_funtions,info_rect){
    if (info_rect===0){
      //adding information Rectangle
      map_svg.append("g").attr("id","rect_g").attr("class", "item").append("rect")
      .attr("id","info_rect")
      .attr("x",map_width-(map_width-80))
      .attr("y",map_height/2)
      .attr("width",map_width/7)
      .attr("height",map_height/9)
      .style("fill","grey")
      .style("top",1)
      .style("opacity", 0)

      map_svg.append("g").attr("id","rect_g_2").attr("class", "item").append("rect")
      .attr("id","info_rect_2")
      .attr("x",map_width-(map_width-80))
      .attr("y",map_height/5)
      .attr("width",map_width/7)
      .attr("height",map_height/5)
      .style("fill","white")
      .style("top",1)
      .style("opacity", 0)

      map_svg.append("g").attr("id","rect_g_3").attr("class", "item").append("rect")
      .attr("id","info_rect_3")
      .attr("x",map_width-(map_width-80))
      .attr("y",map_height/10)
      .attr("width",map_width/9)
      .attr("height",map_height/11)
      .style("fill","beige")
      .style("top",1)
      .style("opacity", 1)
      d3.select("#rect_g_3").append("text").text("Density of Covid cases")
      .attr("x",map_width-(map_width-85)).attr("y",(map_height/10)+25)
      .style("font-size", "20px").style("font-family", "montserrat").style("font-weight", 900)
      .style("text-align", "center")
      d3.select("#rect_g_3").append("text").text("throughout the world.")
      .attr("x",map_width-(map_width-85)).attr("y",(map_height/10)+45)
      .style("font-size", "20px").style("font-family", "montserrat").style("font-weight", 900)
      .style("text-align", "center")

      map_svg.append("g").attr("id","rect_g_4").attr("class", "item").append("rect")
      .attr("id","info_rect_4")
      .attr("x",map_width-(map_width-80))
      .attr("y",map_height-(map_height/9))
      .attr("width",map_width/4)
      .attr("height",map_height/10)
      .style("fill","beige")
      .style("top",1)
      .style("opacity", 0.8)
      d3.select("#rect_g_4").append("text").text("We can observe the biggest contributors of Covid cases")
      .attr("x",map_width-(map_width-85)).attr("y",map_height-(map_height/9)+18)
      .style("font-size", "20px").style("font-family", "montserrat")
      .style("text-align", "center")
      d3.select("#rect_g_4").append("text").text("are the countries with prominent sea routes, High GDP")
      .attr("x",map_width-(map_width-85)).attr("y",map_height-(map_height/9)+35)
      .style("font-size", "20px").style("font-family", "montserrat")
      .style("text-align", "center")
      d3.select("#rect_g_4").append("text").text("and large population density which eases spread of virus.")
      .attr("x",map_width-(map_width-85)).attr("y",map_height-(map_height/9)+52)
      .style("font-size", "20px").style("font-family", "montserrat")
      .style("text-align", "center")
    }
  // Map and projection
  const map_path = d3.geoPath();
  const map_projection = d3.geoMercator()
    .scale(180)
    .center([0,40])
    .translate([map_width / 2, map_height / 2]);
  
  // Data and color scale
  const data = new Map();
  const colorScale = d3.scaleThreshold()
        .domain(scale_domain)
        .range(d3.schemeReds[9]);

      // Load external data and boot
      Promise.all([d3.json(geojson_path),
      d3.csv(csv_path, function(d) {
      data.set(d.location, +d.total_cases)
  })]).then(function(loadData){
      let topo = loadData[0]
  
      //Hover functions
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
        if(info_rect===0){
          d3.select("#info_rect").transition()
          .duration(200)
          .style("opacity", 1).style("stroke", "black");
          d3.select("#rect_g").append("text").text("Highlighted Country: ")
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/2)+25)
          .style("font-size", "20px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
          d3.select("#rect_g").append("text").text(d3.select(this).attr("id"))
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/2)+50)
          .style("font-size", "23px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);

          d3.select("#info_rect_2").transition()
          .duration(200)
          .style("opacity", 1).style("stroke", "black").style("fill",d3.select(this).attr("fill"));
          d3.select("#rect_g_2").append("text").text("The colour represents")
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/5)+20)
          .style("font-size", "20px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
          d3.select("#rect_g_2").append("text").text("the total contribution of")
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/5)+35)
          .style("font-size", "18px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
          d3.select("#rect_g_2").append("text").text(d3.select(this).attr("id")+" in")
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/5)+50)
          .style("font-size", "18px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
          d3.select("#rect_g_2").append("text").text("Covid cases throughout the years")
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/5)+65)
          .style("font-size", "18px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
          d3.select("#rect_g_2").append("text").text("throughout the years.")
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/5)+80)
          .style("font-size", "18px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
          d3.select("#rect_g_2").append("text").text("Note: The darker colour represents")
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/5)+120)
          .style("font-size", "18px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
          d3.select("#rect_g_2").append("text").text("the greater percentage of")
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/5)+135)
          .style("font-size", "18px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
          d3.select("#rect_g_2").append("text").text("Covid cases in the region")
          .attr("x",map_width-(map_width-90)).attr("y",(map_height/5)+150)
          .style("font-size", "18px").style("font-family", "montserrat")
          .style("text-align", "center").style("top",3).transition()
          .duration(200);
        }
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
      if(info_rect===0){
          d3.select("#info_rect").transition()
          .duration(100)
          .style("opacity", 0)
          d3.select("#rect_g").selectAll("text").remove()

          d3.select("#info_rect_2").transition()
          .duration(100)
          .style("opacity", 0)
          d3.select("#rect_g_2").selectAll("text").remove()
        }
    }
  
    //Click function
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
      selected_country=d3.select(this).attr("id");
      createLineChart(selected_country,linechart_width,linechart_height,line_chart_svg,git_path+"Dataset/Processed_files/Time_distributed/total_cases.csv");
      d3.select('body').transition()
      .duration(1500)
      .style("transform", null);
      toLineChartFunction();
    }
  
    // Draw the map
    const final_map=map_svg.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(map_projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
          d.total = data.get(d.properties.name) || 0;
          return colorScale(d.total);
        })
        .attr("id", function (d) {return d.properties.name;
        })
        .attr("title", function (d) {return d.properties.name;
        })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .style("opacity", 1)
    if(map_state===0){
          final_map.on("mouseleave", mouseLeave )
          .on("click",countryClick)
          .on("mouseover",mouseOver)
        }else if (map_state===1){
          map_funtions.forEach(element => {
            final_map.on(element[0],element[1])
          });
        }
  })
  }