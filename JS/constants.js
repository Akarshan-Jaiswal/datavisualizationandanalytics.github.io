// Constants 
var git_path="https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW1/";
const margin = {top: 10, right: 30, bottom: 30, left: 60},
width = window.innerWidth -20 - margin.left - margin.right,
height = window.innerHeight -120  - margin.top - margin.bottom;
var picked_color="";
var selected_country="World";
var selected_sc_option_1="gdp_per_capita";
var selected_sc_option_2="stringency_index";

// Get the button
let To_topBtn = document.getElementById("To_topBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if ((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)
  &&(document.documentElement.scrollTop < window.innerHeight+20)) {
    To_topBtn.style.display = "block";
    To_topBtn.textContent = "Back to Top";
    To_topBtn.title = "Scrole Back to Top";
    To_topBtn.onclick=topFunction;
  }else if ((document.body.scrollTop > window.innerHeight+20 || document.documentElement.scrollTop > window.innerHeight+20)) {
    To_topBtn.style.display = "block";
    To_topBtn.textContent = "Back to Map";
    To_topBtn.title = "Scrole Back to Map";
    To_topBtn.onclick=toChoroplethFunction;
  }else {
    To_topBtn.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top and different sections of the document
function scrollerFunction(){

}
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
function toChoroplethFunction() {
    document.body.scrollTop = window.innerHeight-40;
    document.documentElement.scrollTop = window.innerHeight-40;
}
function toLineChartFunction() {
    document.body.scrollTop = (2*window.innerHeight)-180;
    document.documentElement.scrollTop = (2*window.innerHeight)-180;
}
function toScatterPlotFunction() {
  document.body.scrollTop = (3*window.innerHeight)-220;
  document.documentElement.scrollTop = (3*window.innerHeight)-220;
}
function toStreamGraphFunction() {
  document.body.scrollTop = (4*window.innerHeight)-220;
  document.documentElement.scrollTop = (4*window.innerHeight)-220;
}
function grab_sc_parameter(select_button_id,static_var){
  if(d3.select("#"+select_button_id).node().value===""){
    return static_var
  }else{
    return d3.select("#"+select_button_id).node().value
  }
}
function selection_sc(){
  let selection_parameter_1="parameter_sc_1";
  let selection_parameter_2="parameter_sc_2";
  selected_sc_option_1=grab_sc_parameter(selection_parameter_1,selected_sc_option_1)
  selected_sc_option_2=grab_sc_parameter(selection_parameter_2,selected_sc_option_2)
}
function submit_sc(){
  createScatterPlot(selected_sc_option_1,selected_sc_option_2,"location",scatter_plot_width,scatter_plot_height,scatter_plot_svg,data_path,"scatter_inputX","scatter_inputY")
}