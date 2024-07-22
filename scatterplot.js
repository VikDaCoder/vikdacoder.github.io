// Set the dimensions and margins of the graphs
const margin = { top: 20, right: 30, bottom: 40, left: 70 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Create a tooltip div that is hidden by default
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

let entire_data = [];

function makeChartArea(data) {
    const svgScatter = d3.select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // X axis
    const xScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.area)])
        .range([0, width]);
    svgScatter.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScatter));

    // Y axis
    const yScatter = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price)])
        .range([height, 0]);
    svgScatter.append("g")
        .call(d3.axisLeft(yScatter));

    svgScatter.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScatter(d.area))
        .attr("cy", d => yScatter(d.price))
        .attr("r", 5)
        .style("fill", "#2CA268")
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

    // Annotations
    const scatterAnnotations = [
        {
            note: {
                label: "There are a lot of houses listed at 6000 square feet",
                title: "High Concentration"
            },
            x: xScatter(6000),
            y: yScatter(10000000),
            dy: -30,
            dx: -50
        }, {
            note: {
                label: "The price of houses increases as area does",
                title: "Positive correlation"
            },
            x: xScatter(8000),
            y: yScatter(7000000),
            dy: -50,
            dx: 100
        }
    ];

    const makeScatterAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(scatterAnnotations);

    svgScatter.append("g")
        .call(makeScatterAnnotations);
}

function makeChartBedrooms(data) {
    const svgBedrooms = d3.select("#bedrooms-bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const bedroomsData = d3.rollup(data, v => ({
        avgPrice: d3.mean(v, d => d.price),
        count: v.length
    }), d => d.bedrooms);

    const bedroomsArray = Array.from(bedroomsData, ([bedrooms, values]) => ({
        bedrooms,
        avgPrice: values.avgPrice,
        count: values.count
    })).sort((a, b) => a.bedrooms - b.bedrooms);

    const xBedrooms = d3.scaleBand()
        .domain(bedroomsArray.map(d => d.bedrooms))
        .range([0, width])
        .padding(0.1);
    svgBedrooms.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xBedrooms).tickFormat(d3.format("d")));

    const yBedrooms = d3.scaleLinear()
        .domain([0, d3.max(bedroomsArray, d => d.avgPrice)])
        .range([height, 0]);
    svgBedrooms.append("g")
        .call(d3.axisLeft(yBedrooms));

    svgBedrooms.selectAll("rect")
        .data(bedroomsArray)
        .enter()
        .append("rect")
        .attr("x", d => xBedrooms(d.bedrooms))
        .attr("y", d => yBedrooms(d.avgPrice))
        .attr("width", xBedrooms.bandwidth())
        .attr("height", d => height - yBedrooms(d.avgPrice))
        .attr("fill", "#2CA268")
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Avg Price: ${d.avgPrice}<br>Count: ${d.count}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", d => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Annotations
    const bedroomsAnnotations = [
        {
            note: {
                label: "The price increases with bedrooms until 5",
                title: "Positive correlation"
            },
            x: xBedrooms(2),
            y: yBedrooms(4300000),
            dy: -50,
            dx: -30
        },
        {
            note: {
                label: "Likely attributed to small sample size (count: 2)",
                title: "Small Drop"
            },
            x: xBedrooms(6),
            y: yBedrooms(4850000),
            dy: -30,
            dx: 50
        }
    ];

    const makeBedroomsAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(bedroomsAnnotations);

    svgBedrooms.append("g")
        .call(makeBedroomsAnnotations);
}

function makeChartStories(data) {
    const svgStories = d3.select("#stories-bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const storiesData = d3.rollup(data, v => ({
        avgPrice: d3.mean(v, d => d.price),
        count: v.length
    }), d => d.stories);

    const storiesArray = Array.from(storiesData, ([stories, values]) => ({
        stories,
        avgPrice: values.avgPrice,
        count: values.count
    })).sort((a, b) => a.stories - b.stories);

    const xStories = d3.scaleBand()
        .domain(storiesArray.map(d => d.stories))
        .range([0, width])
        .padding(0.1);
    svgStories.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xStories).tickFormat(d3.format("d")));

    const yStories = d3.scaleLinear()
        .domain([0, d3.max(storiesArray, d => d.avgPrice)])
        .range([height, 0]);
    svgStories.append("g")
        .call(d3.axisLeft(yStories));

    svgStories.selectAll("rect")
        .data(storiesArray)
        .enter()
        .append("rect")
        .attr("x", d => xStories(d.stories))
        .attr("y", d => yStories(d.avgPrice))
        .attr("width", xStories.bandwidth())
        .attr("height", d => height - yStories(d.avgPrice))
        .attr("fill", "#2CA268")
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Avg Price: ${d.avgPrice}<br>Count: ${d.count}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", d => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Annotation
    const storiesAnnotations = [
        {
            note: {
                label: "The housing price increases with the number of stories",
                title: "Positive correlation"
            },
            x: xStories(4),
            y: yStories(7200000),
            dy: 40,
            dx: -70
        }
    ];

    const makeStoriesAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(storiesAnnotations);

    svgStories.append("g")
        .call(makeStoriesAnnotations);
}

// Load data
d3.csv("Housing.csv").then(data => {

    // Parse the data
    data.forEach(d => {
        d.price = +d.price;
        d.area = +d.area;
        d.bedrooms = +d.bedrooms;
        d.stories = +d.stories;
    });

    entire_data = data;

    showChart(0);
}).catch(error => {
    console.log("There was an issue reading the data or generating the charts");
    console.error(error);
});

// Handle naviation logic
const charts = ["#scatterplot", "#bedrooms-bar-chart", "#stories-bar-chart"];
const titles = ["#intro-title", "#scatterplot-title", "#bedrooms-bar-chart-title", "#stories-bar-chart-title", "#interactive-title"];
let currentChartIndex = 0;

function showChart(index) {
    // Clear the charts
    d3.select("#scatterplot").html("");
    d3.select("#bedrooms-bar-chart").html("");
    d3.select("#stories-bar-chart").html("");

    // Set the title
    d3.selectAll("#titles-container > div").classed("hidden", true);
    d3.select(titles[index]).classed("hidden", false);


    // Set the chart
    if (index == 1) {
        // Create a scatterplot
        makeChartArea(entire_data);
    } else if (index == 2) {
        // Create bar bedroom chart
        makeChartBedrooms(entire_data);
    } else if (index == 3) {
        // Create bar stories chart
        makeChartStories(entire_data);
    } else if (index == 4) {
        makeChartArea(entire_data);
    }

    // Disable buttons at start and end
    document.getElementById("prevBtn").disabled = index === 0;
    document.getElementById("nextBtn").disabled = index === titles.length - 1;
}

function updateFinalSlide() {
    d3.select("#scatterplot").html("");
    d3.select("#bedrooms-bar-chart").html("");
    d3.select("#stories-bar-chart").html("");

    chartIndex = document.getElementById("chart-select").value;
    mainFilter = document.getElementById("mainroad-select").value;
    basementFilter = document.getElementById("basement-select").value;

    filtered_data = [];

    entire_data.forEach((d) => {
        mainroadFlag = mainFilter == 0 || d["mainroad"] == mainFilter;
        basementFlag = basementFilter == 0 || d["basement"] == basementFilter;
        if (mainroadFlag && basementFlag) {
            filtered_data.push(d);
        }
    });

    if (chartIndex == 1) {
        makeChartArea(filtered_data);
    } else if (chartIndex == 2) {
        makeChartBedrooms(filtered_data);
    } else if (chartIndex == 3) {
        makeChartStories(filtered_data);
    }
}

document.getElementById("nextBtn").addEventListener("click", () => {
    currentChartIndex = (currentChartIndex + 1) % titles.length;
    showChart(currentChartIndex);
});

document.getElementById("prevBtn").addEventListener("click", () => {
    currentChartIndex = (currentChartIndex - 1 + titles.length) % titles.length;
    showChart(currentChartIndex);
});

document.getElementById("chart-select").addEventListener("change", function() {
    updateFinalSlide();
});

document.getElementById("mainroad-select").addEventListener("change", function() {
    updateFinalSlide();
});

document.getElementById("basement-select").addEventListener("change", function() {
    updateFinalSlide();
});

