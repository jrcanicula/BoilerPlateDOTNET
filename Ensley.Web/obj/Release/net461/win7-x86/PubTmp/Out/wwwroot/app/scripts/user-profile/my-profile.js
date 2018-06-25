var MyProfile = {};

MyProfile.UserInfoId = null;
MyProfile.Password = null;

MyProfile.init = function (id) {
  MyProfile.UserInfoId = id;
  MyProfile.hookup(id);
  $("h3#page-title").text("My Profile");
  $("#user-profile-edit-country").kendoComboBox({
    dataTextField: "text",
    dataValueField: "value",
    change: function (e) {
      var widget = e.sender;
      if (widget.value() && widget.select() === -1) {
        widget.value("");
      }
    },
    dataSource: countryList,
    suggest: true
  });
}

MyProfile.hookup = function (id) {
  $.ajax({
    url: 'api/userinfo/profile/' + id,
    type: 'GET',
    cache: false,
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      $("#user-profile-fullname").html(data.firstName + ' ' + data.lastName);
      $("#user-profile-email").html(data.email);
      $("#user-profile-edit-firstname").val(data.firstName);
      $("#user-profile-edit-lastname").val(data.lastName);
      $("#user-profile-edit-address").val(data.address);
      $("#user-profile-edit-contactno").val(data.contactNo);
      $("#user-profile-edit-email").val(data.email);
      var country = $("#user-profile-edit-country").data("kendoComboBox");
      country.value(data.country);
      $("#user-profile-edit-position").val(data.position);
      $("#user-profile-edit-password").val(data.password);
      MyProfile.Password = data.password;
      $("#user-profile-edit-password-confirm").val(data.password);
      $("#user-profile-company").html(data.company != null ? data.company : "Not available");
      $("#img-profile").attr('src', data.imageURL);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });

  $('#img-profile').change(function () {
    MyProfile.ReadImage(this);
  });

  $("#edit-user-profile").click(function (e) {
    var model = {};
    model.Address = $("#user-profile-edit-address").val();
    model.ContactNo = $("#user-profile-edit-contactno").val();
    model.ImageUrl = $("#img-profile").attr('src');
    model.Position = $("#user-profile-edit-position").val();
    model.Country = $("#user-profile-edit-country").val();
    model.UserInfoId = MyProfile.UserInfoId;
    MyProfile.updateProfile(model);
  });

  var updatePasswordValidator = $("#form-update-password").kendoValidator().data("kendoValidator"),
    status = $(".status");

  $("form#form-update-password").submit(function (e) {
    e.preventDefault();

    if (updatePasswordValidator.validate()) {
      var model = {};
      model.Password = $("#user-profile-edit-password").val();
      model.UserInfoId = MyProfile.UserInfoId;

      MyProfile.updatePassword(model);
    }
  });
}


MyProfile.updateProfile = function (model) {
  $.ajax({
    type: 'PUT',
    url: 'api/userInfo/updateProfile/' + MyProfile.UserInfoId,
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (result) {
      toastr.success('Profile updated');
      $("#display-picture").attr('src', model.ImageUrl);
    },
    error: function (thrownError) {
      toastr.error('Unable to save user profile.');
    }
  });
};

MyProfile.ReadImage = function (input) {
  var fileTypes = ['jpg', 'jpeg', 'png'];
  if (input.files && input.files[0]) {
    var extension = input.files[0].name.split('.').pop().toLowerCase(),
      isSuccess = fileTypes.indexOf(extension) > -1;
    if (isSuccess) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#img-profile").attr('src', e.target.result);
        var result = e.target.result;
        imageURL = result.replace(" ", "+");
      }
      reader.readAsDataURL(input.files[0]);
    }
    else {
      toastr.error('Supported filetypes are only jpg, jpeg and png. Please upload files with these types only');
      document.getElementById("picture-file").value = "";
    }
  }
}

MyProfile.updatePassword = function (model) {
  if ($("#user-profile-edit-password").val() == $("#user-profile-edit-password-confirm").val()) {
    if ($("#user-profile-edit-password").val() == MyProfile.Password) {
      toastr.error('You did not change anything.');
    } else {
      $.ajax({
        type: 'PUT',
        url: 'api/userInfo/updatePassword/' + MyProfile.UserInfoId,
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
          toastr.success('Password successfully updated');
        },
        error: function (thrownError) {
          toastr.error('Unable to save password.');
        }
      });
    }
  } else {
    toastr.error('Password does not match');
  }
}