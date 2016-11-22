function submit(){
  //get user data from input fields
  var title = $('#newtitle').val();
  var description = $('#newdescription').val();

  //$.post(url, data, callback)
  $.post('/insert', {title: title, description: description}, function(){
    location.reload(true);  //reload the page from server (not cache)
  });
}

function deleteitem(id){
  //$.post(url, data, callback)
  $.post('/delete', {id: id}, function(){
    location.reload(true);
  });
}

function update(id, done){
  //disable checkboxes
  var checkboxes = $('input[type=checkbox]');
  for (var i=0; i<checkboxes.length; i++){
    checkboxes[i].setAttribute("disabled", "disabled");
  }
  
  //$.post(url, data, callback)
  $.post('/update', {id: id, done: !done}, function(){
    location.reload(true);
  });
}
