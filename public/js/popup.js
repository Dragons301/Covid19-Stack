'use strict';

$('a').on('click', (event) => {
  let href = $(`#${event.target.id}`).attr('name');
  // let id2 = $('iframe').attr(id)
  $('#url').attr('src', href);
  $('#popUp').show();
});
$('#cancelIcon').on('click', () => {
  $('#popUp').hide();
});
