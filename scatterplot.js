// Set the dimensions and margins of the graph
const margin = {top: 20, right: 30, bottom: 40, left: 50},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the CSV data
d3.csv("Housing.csv").then(data => {

  // Parse the data
  data.forEach(d => {
    d.price = +d.price;
    d.area = +d.area;
  });

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.area)])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.price)])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.area))
      .attr("cy", d => y(d.price))
      .attr("r", 5)
      .style("fill", "#69b3a2");

}).catch(error => {
  console.error('Error loading or parsing data.');
});