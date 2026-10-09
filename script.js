let chart;

function updateGraph() {
    const u = parseFloat(document.getElementById('u').value);
    const a = parseFloat(document.getElementById('a').value);
    const tUser = parseFloat(document.getElementById('t').value);
    const intervals = parseInt(document.getElementById('samples').value);

    // คำนวณเลขโชว์ใหญ่ๆ ด้านบน
    const sUser = (u * tUser) + (0.5 * a * tUser * tUser);
    document.getElementById('disp-value').innerText = sUser.toFixed(2);

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

    // ธีมสีกราฟ
    const lineColor = '#a855f7'; // สีม่วง
    const pointColor = '#6366f1'; // สีฟ้าคราม
    const targetPointColor = '#ec4899'; // สีชมพูแดง (จุดเป้าหมาย)

    if (chart) {
        chart.data.datasets[0].data = data;
        chart.data.datasets[0].pointBackgroundColor = data.map((p, i) => i === userTargetIndex ? targetPointColor : pointColor);
        chart.data.datasets[0].pointBorderColor = data.map((p, i) => i === userTargetIndex ? targetPointColor : pointColor);
        chart.data.datasets[0].pointRadius = data.map((p, i) => {
            if (i === userTargetIndex) return intervals === 100 ? 6 : 8;
            return intervals === 100 ? 3 : 5;
        });
        chart.options.scales.x.max = tMax; 
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Displacement (s = ut + ½at²)',
                    data: data,
                    backgroundColor: pointColor,
                    borderColor: lineColor,
                    borderWidth: 3,
                    showLine: true,
                    fill: {
                        target: 'origin',
                        above: 'rgba(168, 85, 247, 0.1)' // แรเงาใต้กราฟ
                    },
                    pointRadius: data.map((p, i) => {
                        if (i === userTargetIndex) return intervals === 100 ? 6 : 8;
                        return intervals === 100 ? 3 : 5;
                    }),
                    pointBackgroundColor: data.map((p, i) => i === userTargetIndex ? targetPointColor : pointColor),
                    pointBorderColor: data.map((p, i) => i === userTargetIndex ? targetPointColor : pointColor)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { font: { family: "'Poppins', sans-serif", size: 13 } } }
                },
                scales: {
                    x: { 
                        type: 'linear', position: 'bottom', 
                        title: { display: true, text: 'Time (s)', font: { family: "'Poppins', sans-serif", weight: 600 } }, 
                        min: 0, max: tMax,
                        grid: { color: '#f3f4f6' }
                    },
                    y: { 
                        title: { display: true, text: 'Displacement (m)', font: { family: "'Poppins', sans-serif", weight: 600 } }, 
                        min: 0,
                        grid: { color: '#f3f4f6' }
                    }
                }
            }
        });
    }
}

// อัปเดตกราฟเวลากดปุ่ม Calculate
document.getElementById('inputForm').addEventListener('submit', function(event) {
    event.preventDefault();
    updateGraph();
});

// คำสั่งนี้ทำให้กราฟโหลดโชว์ขึ้นมาทันทีที่เปิดเว็บ โดยไม่ต้องรอให้กดปุ่ม
window.addEventListener('load', function() {
    updateGraph();
});
