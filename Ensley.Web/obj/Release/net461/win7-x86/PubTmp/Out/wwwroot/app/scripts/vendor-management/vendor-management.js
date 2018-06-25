var VendorManagementNS = {};
VendorManagementNS.VendorID = "";
VendorManagementNS.Mode = 0;
VendorManagementNS.GeneralInformationIsModified = false;
VendorManagementNS.ContactInformationIsModified = false;
VendorManagementNS.AlertsIsModified = false;
VendorManagementNS.DeletedContacts = [];
VendorManagementNS.EmailPattern = null;

VendorManagementNS.clearContactFields = function () {
  $('#contactFirstName').val(null);
  $('#contactLastName').val(null);
  $('#contactEmail').val(null);
  $('#contactAddress').val(null);
  $('#contactPhone').val(null);
  $('#contactPosition').val(null);
  var country = $("#contactCountry").data("kendoComboBox");
  country.value("");
}

VendorManagementNS.initializeAddMenu = function () {
  $('#vendor-contact-menu').addClass('disabled');
  $('#vendor-alert-menu').addClass('disabled');
  $('#vendor-history-menu').addClass('disabled');
  $("#vendor-contact-tab").attr("href", "");
  $("#vendor-history-tab").attr("href", "");
  $("#vendor-alert-tab").attr("href", "");
  $("#vendor-general-info-tab").trigger('click');
  $("#vendor-history-menu").hide();
  $("#vendor-status-block").hide();
}

VendorManagementNS.initializeEditMenu = function () {
  $('#vendor-contact-menu').removeClass('disabled');
  $('#vendor-alert-menu').removeClass('disabled');
  $('#vendor-history-menu').removeClass('disabled');

  $("#vendor-contact-tab").attr("href", "#vendor-contact-content");
  $("#vendor-alert-tab").attr("href", "#vendor-alert-content");
  $("#vendor-history-tab").attr("href", "#vendor-history-content");

  $("#vendor-general-info-tab").trigger('click');
  $("#vendor-history-menu").show();
}

VendorManagementNS.ReadImage = function (input) {
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

VendorManagementNS.SelectItem = function (e) {
  var dataItem = this.dataItem(e.item.index());
  $('#contactEmail').html(dataItem.email);
  $('#contactAddress').html(dataItem.address);
  $('#contactCountry').html(dataItem.country);
  $('#contactPhone').html(dataItem.contactNo);
  $('#contactId').html(dataItem.userInfoId);
}

VendorManagementNS.init = function () {
  $("#form-general-info").kendoValidator().data("kendoValidator").validate();
  VendorManagementNS.registerEvents();
}

VendorManagementNS.getVendorById = function (id) {
  $.ajax({
    url: 'api/vendor/' + id,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data) {
        $('#general-name').val(data.generalInformation.name)
        $('#general-address').val(data.generalInformation.address);
        $('#general-email').val(data.generalInformation.email);
        $("input[name=general-status][value=" + data.generalInformation.isActive + "]").prop('checked', true)
        $('#general-description').val(data.generalInformation.description);
        $('#general-contact').val(data.generalInformation.contactNo);
        $("#img-profile").attr('src', data.generalInformation.imageURL);

        if (data.generalInformation.email) {
          VendorManagementNS.EmailPattern = data.generalInformation.email.split('@')[1];
        }

        if (data.alert) {
          if (data.alert.isPrimaryContactChange == 1) {
            document.getElementById("isPrimaryContactChange").checked = true;
          } else {
            document.getElementById("isPrimaryContactChange").checked = false;
          }

          if (data.alert.isNewlyAddedContact == 1) {
            document.getElementById("isNewlyAddedContact").checked = true;
          } else {
            document.getElementById("isNewlyAddedContact").checked = false;
          }

          if (data.alert.isNewlyAddedProducts == 1) {
            document.getElementById("isNewlyAddedProduct").checked = true;
          } else {
            document.getElementById("isNewlyAddedProduct").checked = false;
          }

          $('#primaryContactChangeEmails').val(data.alert.primaryContactEmails);
          $('#newlyAddedContactsEmails').val(data.alert.newlyAddedContactsEmails);
          $('#newlyAddedProductsEmails').val(data.alert.newlyAddedProductsEmails);

          if (!data.alert.primaryContactEmails) {
            $('#isPrimaryContactChange').attr('disabled', true);
          } else {
            $('#isPrimaryContactChange').attr('disabled', false);
          }

          if (!data.alert.newlyAddedContactsEmails) {
            $('#isNewlyAddedContact').attr('disabled', true);
          } else {
            $('#isNewlyAddedContact').attr('disabled', false);
          }
          if (!data.alert.newlyAddedProductsEmails) {
            $('#isNewlyAddedProduct').attr('disabled', true);
          } else {
            $('#isNewlyAddedProduct').attr('disabled', false);
          }

          VendorManagementNS.populateContactGrid(data.contactInformation);

          VendorManagementNS.Mode = 1;
        }
      } else {
        toastr.error('Something went wrong with the request!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}
  
VendorManagementNS.populateContactGrid = function (data) {
  $("#vendor-user-grid").data('kendoGrid').dataSource.data([]);

  var dataSource = new kendo.data.DataSource({
    data: data
  });

  var grid = $("#vendor-user-grid").data("kendoGrid");
  grid.setDataSource(dataSource);
}

VendorManagementNS.initializeModalControls = function (id) {
  VendorManagementNS.getVendorById(id);
}

VendorManagementNS.registerEvents = function () {
  $("#contactCountry").kendoComboBox({
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

  $('#img-profile').change(function () {
    VendorManagementNS.ReadImage(this);
  });

  var generalInfoValidator = $("#form-general-info").kendoValidator().data("kendoValidator");

  $("#vendor-general-info-content :input").change(function () {
    if (VendorManagementNS.Mode == 1) {
      VendorManagementNS.GeneralInformationIsModified = true;
    }
  });

  $("#vendor-alert-content :input").change(function () {
    if (VendorManagementNS.Mode == 1) {
      VendorManagementNS.AlertsIsModified = true;
    }
  });

  $("#vendor-user-grid").change(function () {
    if (VendorManagementNS.Mode == 1) {
      VendorManagementNS.ContactInformationIsModified = true;
    }
  });

  $("#primaryContactChangeEmails").change(function (e) {
    if ($(this).val()) {
      $('#isPrimaryContactChange').prop('disabled', false);
    } else {
      $('#isPrimaryContactChange').prop('checked', false);
      $('#isPrimaryContactChange').attr('disabled', true);
    }
  });

  $("#newlyAddedContactsEmails").change(function (e) {
    if ($(this).val()) {
      $('#isNewlyAddedContact').prop('disabled', false);
    } else {
      $('#isNewlyAddedContact').prop('checked', false);
      $('#isNewlyAddedContact').attr('disabled', true);
    }
  });

  $("#newlyAddedProductsEmails").change(function (e) {
    if ($(this).val()) {
      $('#isNewlyAddedProduct').prop('disabled', false);
    } else {
      $('#isNewlyAddedProduct').prop('checked', false);
      $('#isNewlyAddedProduct').attr('disabled', true);
    }
  });

  $("#addVendor").click(function () {

    $("form#form-general-info").kendoValidator().data("kendoValidator").validate();
    VendorManagementNS.VendorID = "";

    VendorManagementNS.Mode = 0;
    VendorManagementNS.clearContactFields();

    $("form#form-general-info").kendoValidator().data("kendoValidator").validate();

    $("#vendor-user-grid").data('kendoGrid').dataSource.data([]);

    $('#isNewlyAddedProduct').attr('disabled', true);
    $('#isNewlyAddedContact').attr('disabled', true);
    $('#isPrimaryContactChange').attr('disabled', true);

    VendorManagementNS.DeletedContacts = [];
    VendorManagementNS.EmailPattern = null;
    VendorManagementNS.initializeAddMenu();
  });

  $("form#form-general-info").submit(function (e) {

    e.preventDefault();
    if (generalInfoValidator.validate()) {
      VendorManagementNS.saveVendorGeneralInformation();
    }
  });


  $("form#form-vendor-alert").submit(function (e) {
    e.preventDefault();
    var isValid = true;

    if ($('#primaryContactChangeEmails').val()) {
      var emails = $('#primaryContactChangeEmails').val();
      if (emails.length > 1) {
        var lastChar = emails.substr(emails.length - 1);
        if (lastChar == ';') {
          emails = emails.slice(0, -1);
          $('#primaryContactChangeEmails').val(emails);
        }
      }
      var splittedEmails = [];
      var primaryContactChangeEmails = [];
      splittedEmails = emails.split(';');
      $('#primaryContactChangeEmailsValidator').hide();
      splittedEmails.forEach(function (element) {
        if (!(validateEmail(element) && element.split('@')[1].toLowerCase() == VendorManagementNS.EmailPattern.toLowerCase())) {
          isValid = false;
          $('#primaryContactChangeEmailsValidator').show();
          return;
        } else {
          if (primaryContactChangeEmails.indexOf(element.toLowerCase()) < 0) {
            primaryContactChangeEmails.push(element.toLowerCase());
          } else {
            $('#primaryContactChangeEmailsValidator').show();
            isValid = false;
            return;
          }
        }
      });
    }

    if ($('#newlyAddedContactsEmails').val()) {
      var emails = $('#newlyAddedContactsEmails').val();
      if (emails.length > 1) {
        var lastChar = emails.substr(emails.length - 1);
        if (lastChar == ';') {
          emails = emails.slice(0, -1);
          $('#newlyAddedContactsEmails').val(emails);
        }
      }
      var splittedEmails = [];
      var newlyAddedContactEmails = [];
      splittedEmails = emails.split(';');
      $('#newlyAddedContactsEmailsValidator').hide();
      splittedEmails.forEach(function (element) {
        if (!(validateEmail(element) && element.split('@')[1].toLowerCase() == VendorManagementNS.EmailPattern.toLowerCase())) {
          isValid = false;
          $('#newlyAddedContactsEmailsValidator').show();
          return;
        } else {
          if (newlyAddedContactEmails.indexOf(element.toLowerCase()) < 0) {
            newlyAddedContactEmails.push(element.toLowerCase());
          } else {
            $('#newlyAddedContactsEmailsValidator').show();
            isValid = false;
            return;
          }
        }
      });
    }

    if ($('#newlyAddedProductsEmails').val()) {
      var emails = $('#newlyAddedProductsEmails').val();
      if (emails.length > 1) {
        var lastChar = emails.substr(emails.length - 1);
        if (lastChar == ';') {
          emails = emails.slice(0, -1);
          $('#newlyAddedProductsEmails').val(emails);
        }
      }
      var splittedEmails = [];
      var newlyAddedProductEmails = [];
      splittedEmails = emails.split(';');
      $('#newlyAddedProductsEmailsValidator').hide();
      splittedEmails.forEach(function (element) {
        if (!(validateEmail(element) && element.split('@')[1].toLowerCase() == VendorManagementNS.EmailPattern.toLowerCase())) {
          isValid = false;
          $('#newlyAddedProductsEmailsValidator').show();
          return;
        } else {
          if (newlyAddedProductEmails.indexOf(element.toLowerCase()) < 0) {
            newlyAddedProductEmails.push(element.toLowerCase());
          } else {
            $('#newlyAddedProductsEmailsValidator').show();
            isValid = false;
            return;
          }
        }
      });
    }

    if (isValid) {
      VendorManagementNS.saveVendorAlerts();
    }
  });

  $("#update-vendor-contact").click(function (e) {
    VendorManagementNS.saveVendorContacts();
  });


  $("#vendor-user-grid").kendoGrid({
    dataSource: [],
    dataBound: function databound(e) {

      $('a.k-button.k-button-icontext.k-grid-delete').html('<span class="fas fa-trash-alt"> </span>');
      $('a.k-button.k-button-icontext.k-grid-delete').css('color : black');

      $('.is-primary-contact').click(function (e) {
        var guid = $(this).attr('item-guid');
        $('.is-primary-contact').each(function (a) {
          $(this).attr('data-value', 2);
          var items = $("#vendor-user-grid").data().kendoGrid.dataSource.view();
          for (var counter = 0; counter < items.length; counter++) {
            if (items[counter].uid.toLowerCase() != guid.toLowerCase()) {
              items[counter].set("type", 2);
            } else {
              items[counter].set("type", 1);
            }
          }
        });
        $(this).attr('data-value', 1);
      });
    },
    selectable: true,
    pageable: true,
    columns: [
      {
        field: "userInfoId", title: "UserInfoId", hidden: true
      },
      {
        field: "firstName",
        title: "First Name",
        width: "150px"
      },
      {
        field: "lastName", title: "Last Name",
        width: "150px"
      },
      {
        field: "email", title: "Email",
        width: "150px"
      },
      {
        field: "position", title: "Position",
        width: "150px"
      },
      {
        field: "country", title: "Country",
        width: "150px",
        hidden: true
      },
      {
        field: "address", title: "Country",
        width: "100px",
        hidden: true
      },
      {
        field: "contactNo",
        title: "Contact No.",
        width: "100px"
      },
      {
        field: "type",
        title: "Primary",
        width: "100px",
        template: '<p class="text-center is-primary-contact"  style="cursor: pointer" item-guid="#:uid#" data-value="#:type#"><span><i class="#: type  == 1 ? "fa fa-check" : "fa fa-times" #"></i></span></p>', //when click change all other to false including in the dataset
      },
      {
        field: "destroy",
        title: " ",
        width: "60px",
        template: "<center> <span class='fas fa-trash' style='text-align: center; cursor:pointer' onclick=\"VendorManagementNS.deleteUserContactRow('#= uid #')\" > </span> </center>"
      }
    ],
    editable: "inline",
    noRecords: {
      template: "No data available."
    },
    pageable: false,
  });

  $("#vendor-history-menu").click(function (e) {
    if (!$("#vendor-history-menu").hasClass("disabled")) {
      VendorManagementNS.getHistory();
    }
  });

  $("#add-user-to-list").click(function (e) {
    e.preventDefault();
    var firstName = $('#contactFirstName').val();
    var lastName = $('#contactLastName').val();
    var email = $('#contactEmail').val();
    var address = $('#contactAddress').val();
    var country = $('#contactCountry').val();
    var phone = $('#contactPhone').val();
    var position = $('#contactPosition').val();

    if (!firstName) {
      $('#firstNameValidator').show();
    }
    if (firstName) {
      $('#firstNameValidator').hide();
    }
    if (!lastName) {
      $('#lastNameValidator').show();
    }
    if (lastName) {
      $('#lastNameValidator').hide();
    }
    if (!email || !validateEmail(email)) {
      $('#emailValidator').show();
    }
    if (validateEmail(email) && !(email.split('@')[1] == VendorManagementNS.EmailPattern.toLowerCase())) {
      $('#emailValidator').show();
    }
    if (email && validateEmail(email) && email.split('@')[1].toLowerCase() == VendorManagementNS.EmailPattern.toLowerCase()) {
      $('#emailValidator').hide();
    }
    if (!country) {
      $('#countryValidator').show();
    }
    if (country) {
      $('#countryValidator').hide();
    }

    if (firstName && lastName && validateEmail(email) && country && email.split('@')[1] == VendorManagementNS.EmailPattern.toLowerCase()) {
      var dataSource = $("#vendor-user-grid").data().kendoGrid.dataSource;
      var isEmailDuplicate = false;

      for (var i = 0; i < dataSource._view.length; i++) {
        if (dataSource._view[i].email.toLowerCase() == email.toLowerCase()) {
          isEmailDuplicate = true;
        }
      }

      if (!isEmailDuplicate && email.split('@')[1].toLowerCase() == VendorManagementNS.EmailPattern.toLowerCase()) {
        dataSource.add({
          userInfoId: null,
          firstName: firstName,
          lastName: lastName,
          email: email,
          address: address,
          country: country,
          contactNo: phone,
          position: position,
          type: dataSource._view.length < 1 ? 1 : 2
        });
        VendorManagementNS.clearContactFields();
      } else if (!(email.split('@')[1].toLowerCase() == VendorManagementNS.EmailPattern.toLowerCase())) {
        toastr.error("Email should follow the company email's domain.");
      }
      else {
        toastr.error('Email already exists.');
      }
    }
  });

  $("#vendorModal").on('hidden.bs.modal', function () {
    $("form#form-general-info").trigger("reset");
    $("#vendorModalLabel").text('Add Vendor');
    VendorManagementNS.Mode = 0;
    $("#form-general-info").kendoValidator().data("kendoValidator").validate();
    VendorManagementNS.GeneralInformationIsModified = false;
    VendorManagementNS.ContactInformationIsModified = false;
    VendorManagementNS.AlertsIsModified = false;
    $("#img-profile").attr('src', '');
  });
}

VendorManagementNS.showAddVendor = function () {
  VendorManagementNS.Mode = 0;
}

VendorManagementNS.showEditVendor = function (e) {
  VendorManagementNS.VendorID = e;
  VendorManagementNS.Mode = 1;
  $("#vendor-status-block").show();
  VendorManagementNS.initializeModalControls(VendorManagementNS.VendorID);
  VendorManagementNS.GeneralInformationIsModified = false;
  VendorManagementNS.ContactInformationIsModified = false;
  VendorManagementNS.AlertsIsModified = false;

  var generalInfoValidator = $("#form-general-info").kendoValidator().data("kendoValidator");
  generalInfoValidator.hideMessages();
  $("#vendorModalLabel").text('Edit Vendor');

  if ($("#vendor-history-grid").data('kendoGrid')) {
    $("#vendor-history-grid").data('kendoGrid').dataSource.data([]);
  }

  VendorManagementNS.DeletedContacts = [];
  $('#vendorModal').modal('show');
  VendorManagementNS.initializeEditMenu();
}

VendorManagementNS.deleteUserContactRow = function (id) {
  if (confirm("Are you sure you want to delete this item?")) {
    var items = $("#vendor-user-grid").data().kendoGrid.dataSource.view();
    for (var counter = 0; counter < items.length; counter++) {
      if (items[counter].uid.toLowerCase() == id.toLowerCase()) {
        if (items[counter].type != 1) {
          var grid = $("#vendor-user-grid").data("kendoGrid");
          var dataItem = grid.dataSource.getByUid(id.toLowerCase());
          grid.dataSource.remove(dataItem);
          if (items[counter].userInfoId != null) {
            VendorManagementNS.DeletedContacts.push({ UserInfoId: items[counter].userInfoId });
          }
        }
        else {
          toastr.error('Primary contact could not be deleted.');
        }
      }
    }
  }
}

VendorManagementNS.saveVendorGeneralInformation = function () {
  var model = {};
  model.GeneralInformation = {};
  model.GeneralInformation.ImageURL = $("#img-profile").attr('src');
  model.GeneralInformation.Name = $('#general-name').val();
  model.GeneralInformation.Address = $('#general-address').val();
  model.GeneralInformation.Email = $('#general-email').val();
  model.GeneralInformation.IsActive = TryParseInt($('input[name=general-status]:checked').val(), 0);
  model.GeneralInformation.Description = $('#general-description').val();
  model.GeneralInformation.ContactNo = $('#general-contact').val();

  if (VendorManagementNS.Mode == 0) {
    model.VendorId = "00000000-0000-0000-0000-000000000000";
    model.GeneralInformation.IsActive = 1;
    VendorManagementNS.createVendor(model);
  }
  else {
    model.GeneralInformation.IsActive = TryParseInt($('input[name=general-status]:checked').val(), 0);
    model.VendorId = VendorManagementNS.VendorID;
    VendorManagementNS.updateVendor(model);
  }
}

VendorManagementNS.createVendor = function (model) { 
  $.ajax({
    url: 'api/vendor/',
    type: 'POST',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (!data.error) {
        $("#contractGrid").data("kendoGrid").dataSource.read();
        toastr.success('Vendor successfully added');
        VendorManagementNS.Mode = 1;
        VendorManagementNS.DeletedContacts = [];
        VendorManagementNS.initializeEditMenu();
        $("#vendorModalLabel").text('Edit Vendor');
        VendorManagementNS.VendorID = data;
        VendorManagementNS.getVendorById(VendorManagementNS.VendorID);
        VendorManagementNS.EmailPattern = model.GeneralInformation.Email.split('@')[1];
        if ($("#vendor-history-grid").data('kendoGrid')) {
          $("#vendor-history-grid").data('kendoGrid').dataSource.data([]);
        }
      } else {
        toastr.error(data.error);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

VendorManagementNS.updateVendor = function (model) {
  $.ajax({
    url: 'api/vendor/' + VendorManagementNS.VendorID,
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (!data.error) {
        $("#contractGrid").data("kendoGrid").dataSource.read();
        toastr.success('Vendor successfully updated');
        VendorManagementNS.Mode = 1;
        VendorManagementNS.DeletedContacts = [];
        VendorManagementNS.initializeEditMenu();
        VendorManagementNS.getVendorById(VendorManagementNS.VendorID);
        VendorManagementNS.EmailPattern = model.GeneralInformation.Email.split('@')[1];
        if ($("#vendor-history-grid").data('kendoGrid')) {
          $("#vendor-history-grid").data('kendoGrid').dataSource.data([]);
        }
      } else {
        toastr.error(data.error);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}
VendorManagementNS.saveVendorContacts = function () {
  VendorManagementNS.clearContactFields();
  var displayedData = $("#vendor-user-grid").data().kendoGrid.dataSource.view();
  var contactInformation = [];
  var contactPrimary = 0;
  for (var counter = 0; counter < displayedData.length; counter++) {
    var contactItem = {};
    contactItem.Address = displayedData[counter].address;
    contactItem.FirstName = displayedData[counter].firstName;
    contactItem.LastName = displayedData[counter].lastName;
    contactItem.Email = displayedData[counter].email;
    contactItem.ContactNo = displayedData[counter].contactNo;
    contactItem.Position = displayedData[counter].position;
    contactItem.UserInfoId = displayedData[counter].userInfoId == null ? "00000000-0000-0000-0000-000000000000" : displayedData[counter].userInfoId;
    contactItem.Country = displayedData[counter].country;
    contactItem.Type = displayedData[counter].type;
    contactInformation.push(contactItem);
    if (displayedData[counter].type == 1) {
      contactPrimary++;
    }
  }
  if (contactPrimary == 0) {
    toastr.error('Primary contact is required');
    return;
  } else {
    var model = {};
    model.DeletedContacts = VendorManagementNS.DeletedContacts;
    model.ContactInformation = contactInformation;
    model.VendorId = VendorManagementNS.VendorID;
    VendorManagementNS.updateContacts(model);
  }
}

VendorManagementNS.updateContacts = function (model) {

  $.ajax({
    url: 'api/vendor/' + VendorManagementNS.VendorID + '/contacts',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (!data.error) {
        $("#contractGrid").data("kendoGrid").dataSource.read();
        model.DeletedContacts = [];
        VendorManagementNS.getVendorById(VendorManagementNS.VendorID);
        toastr.success('Vendor contacts successfully updated');
      } else {
        toastr.error(data.error);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

VendorManagementNS.saveVendorAlerts = function () {
  var model = {};
  model.Alert = {};
  model.Alert.IsPrimaryContactChange = $('#isPrimaryContactChange').is(':checked') ? 1 : 0;;
  model.Alert.PrimaryContactEmails = $('#primaryContactChangeEmails').val();
  model.Alert.IsNewlyAddedContact = $('#isNewlyAddedContact').is(':checked') ? 1 : 0;
  model.Alert.NewlyAddedContactsEmails = $('#newlyAddedContactsEmails').val();
  model.Alert.IsNewlyAddedProducts = $('#isNewlyAddedProduct').is(':checked') ? 1 : 0;
  model.Alert.NewlyAddedProductsEmails = $('#newlyAddedProductsEmails').val();
  model.VendorId = VendorManagementNS.VendorID;
  VendorManagementNS.updateVendorAlerts(model);
}

VendorManagementNS.updateVendorAlerts = function (model) {
  $.ajax({
    url: 'api/vendor/' + VendorManagementNS.VendorID + '/alerts',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (!data.error) {
        VendorManagementNS.getVendorById(VendorManagementNS.VendorID);
        toastr.success('Vendor alerts successfully updated');
      } else {
        toastr.error(data.error);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

VendorManagementNS.getHistory = function () {

  $.ajax({ url: '/history/vendor?vendorId=' + VendorManagementNS.VendorID })
    .done(function (result) {
      $("#vendor-history-content-pane").empty();
      $("#vendor-history-content-pane").html(result);
    });
}

