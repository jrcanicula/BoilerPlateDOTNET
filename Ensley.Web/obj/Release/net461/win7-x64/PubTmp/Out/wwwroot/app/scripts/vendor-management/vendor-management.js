var VendorManagementNS = {};
VendorManagementNS.VendorID = "";
VendorManagementNS.Mode = 0;
VendorManagementNS.GeneralInformationIsModified = false;
VendorManagementNS.ContactInformationIsModified = false;
VendorManagementNS.AlertsIsModified = false;
VendorManagementNS.DeletedContacts = [];

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

VendorManagementNS.resetCollapse = function () {
  $('#collapseOne').removeClass('in');
  $('#collapseTwo').removeClass('in');
  $('#collapseThree').removeClass('in');
  $('#collapseFour').removeClass('in');
  $('#headingOne').trigger('click');
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
  $("#form-vendor").kendoValidator().data("kendoValidator").validate();
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

          $('#primaryContactEmails').val(data.alert.primaryContactEmails);
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

  var validator = $("#form-vendor").kendoValidator().data("kendoValidator");

  $("#collapseOne :input").change(function () {
    if (VendorManagementNS.Mode == 1) {
      VendorManagementNS.GeneralInformationIsModified = true;
    }
  });

  $("#collapseTwo :input").change(function () {
    if (VendorManagementNS.Mode == 1) {
      VendorManagementNS.ContactInformationIsModified = true;
    }
  });

  $("#vendor-user-grid").change(function () {
    if (VendorManagementNS.Mode == 1) {
      VendorManagementNS.ContactInformationIsModified = true;
    }
  });

  $("#collapseThree :input").change(function () {
    if (VendorManagementNS.Mode == 1) {
      VendorManagementNS.AlertsIsModified = true;
    }
  });

  $("#primaryContactEmails").change(function (e) {
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

    $("#form-vendor").kendoValidator().data("kendoValidator").validate();

    $("#history-collpase").hide();
    VendorManagementNS.Mode = 0;
    VendorManagementNS.clearContactFields();

    $("#form-vendor").kendoValidator().data("kendoValidator").validate();

    $("#vendor-user-grid").data('kendoGrid').dataSource.data([]);

    $('#isNewlyAddedProduct').attr('disabled', true);
    $('#isNewlyAddedContact').attr('disabled', true);
    $('#isPrimaryContactChange').attr('disabled', true);

    VendorManagementNS.DeletedContacts = [];

    VendorManagementNS.resetCollapse();

  });

  $("form#form-vendor").submit(function (e) {
    e.preventDefault();

    VendorManagementNS.clearContactFields();

    var displayedData = $("#vendor-user-grid").data().kendoGrid.dataSource.view();

    if (validator.validate() && displayedData.length >= 1) {
      VendorManagementNS.save();
    } else if (displayedData.length < 1) {
      toastr.error('Contact is Required');
    }
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

  $("#history-collpase").on("show.bs.collapse", function (e) {
    VendorManagementNS.getHistory();
  });

  $("#contact-collpase").on("show.bs.collapse", function (e) {
    VendorManagementNS.showContactInfo();
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
    if (email && validateEmail(email)) {
      $('#emailValidator').hide();
    }
    if (!country) {
      $('#countryValidator').show();
    }
    if (country) {
      $('#countryValidator').hide();
    }

    if (firstName && lastName && validateEmail(email) && country) {
      var dataSource = $("#vendor-user-grid").data().kendoGrid.dataSource;
      var isEmailDuplicate = false;

      for (var i = 0; i < dataSource._view.length; i++) {
        if (dataSource._view[i].email.toLowerCase() == email.toLowerCase()) {
          isEmailDuplicate = true;
        }
      }

      if (!isEmailDuplicate) {
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
      } else {
        toastr.error('Email already exists.');
      }
    }
  });

  $("#vendorModal").on('hidden.bs.modal', function () {
    $("form#form-vendor").trigger("reset");
    $("#history-collpase").hide();
    $("#vendorModalLabel").text('Add Vendor');
    VendorManagementNS.Mode = 0;
    $("#form-vendor").kendoValidator().data("kendoValidator").validate();
  });


  $("#headingOne").click(function () {
    setTimeout(function () {
      if (!$("#general-name").offset().top < 1) {
        $("#general-name").focus();
        $('#vendorModal').animate({
          scrollTop: $("#general-name").offset().top
        }, {
            duration: 500,
            specialEasing: {
              width: "linear",
              height: "easeOutBounce"
            }
          });
      }
    }, 500);
  });

  $("#headingTwo").click(function () {
    setTimeout(function () {

      if (!$("#contactFirstName").offset().top < 1) {
        $("#contactFirstName").focus();
        $('#vendorModal').animate({
          scrollTop: $("#contactFirstName").offset().top
        }, {
            duration: 500,
            specialEasing: {
              width: "linear",
              height: "easeOutBounce"
            }
          });
      }
    }, 500);
  });

  $("#headingThree").click(function () {
    setTimeout(function () {
      if (!$("#primaryContactEmails").offset().top < 1) {
        $("#primaryContactEmails").focus();
        $('#vendorModal').animate({
          scrollTop: $("#primaryContactEmails").offset().top
        }, {
            duration: 500,
            specialEasing: {
              width: "linear",
              height: "easeOutBounce"
            }
          })
      }
    }, 500);
  });

  $("#headingFour").click(function () {
    setTimeout(function () {
      if ($('#vendor-history-view')) {
        if (!$("#vendor-history-view").offset().top < 1) {
          $("#saveVendor").focus();
          $('#vendorModal').animate({
            scrollTop: $("#saveVendor").offset().top
          }, {
              duration: 2000,
              specialEasing: {
                width: "linear",
                height: "easeOutBounce"
              }
            });
        }
      }
    }, 1000)
  });

}

VendorManagementNS.showAddVendor = function () {
  VendorManagementNS.Mode = 0;
}

VendorManagementNS.showEditVendor = function (e) {
  VendorManagementNS.VendorID = e;
  VendorManagementNS.Mode = 1;
  VendorManagementNS.initializeModalControls(VendorManagementNS.VendorID);
  VendorManagementNS.GeneralInformationIsModified = false;
  VendorManagementNS.ContactInformationIsModified = false;
  VendorManagementNS.AlertsIsModified = false;
  var validator = $("#form-vendor").kendoValidator().data("kendoValidator");
  validator.hideMessages();
  $("#history-collpase").show();
  $("#vendorModalLabel").text('Edit Vendor');

  if ($("#vendor-history-grid").data('kendoGrid')) {
    $("#vendor-history-grid").data('kendoGrid').dataSource.data([]);
  }

  VendorManagementNS.DeletedContacts = [];

  $('#vendorModal').modal('show');
  VendorManagementNS.resetCollapse();
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

VendorManagementNS.save = function () {

  var contactInformation = [];

  var contactCount = $("#contact-list").children().length;

  var displayedData = $("#vendor-user-grid").data().kendoGrid.dataSource.view();

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
  }



  var model = {};
  model.GeneralInformation = {};
  model.GeneralInformation.Name = $('#general-name').val();
  model.GeneralInformation.Address = $('#general-address').val();
  model.GeneralInformation.Email = $('#general-email').val();
  model.GeneralInformation.IsActive = TryParseInt($('input[name=general-status]:checked').val(), 0);
  model.GeneralInformation.Description = $('#general-description').val();
  model.GeneralInformation.ContactNo = $('#general-contact').val();
  model.ContactInformation = contactInformation;

  model.Alert = {};
  model.Alert.IsPrimaryContactChange = $('#isPrimaryContactChange').is(':checked') ? 1 : 0;;
  model.Alert.PrimaryContactEmails = $('#primaryContactEmails').val();
  model.Alert.IsNewlyAddedContact = $('#isNewlyAddedContact').is(':checked') ? 1 : 0;
  model.Alert.NewlyAddedContactsEmails = $('#newlyAddedContactsEmails').val();
  model.Alert.IsNewlyAddedProducts = $('#isNewlyAddedProduct').is(':checked') ? 1 : 0;
  model.Alert.NewlyAddedProductsEmails = $('#newlyAddedProductsEmails').val();

  if (VendorManagementNS.Mode == 0) {
    model.VendorId = "00000000-0000-0000-0000-000000000000";
    model.IsGeneralInformationChanged = true;
    model.IsContactInformationChanged = true;
    model.IsAlertChanged = true;
    VendorManagementNS.createVendor(model);
  } else {
    model.IsGeneralInformationChanged = VendorManagementNS.GeneralInformationIsModified;
    model.IsContactInformationChanged = VendorManagementNS.ContactInformationIsModified;
    model.IsAlertChanged = VendorManagementNS.AlertsIsModified;
    model.DeletedContacts = VendorManagementNS.DeletedContacts;
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
        $("#vendor-user-grid").data('kendoGrid').dataSource.data([]);
        $("#contractGrid").data("kendoGrid").dataSource.read();
        toastr.success('Vendor successfully added');
        $('#vendorModal').modal('hide');
        VendorManagementNS.Mode = 0;

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
        $("#vendor-user-grid").data('kendoGrid').dataSource.data([]);
        $("#contractGrid").data("kendoGrid").dataSource.read();
        toastr.success('Vendor successfully updated');
        $('#vendorModal').modal('hide');
        VendorManagementNS.Mode = 0;
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
      $("#vendor-history-content").empty();
      $("#vendor-history-content").html(result);
    });
}

