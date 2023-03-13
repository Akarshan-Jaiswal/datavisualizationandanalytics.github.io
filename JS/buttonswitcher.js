const div1 = document.getElementById("my_dataviz2");
const div2 = document.getElementById("my_circular_bar_plot");
const div3 = document.getElementById("scatterplot");
const div4 = document.getElementById("my_dataviz1");
const div5 = document.getElementById("svg_loop");

const toggleTovirusloop = document.getElementById("virus_button");
const toggleTolinechart = document.getElementById("line_plot_button");
const toggleTochoropleth = document.getElementById("choropleth_button");
const toggleTocircularbarplot = document.getElementById("circular_bar_plot_button");
const toggleToscatterplot = document.getElementById("scatter_plot");
const toggleToall = document.getElementById("show_all");

const hide = el => el.style.setProperty("display", "none");
const show = el => el.style.setProperty("display", "block");

toggleTochoropleth.addEventListener("click", () => {
    show(div1);
    hide(div2);
    hide(div3);
    hide(div4);
    hide(div5);
  });
toggleTocircularbarplot.addEventListener("click", () => {
    show(div2);
    hide(div1);
    hide(div3);
    hide(div4);
    hide(div5);
  });
toggleToscatterplot.addEventListener("click", () => {
    show(div3);
    hide(div2);
    hide(div1);
    hide(div4);
    hide(div5);
  });
  toggleTolinechart.addEventListener("click", () => {
    show(div4);
    hide(div2);
    hide(div1);
    hide(div3);
    hide(div5);
  });
  toggleTovirusloop.addEventListener("click", () => {
    show(div5);
    hide(div2);
    hide(div1);
    hide(div4);
    hide(div3);
  });
toggleToall.addEventListener("click", () => {
    show(div1);
    show(div2);
    show(div3);
    show(div4);
    show(div5);
  });