// Set the dimensions and margins of the graphs
const margin = { top: 20, right: 30, bottom: 40, left: 70 }, // Increased left margin
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Append the svg object to the respective div for scatterplot
const svgScatter = d3.select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append the svg object to the respective div for bedrooms bar chart
const svgBedrooms = d3.select("#bedrooms-bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append the svg object to the respective div for stories bar chart
const svgStories = d3.select("#stories-bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create a tooltip div that is hidden by default
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("opacity", 0);

// Load the CSV data
d3.csv("Housing.csv").then(data => {

    // Parse the data
    data.forEach(d => {
        d.price = +d.price;
        d.area = +d.area;
        d.bedrooms = +d.bedrooms;
        d.stories = +d.stories;
    });

    // Create a scatterplot
    // Add X axis
    const xScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.area)])
        .range([0, width]);
    svgScatter.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScatter));

    // Add Y axis
    const yScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([height, 0]);
    svgScatter.append("g")
        .call(d3.axisLeft(yScatter));

    // Add dots
    svgScatter.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScatter(d.area))
        .attr("cy", d => yScatter(d.price))
        .attr("r", 5)
        .style("fill", "#69b3a2")
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Area: ${d.area}<br>Price: ${d.price}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", d => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Define the annotation
    const annotations = [
        {
            note: {
                label: "There are a lot of houses listed at 6000 square feet",
                title: "High Concentration"
            },
            x: xScatter(6000),
            y: yScatter(10000000),
            dy: -30,
            dx: -50
        }
    ];

    // Add the annotation to the chart
    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);

    svgScatter.append("g")
        .call(makeAnnotations);

    // Aggregate data for bar charts
    const bedroomsData = d3.rollup(data, v => d3.mean(v, d => d.price), d => d.bedrooms);
    const storiesData = d3.rollup(data, v => d3.mean(v, d => d.price), d => d.stories);

    const bedroomsArray = Array.from(bedroomsData, ([bedrooms, price]) => ({ bedrooms, price })).sort((a, b) => a.bedrooms - b.bedrooms);
    const storiesArray = Array.from(storiesData, ([stories, price]) => ({ stories, price })).sort((a, b) => a.stories - b.stories);

    // Create bedrooms bar chart
    const xBedrooms = d3.scaleBand()
        .domain(bedroomsArray.map(d => d.bedrooms))
        .range([0, width])
        .padding(0.1);
    svgBedrooms.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xBedrooms).tickFormat(d3.format("d")));

    const yBedrooms = d3.scaleLinear()
        .domain([0, d3.max(bedroomsArray, d => d.price)])
        .range([height, 0]);
    svgBedrooms.append("g")
        .call(d3.axisLeft(yBedrooms));

    svgBedrooms.selectAll("rect")
        .data(bedroomsArray)
        .enter()
        .append("rect")
        .attr("x", d => xBedrooms(d.bedrooms))
        .attr("y", d => yBedrooms(d.price))
        .attr("width", xBedrooms.bandwidth())
        .attr("height", d => height - yBedrooms(d.price))
        .attr("fill", "#69b3a2");

    // Create stories bar chart
    const xStories = d3.scaleBand()
        .domain(storiesArray.map(d => d.stories))
        .range([0, width])
        .padding(0.1);
    svgStories.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xStories).tickFormat(d3.format("d")));

    const yStories = d3.scaleLinear()
        .domain([0, d3.max(storiesArray, d => d.price)])
        .range([height, 0]);
    svgStories.append("g")
        .call(d3.axisLeft(yStories));

    svgStories.selectAll("rect")
        .data(storiesArray)
        .enter()
        .append("rect")
        .attr("x", d => xStories(d.stories))
        .attr("y", d => yStories(d.price))
        .attr("width", xStories.bandwidth())
        .attr("height", d => height - yStories(d.price))
        .attr("fill", "#69b3a2");

}).catch(error => {
    console.error('Error loading or parsing data.');
});

// Handle chart navigation
const charts = ["#scatterplot", "#bedrooms-bar-chart", "#stories-bar-chart"];
const titles = ["#scatterplot-title", "#bedrooms-bar-chart-title", "#stories-bar-chart-title"];
let currentChartIndex = 0;

function showChart(index) {
    d3.selectAll("#charts-container > div").classed("hidden", true);
    d3.selectAll("#titles-container > div").classed("hidden", true);
    d3.select(charts[index]).classed("hidden", false);
    d3.select(titles[index]).classed("hidden", false);
}

document.getElementById("nextBtn").addEventListener("click", () => {
    currentChartIndex = (currentChartIndex + 1) % charts.length;
    showChart(currentChartIndex);
});

document.getElementById("prevBtn").addEventListener("click", () => {
    currentChartIndex = (currentChartIndex - 1 + charts.length) % charts.length;
    showChart(currentChartIndex);
});

// Initially show the first chart
showChart(currentChartIndex);
