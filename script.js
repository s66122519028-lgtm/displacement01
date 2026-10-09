let chart;

document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const u = parseFloat(document.getElementById('u').value);
    const a = parseFloat(document.getElementById('a').value);
    const tUser = parseFloat(document.getElementById('t').value);
    const intervals = parseInt(document.getElementById('samples').value);

    const sUser = (u * tUser) + (0.5 * a * tUser * tUser);
    document.getElementById('disp').value = sUser.toFixed(2);

    const tMax = tUser * 2;
    const dt = tMax / intervals;
    const data = [];
    const userTargetIndex = Math.round(tUser / dt);

    for (let i = 0; i <= intervals; i++) {
        const time = dt * i;
        const s = u * time + 0.5 * a * time * time;
        data.push({ x: time, y: s });
    }

    const ctx = document.getElementById('myChart').getContext('2d');

    if (chart) {
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].pointBackgroundColor = data.map((point, index) => index === userTargetIndex ? 'red' : 'rgba(75, 192, 192, 1)');
        chart.data.datasets[0].pointBorderColor = data.map((point, index) => index === userTargetIndex ? 'red' : 'rgba(75, 192, 192, 1)');
        chart.data.datasets[0].pointRadius = data.map((point, index) => {
            if (index === userTargetIndex) return intervals === 100 ? 5 : 6;
            return intervals === 100 ? 3 : 5;
        });
        chart.options.scales.x.max = tMax; 
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 's = ut + (1/2)at^2',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    showLine: true,
                    fill: false,
                    pointRadius: data.map((point, index) => {
                        if (index === userTargetIndex) return intervals === 100 ? 5 : 6;
                        return intervals === 100 ? 3 : 5;
                    }),
                    pointBackgroundColor: data.map((point, index) => index === userTargetIndex ? 'red' : 'rgba(75, 192, 192, 1)'),
                    pointBorderColor: data.map((point, index) => index === userTargetIndex ? 'red' : 'rgba(75, 192, 192, 1)')
                }]
            },
            options: {
                scales: {
                    x: { type: 'linear', position: 'bottom', title: { display: true, text: 'Time (t)' }, min: 0, max: tMax },
                    y: { title: { display: true, text: 'Displacement (s)' }, min: 0 }
                }
            }
        });
    }
});

document.getElementById('inputForm').dispatchEvent(new Event('submit'));
