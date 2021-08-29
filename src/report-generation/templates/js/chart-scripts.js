
var chartLeftCanvas = document.getElementById('chart-left').getContext("2d");
console.log(chartLeftCanvas);
var barCognitive = new Chart(chartLeftCanvas, {
    type: 'scatter',
    data: {
        label: 'Linear Correlation',
        datasets: [{
            label: '# of Votes',
            data: [{
                x: -10,
                y: 0
            }, {
                x: 0,
                y: 10
            }, {
                x: 10,
                y: 5
            }, {
                x: 0.5,
                y: 5.5
            }],
            backgroundColor: 'rgb(255, 99, 132)'
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom'
            }
        }
    }
});
