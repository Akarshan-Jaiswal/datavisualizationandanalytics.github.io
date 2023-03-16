// set the dimensions and margins of the graph
const scatter_plot_margin = {top: 90, right: 60, bottom: 120, left: 90},
    scatter_plot_width = window.innerWidth-120 - scatter_plot_margin.left - scatter_plot_margin.right,
    scatter_plot_height = window.innerHeight-200 - scatter_plot_margin.top - scatter_plot_margin.bottom;

// append the svg object to the body of the page
const scatter_plot_svg = d3.select("#scatterplot_div")
  .append("svg")
    .attr("width", scatter_plot_width + scatter_plot_margin.left + scatter_plot_margin.right)
    .attr("height", scatter_plot_height + scatter_plot_margin.top + scatter_plot_margin.bottom)
    .attr("id","scatter_plot")
  .append("g")
    .attr("transform",
          `translate(${scatter_plot_margin.left}, ${scatter_plot_margin.top})`);

const csv_pathe="https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv";
let data_path=git_path+"Dataset/Processed_files/Time_distributed/total_cases.csv";
data_path="https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW1_test_branch/Dataset/Processed/scatter_plot_data_multi.csv"
createScatterPlot("gdp_per_capita","reproduction_rate",scatter_plot_width,scatter_plot_height,scatter_plot_svg,data_path,"scatter_inputX","scatter_inputY")
function createScatterPlot(parameter1,parameter2,chart_width,chart_height,chart_svg,csv_path,input_idX,input_idY){
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

        chart_svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("x", 135)
        .attr("dy", ".75em")
        //.attr("transform", "rotate(-90)")
        .text(parameter2).style("font-family","montserrat,sans-serif");

        chart_svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", chart_width)
        .attr("y", chart_height - 6)
        .text(parameter1).style("font-family","montserrat,sans-serif");

        chart_svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", chart_width/2)
        .attr("y", -50)
        .text("Scatter-plot for "+parameter1+" vs "+parameter2).style("font-family","montserrat,sans-serif");

        chart_svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", chart_width-(chart_width/20))
        .attr("y", 160)
        .text("The aim of the following Scatter plot is to show the variance in the reproduction rate of the virus in countries with variyng Gross Domestic Products.")
        .style("font-family","montserrat,sans-serif").style("opacity",0.3).style("font-size", "23px")
        .transition().duration(15000).style("transform", "scale(0.001, 0.001)");

        chart_svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", chart_width-(chart_width/20))
        .attr("y", 210)
        .text("In the following Scatter plot we have additional functionality to adjust Xlims and Ylims to have more Information or zoom in or out about the dataset.")
        .style("font-family","montserrat,sans-serif").style("opacity",0.3).style("font-size", "23px")
        .transition().duration(15000).style("transform", "scale(0.001, 0.001)");


        // Add dots
        chart_svg.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
            .attr("cx", function (d) { return scatter_plot_x(d[parameter1]); } )
            .attr("cy", function (d) { return scatter_plot_y(d[parameter2]); } )
            .attr("r", 4)
            .style("fill", "blue" )
            .style("stroke", "#69b3a2" )
            .style("transform", "scale(0.001, 0.001)")
            .transition()
            .duration(1500)
            .style("transform", null)


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
            scatter_plot_x.domain([0,scatter_updateY])
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
