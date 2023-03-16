var git_path="https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/22d80dbd66f2a54936e53e4f019b3f188504c760/";
git_path="https://raw.githubusercontent.com/Akarshan-Jaiswal/datavisualizationandanalytics.github.io/CW1/";
const margin = {top: 10, right: 30, bottom: 30, left: 60},
width = window.innerWidth -20 - margin.left - margin.right,
height = window.innerHeight -120  - margin.top - margin.bottom;
var picked_color="";
var selected_country="United Kingdom";

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

// When the user clicks on the button, scroll to the top of the document
function scrollerFunction(){

}
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
function toChoroplethFunction() {
    document.body.scrollTop = window.innerHeight-20;
    document.documentElement.scrollTop = window.innerHeight-20;
}
function toLineChartFunction() {
    document.body.scrollTop = (2*window.innerHeight)-70;
    document.documentElement.scrollTop = (2*window.innerHeight)-70;
}
function toScatterPlotFunction() {
  document.body.scrollTop = (3*window.innerHeight)-220;
  document.documentElement.scrollTop = (3*window.innerHeight)-220;
}
function toStreamGraphFunction() {
  document.body.scrollTop = (4*window.innerHeight)-220;
  document.documentElement.scrollTop = (4*window.innerHeight)-220;}