$(document).ready(function () {
    $.ajax({
        url: "http://192.168.4.65/data.php",
        type: "GET",
        success: function (data) {
            var data_json = JSON.parse(data)

            var timestamp = [];
            var temp = [];
            var hum = [];

            for (var i in data_json) {
                console.log(i)
                timestamp.push(data_json[i].zeit);
                temp.push(data_json[i].temperatur);
                hum.push(data_json[i].luftfeuchtigkeit);
            }

            var chartdata = {
                labels: timestamp,
                datasets: [
                    {
                        label: "Temperature",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(59, 89, 152, 0.75)",
                        borderColor: "rgba(59, 89, 152, 1)",
                        pointHoverBackgroundColor: "rgba(59, 89, 152, 1)",
                        pointHoverBorderColor: "rgba(59, 89, 152, 1)",
                        data: temp
                    },
                    {
                        label: "Humidity",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(29, 202, 255, 0.75)",
                        borderColor: "rgba(29, 202, 255, 1)",
                        pointHoverBackgroundColor: "rgba(29, 202, 255, 1)",
                        pointHoverBorderColor: "rgba(29, 202, 255, 1)",
                        data: hum
                    }
                ]
            };

            var ctx = $("#mycanvas");

            var LineGraph = new Chart(ctx, {
                type: 'line',
                data: chartdata
            });
        },
        error: function (data) {

        }
    });
});