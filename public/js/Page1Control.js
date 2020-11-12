'use strict';


let maskClicklEl = $('.how-ul li')[0];
let cleanClickkEl = $('.how-ul li')[1];
let sneezClicklEl = $('.how-ul li')[2];
let socialDistance = $('.how-ul li')[3];
let vid2 = $('.how-ul li')[4];
let vid3 = $('.how-ul li')[5];

$(socialDistance).on('click', () => {
  $('#defult').hide();
  $('#img-hand').hide();
  $('#img-cough').hide();
  $('#img-mask').hide();
  $('video').slideDown();
});
$(maskClicklEl).on('click', () => {
  console.log(maskClicklEl);
  $('video').get(0).pause();
  $('video').get(0).currentTime = 0;
  $('video').get(1).pause();
  $('video').get(1).currentTime = 0;
  $('video').get(2).pause();
  $('video').get(2).currentTime = 0;
  $('.img-select,#defult').hide();
  $('#img-mask').slideDown();
});

$(cleanClickkEl).on('click', () => {
  console.log(cleanClickkEl);
  $('video').get(0).pause();
  $('video').get(0).currentTime = 0;
  $('video').get(1).pause();
  $('video').get(1).currentTime = 0;
  $('video').get(2).pause();
  $('video').get(2).currentTime = 0;
  $('.img-select,#defult').hide();
  $('#img-hand').slideDown();
});

$(sneezClicklEl).on('click', () => {
  console.log(sneezClicklEl);
  $('video').get(0).pause();
  $('video').get(0).currentTime = 0;
  $('video').get(1).pause();
  $('video').get(1).currentTime = 0;
  $('video').get(2).pause();
  $('video').get(2).currentTime = 0;
  $('.img-select,#defult').hide();
  $('#img-cough').slideDown();
});

$(socialDistance).on('click', () => {
  console.log(socialDistance);
  $('video').get(0).pause();
  $('video').get(0).currentTime = 0;
  $('video').get(1).pause();
  $('video').get(1).currentTime = 0;
  $('video').get(2).pause();
  $('video').get(2).currentTime = 0;
  $('.img-select,#defult').hide();
  $('#vid1').slideDown();
});

$(vid2).on('click', () => {
  console.log(socialDistance);
  $('video').get(0).pause();
  $('video').get(0).currentTime = 0;
  $('video').get(1).pause();
  $('video').get(1).currentTime = 0;
  $('video').get(2).pause();
  $('video').get(2).currentTime = 0;
  $('.img-select,#defult').hide();
  $('#vid2').slideDown();
});

$(vid3).on('click', () => {
  console.log(socialDistance);
  $('video').get(0).pause();
  $('video').get(0).currentTime = 0;
  $('video').get(1).pause();
  $('video').get(1).currentTime = 0;
  $('video').get(2).pause();
  $('video').get(2).currentTime = 0;
  $('.img-select,#defult').hide();
  $('#vid3').slideDown();
});
