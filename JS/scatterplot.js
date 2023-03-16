// set the dimensions and margins of the graph
const scatter_plot_margin = {top: 10, right: 60, bottom: 120, left: 90},
    scatter_plot_width = window.innerWidth - scatter_plot_margin.left - scatter_plot_margin.right,
    scatter_plot_height = window.innerHeight - scatter_plot_margin.top - scatter_plot_margin.bottom;

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
const data_path=git_path+"Dataset/Processed_files/Time_distributed/total_cases.csv"
createScatterPlot("Sepal_Length","Petal_Length",scatter_plot_width,scatter_plot_height,scatter_plot_svg,csv_pathe,"scatter_input")
//createScatterPlot("Africa","Africa",scatter_plot_width,scatter_plot_height,scatter_plot_svg,data_path,"scatter_input")
//createScatterPlot(selected_country,selected_country,scatter_plot_width,scatter_plot_height,scatter_plot_svg,data_path,"scatter_input")
function createScatterPlot(parameter1,parameter2,chart_width,chart_height,chart_svg,csv_path,input_id){
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
        .domain([3, 9])
        .range([ 0, chart_width ]);
        const scatter_plot_xAxis = chart_svg.append("g")
        .attr("transform", `translate(0, ${chart_height})`)
        .call(d3.axisBottom(scatter_plot_x));

        // Add Y axis
        const scatter_plot_y = d3.scaleLinear()
        .domain([0, 9])
        .range([ chart_height, 0]);
        chart_svg.append("g")
        .call(d3.axisLeft(scatter_plot_y));

        // Add dots
        chart_svg.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
            .attr("cx", function (d) { return scatter_plot_x(d[parameter1]); } )
            .attr("cy", function (d) { return scatter_plot_y(d[parameter2]); } )
            .attr("r", 10)
            .style("fill", "#radial-gradient(circle, rgba(32,123,142,1) 0%, rgba(9,33,121,1) 48%, rgba(2,0,36,1) 88%)" )
            .style("stroke", "#69b3a2" )
            .style("transform", "scale(0.001, 0.001)")
            .transition()
            .duration(1500)
            .style("transform", null)


        // A function that update the plot for a given xlim value
        function updatePlot() {

        // Get the value of the button
        xlim = this.value

        // Update X axis
        scatter_plot_x.domain([3,xlim])
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
        d3.select("#"+input_id).on("input", updatePlot )
    })
}
