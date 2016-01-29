(function () {

  var counter = 0
  function poll () {
    $.getJSON('/poll/'+counter, (response) => {
      counter = response.count
      var elem = $('#output')
      elem.text(elem.text() + response.append)
      poll()
    })
  }

  poll()






})()
