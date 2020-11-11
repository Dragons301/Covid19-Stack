/* eslint-disable no-undef */
'use strict';

$('#select').on('change', () => {
  let i = $('#select').val();
  if (i === '1') {
    $('.a').show();
    $('.b').hide();
    $('#canvas-container').hide();

  }
  else if (i === '2') {
    $('.a').hide();
    $('.b').show();
    $('#show').hide();
  }
});

let elemnts = $('#array').val();
elemnts = elemnts.split(',');
let listConfirm = [];
elemnts.forEach(item => {
  listConfirm.push(parseInt(item));

});

let elemnts2 = $('#array2').val();
elemnts2 = elemnts2.split(',');
let listDate = [];
elemnts2.forEach(item => {
  listDate.push(item);
});

var ctx = document.getElementById('myChart').getContext('2d');
// eslint-disable-next-line no-unused-vars
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: listDate,
    datasets: [{
      label: '# of Confirm cases ',
      data: listConfirm,
      backgroundColor: [
        ' #5df3e485'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

chartMake();

