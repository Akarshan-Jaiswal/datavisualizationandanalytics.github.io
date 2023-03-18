// set the dimensions and margins of the graph
const scatter_plot_margin = {top: 90, right: 60, bottom: 120, left: 90},
    scatter_plot_width = window.innerWidth-90 - scatter_plot_margin.left - scatter_plot_margin.right,
    scatter_plot_height = window.innerHeight-120 - scatter_plot_margin.top - scatter_plot_margin.bottom;

// append the svg object to the body of the page
const scatter_plot_svg = d3.select("#scatterplot_div")
  .append("svg")
    .attr("width", scatter_plot_width + scatter_plot_margin.left + scatter_plot_margin.right)
    .attr("height", scatter_plot_height + scatter_plot_margin.top + scatter_plot_margin.bottom)
    .attr("id","scatter_plot")
  .append("g")
    .attr("transform",
          `translate(${scatter_plot_margin.left}, ${scatter_plot_margin.top})`);

let data_path="https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW1_test_branch/Dataset/Processed/scatter_plot_data_multi_full.csv"
createScatterPlot("gdp_per_capita","stringency_index","location",scatter_plot_width,scatter_plot_height,scatter_plot_svg,data_path,"scatter_inputX","scatter_inputY")
function createScatterPlot(parameter1,parameter2,parameter3,chart_width,chart_height,chart_svg,csv_path,input_idX,input_idY){
    chart_svg.selectAll("g").remove();

    chart_svg.append("svg")
        .attr("width", chart_width + scatter_plot_margin.left + scatter_plot_margin.right)
        .attr("height", chart_height + scatter_plot_margin.top + scatter_plot_margin.bottom)
        .attr("id","scatter_plot")
        .append("g")
        .attr("transform",
                `translate(${scatter_plot_margin.left}, ${scatter_plot_margin.top})`);
        
    //Read the data
    d3.csv(csv_path).then( function(data) {
        
        // Add X axis
        const scatter_plot_x = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d[parameter1])])
        .range([ 0, chart_width ]);
        const scatter_plot_xAxis = chart_svg.append("g")
        .attr("transform", `translate(0, ${chart_height})`)
        .call(d3.axisBottom(scatter_plot_x));

        // Add Y axis
        const scatter_plot_y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d[parameter2])])
        .range([ chart_height, 0]);
        chart_svg.append("g")
        .call(d3.axisLeft(scatter_plot_y));

        // Add Y axis label
        chart_svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("x", 135)
        .attr("dy", ".75em")
        .text(parameter2).style("font-family","montserrat,sans-serif");

        // Add X axis label
        chart_svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", chart_width)
        .attr("y", chart_height - 6)
        .text(parameter1).style("font-family","montserrat,sans-serif");

        // Add title for the chart. 
        chart_svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", chart_width/2)
        .attr("y", -50)
        .text("Scatter-plot for "+parameter1+" vs "+parameter2).style("font-family","montserrat,sans-serif");

        //adding information Rectangle
        chart_svg.append("g").attr("id","rect_sc").attr("class", "item").append("rect")
        .attr("id","info_rect_sc")
        //.attr("x",chart_width-(chart_width-80))
        .attr("x",chart_width-(chart_width/2)+10)
        //.attr("y",(chart_height-(chart_height-60))/2)
        .attr("y",-85)
        .attr("width",chart_width-(chart_width-10)/2)
        .attr("height",chart_height/6)
        .style("fill","yellow")
        .style("top",1)
        .style("opacity", 0)


        //adding Hover and Click Functions
        let mouseOver=function(d){
            d3.select(this).style("fill","pink").transition()
            .duration(400);
            d3.select("#rect_sc").selectAll("text").remove()
            d3.select("#info_rect_sc").transition()
            .duration(200)
            .style("opacity", .8).style("stroke", "black");
            d3.select("#rect_sc").append("text").text("Selected Data: ")
            //.attr("x",chart_width-(chart_width-90))
            .attr("x",chart_width-(chart_width/2)+30)
            //.attr("y",(chart_height-(chart_height-60)))
            .attr("y",-55)
            .style("font-size", "20px").style("font-family", "montserrat").style("opacity", 0.6)
            .style("text-align", "center").style("top",3).transition()
            .duration(200);
            d3.select("#rect_sc").append("text").text(d3.select(this).attr("id"))
            //.attr("x",chart_width-(chart_width-90))
            .attr("x",chart_width-(chart_width/2)+30)
            //.attr("y",(chart_height-(chart_height-60))+20)
            .attr("y",-20)
            .style("font-size", "20px").style("font-family", "montserrat").style("opacity", 0.6)
            .style("text-align", "center").style("top",3).transition()
            d3.select("#rect_sc").append("text").text("Click to see the Total Cases over time for it.")
            .attr("x",chart_width-(chart_width/2)+30)
            //.attr("x",chart_width-(chart_width-90))
            //.attr("y",(chart_height-(chart_height-60))+50)
            .attr("y",10)
            .style("font-size", "20px").style("font-family", "montserrat").style("opacity", 0.6)
            .style("text-align", "center").style("top",3).transition()
          .duration(200);
        }
        let mouseLeave = function(d) {
            d3.select(this).style("fill","blue").transition()
            .duration(600);
                d3.select("#info_rect_sc").transition()
                .duration(100)
                .style("opacity", 0)
                d3.select("#rect_sc").selectAll("text").remove()
          }
        let mouseClick = function(d){
            d3.select(this).style("fill","red").transition()
            .duration(400);
            selected_country=(d3.select(this).attr('id')).substring(0,(d3.select(this).attr('id')).indexOf("="))
            console.log(selected_country);
            createLineChart(selected_country,linechart_width,linechart_height,line_chart_svg,git_path+"Dataset/Processed_files/Time_distributed/total_cases.csv");
            toLineChartFunction();
        }
        // Add dots
        let dots=chart_svg.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
            .attr("cx", function (d) { return scatter_plot_x(d[parameter1]); } )
            .attr("cy", function (d) { return scatter_plot_y(d[parameter2]); } )
            .attr("id", function (d) { return (d[parameter3]+"="+parameter2+"("+Number(d[parameter2]).toFixed(2)+") / "+parameter1+"("+Number(d[parameter1]).toFixed(2)+")")})
            .attr("r", 6)
            .style("fill", function(d){ if (d[parameter3]===selected_country){
                return "red"
            }
                return "blue"
            } )
            .style("stroke", "#69b3a2" )
        dots.on('mouseover',mouseOver).on('mouseleave',mouseLeave).on('click',mouseClick);
        dots.style("transform", "scale(0.001, 0.001)")
        .transition()
        .duration(1500)
        .style("transform", null);

        // A function that update the plot for a given scatter_update value
        function updatePlotX() {

        // Get the value of the button
        scatter_updateX = this.value

        // Update X axis
        scatter_plot_x.domain([0,scatter_updateX])
        scatter_plot_xAxis.transition().duration(1000).call(d3.axisBottom(scatter_plot_x))

        // Update chart
        chart_svg.selectAll("circle")
            .data(data)
            .transition()
            .duration(1000)
            .attr("cx", function (d) { return scatter_plot_x(d[parameter1]); } )
            .attr("cy", function (d) { return scatter_plot_y(d[parameter2]); } )
        }
        function updatePlotY() {

            // Get the value of the button
            scatter_updateY = this.value
    
            // Update X axis
            scatter_plot_y.domain([0,scatter_updateY])
            scatter_plot_xAxis.transition().duration(1000).call(d3.axisBottom(scatter_plot_x))
    
            // Update chart
            chart_svg.selectAll("circle")
                .data(data)
                .transition()
                .duration(1000)
                .attr("cx", function (d) { return scatter_plot_x(d[parameter1]); } )
                .attr("cy", function (d) { return scatter_plot_y(d[parameter2]); } )
            }

        // Add an event listener to the button created in the html part
        d3.select("#"+input_idX).on("input", updatePlotX )
        d3.select("#"+input_idY).on("input", updatePlotY )
    })
}

