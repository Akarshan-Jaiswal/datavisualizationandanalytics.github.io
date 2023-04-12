let selected_country = "";

function openTab(evt, tabName) {
    // Get all elements with class="tab-pane" and hide them
    const tabContents = d3.selectAll(".tab-pane");
    tabContents.style("opacity", "0")
                .style("display", "none");


    // Show the current tab, and add an "active" class to the button that opened the tab
    d3.select(`#${tabName}`).style("display", "block")
                            .transition()
                            .duration(500)
                            .style("opacity", "1")
                            .attr("class", "tab-pane active");
    evt.currentTarget.classList.add("active");

    if (d3.select(`#${tabName}`).attr("data-position") === "start"){
        d3.select(`#${tabName}`).style("display", "block")
                            .transition()
                            .duration(500)
                            .style("opacity", "1")
                            .attr("class", "tab-pane active landing-page");
        evt.currentTarget.classList.add("landing-page");
      d3.select("#floating-previous").style("opacity", "0").style("display", "none").transition()
                            .duration(500);
    }else if(d3.select(`#${tabName}`).attr("data-position") === "end"){
      d3.select("#floating-next").style("opacity", "0").style("display", "none").transition()
                            .duration(500);
    }else{
      d3.select("#floating-previous").style("opacity", "1").style("display", "block").transition()
                            .duration(500);
      d3.select("#floating-next").style("opacity", "1").style("display", "block").transition()
                            .duration(500);
    }
    const nextTab = parseInt(d3.select(`#${tabName}`).attr("data-internalid")) + 1;
    const previousTab = parseInt(d3.select(`#${tabName}`).attr("data-internalid")) - 1;
    let next = document.getElementById("floating-next");
    next.onclick = function(event) {
      openTab(event,String("tab-" + nextTab));
    };
    let previous = document.getElementById("floating-previous");
    previous.onclick = function(event) {
      openTab(event,String('tab-' + previousTab));
    };
    }