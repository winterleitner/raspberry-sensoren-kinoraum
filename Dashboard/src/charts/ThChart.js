import React from "react"
import { Line } from 'react-chartjs-2';

var hour_logged = -1

const Chart = props => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { // hum
                type: 'linear',
                display: true,
                position: 'right',
                text: 'Relative Humidity in %',
                min: 45,
                max: 75
            },
            y1: { // temp
                type: 'linear',
                display: true,
                position: 'left',
                text: 'Temperature in Celcius',

                // grid line settings
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
                min: 0,
                max: 30
            },
            x: {
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    autoSkip: false,
                    minRotation: 90,
                    maxRotation: 90,
                    callback: function(val, index) {
                        var hour = parseInt(this.getLabelForValue(val).split(' ')[1].split(':')[0])
                        if (hour !== hour_logged) {
                            hour_logged = hour
                            var label = this.getLabelForValue(val)
                            console.log(label, index)

                            return `${label.split(':')[0]}:00`
                        } else return ''
                    }
                }
            }
        },
    };
    const dtOpt = {month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'};

    const data = {
        labels: props.data.map(t => t.zeit.toLocaleTimeString("de-DE", dtOpt)),
        datasets: [
            {
                label: "Temperature",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(59, 89, 152, 0.75)",
                borderColor: "rgba(59, 89, 152, 1)",
                pointHoverBackgroundColor: "rgba(59, 89, 152, 1)",
                pointHoverBorderColor: "rgba(59, 89, 152, 1)",
                data: props.data.map(t => t.temperatur),
                yAxisID: 'y1'
            },
            {
                label: "Humidity",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(29, 202, 255, 0.75)",
                borderColor: "rgba(29, 202, 255, 1)",
                pointHoverBackgroundColor: "rgba(29, 202, 255, 1)",
                pointHoverBorderColor: "rgba(29, 202, 255, 1)",
                data: props.data.map(t => t.luftfeuchtigkeit),
                yAxisID: 'y',
            }
        ]
    };

    return <div className="chart-wrapper"><Line data={data} options={options} /></div>


}

export const ThChart = React.memo(Chart);