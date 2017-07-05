//Send AJAX message when button is pressed
$('#button').on('click', function (e) {
  var email = $('#email').val();
  var password = $('#pwd').val();
  var username = $('#username').val();
  var bday = $('#bday').val();
  var hobbies = $('#hobbies').val()
  var bio = $('#bio').val();
  var e = true;
  var p = true;
  var u = true;
  var b = true;

  //Regular expressions patterns
  var email_pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
	var pwd_pattern = /^[0-9a-zA-Z]{8,}$/;
  var bday_pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;


  if(!email_pattern.test(email)){ e=false;$("#p_email").removeClass("has-success").addClass("has-error");}
  if(!pwd_pattern.test(password)){p=false;$("#p_pwd").removeClass("has-success").addClass("has-error");}
  if(username.length==0){u=false;$("#p_username").removeClass("has-success").addClass("has-error");}
  if(!bday_pattern.test(bday)){b=false; $("#p_bday").removeClass("has-success").addClass("has-error");}

  if(e && p && u && b){
    $.ajax({
      method: "POST",
      url: "./dbapi/",
      contentType: "application/json",
      data: JSON.stringify({
        email: email,
        password: password,
        username: username,
        birthday: bday,
        hobbies: hobbies,
        biography: bio
      })
    }).done(function(response){
        // Attend the response
        alert(response.msg);
        if(response.result=="ok"){
          window.location.href = "./dbapi/users/";
        }else{
          $("#p_email").removeClass("has-success").addClass("has-error");
        }
    });
  }
});

$('#email').keydown(function(e){
  var email_pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  var email = $('#email').val();
  if(!email_pattern.test(email)){
    $("#p_email").removeClass("has-success").addClass("has-error");
  }
  else{
    $("#p_email").removeClass("has-error")}
});

$('#pwd').keydown(function(e){
  var pwd_pattern = /^[0-9a-zA-Z]{8,}$/;
  var password = $('#pwd').val();
  if(pwd_pattern.test(password)){
    $("#p_pwd").removeClass("has-error").addClass("has-success");}
  else{
    $("#p_pwd").removeClass("has-success").addClass("has-error");}
});

$('#username').keydown(function(e){ $("#p_username").removeClass("has-error");});

$('#bday').keydown(function(e){ $("#p_bday").removeClass("has-error");});
