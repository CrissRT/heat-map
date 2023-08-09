
let items;

let height = 500;
let width = 1000;
let padding = 40;

let svg = d3.select("#stat-container")
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .classed("svg-content-responsive", true);


function drawCanvas() {
  svg.attr("width", width)
     .attr("height", height)
     .append("text")
     .attr("x", (width / 2))
     .attr("y", 30)
     .attr("id", "title")
     .text("USA GDP");
}

    function generateScales() {
      heightScale = d3.scaleLinear()
                      .domain([0, d3.max(items, (d) => d[1])])
                      .range([0, height - 2 * padding]);

      xScale = d3.scaleLinear()
                 .domain([0, items.length - 1])
                 .range([padding, width - padding]);                 
                    
      let datesArray = items.map((d) =>
        new Date(d[0])
      );           

      xAxisScale = d3.scaleTime()
                     .domain([d3.min(datesArray ), d3.max(datesArray)])
                     .range([padding, width - padding]);
                    
      yAxisScale = d3.scaleLinear()
                     .domain([0, d3.max(items, (d) => d[1])])
                     .range([height - padding, padding]);                 
    }

function generateAxes() {
  let xAxis = d3.axisBottom(xAxisScale);

  svg.append("g")
     .call(xAxis)
     .attr("id", "x-axis")
     .attr('transform', `translate(0, ${height - padding})`);

  let yAxis = d3.axisLeft(yAxisScale);

  svg.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr('transform', `translate(${padding}, 0)`);
}

function generateBars() {
  let tooltip = d3.select("#stat-container")
                  .append("div")
                  .attr("id", "tooltip")
                  .style("visibility", "hidden")

  const widthOfBar = (width - (2 * padding)) / items.length;

  svg.selectAll("rect")
     .data(items)
     .enter()
     .append("rect")
     .attr("class", "bar")
     .attr("width", `${widthOfBar}`)
     .attr("data-date", item => item[0])
     .attr("data-gdp", item => item[1])
     .attr("x", (item, index) => xScale(index))
     .attr("y", (item) => (height - padding) - heightScale(item[1]))
     .on("mouseover", function(event, d) {
        const index = d3.select(this.parentNode).selectAll("rect").nodes().indexOf(this); // Get the index of the current rect
        const datesArray = parseInt(d[0]);
        const textarea = `$${Math.round(d[1])} Billions`
        const stringText = textarea +  " Y" + datesArray;

        svg.select(`rect[data-date='${d[0]}']`).style("fill", "white")
        
          const item = d3.select(this).datum();
        
          tooltip.transition()
                .style("visibility", "visible");
          
          if(index < items.length / 1.5)
          {
            tooltip.style("left", (event.pageX - 80) + "px").style("top", (event.pageY - 100) + "px");
          } else {
            tooltip.style("left", (event.pageX - 350) + "px").style("top", (event.pageY -50) + "px");
          }
        
          tooltip.text(stringText);
        
          document.querySelector("#tooltip").setAttribute("data-date", item[0]);
      })   
      .on("mouseout", (event, d) => {
        svg.select(`rect[data-date='${d[0]}']`)
           .style("fill", "black")
          tooltip.transition()
                 .style("visibility", "hidden");
      })      
     .attr("height", (item) => heightScale(item[1]));
}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(data => {
    items = data.data;
    drawCanvas();
    generateScales();
    generateAxes();
    generateBars();
  })