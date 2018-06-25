var ContractGeneralInformationNS = {};
ContractGeneralInformationNS.VendorId = null;
ContractGeneralInformationNS.ContractId = null;
ContractGeneralInformationNS.Mode = 0;
ContractGeneralInformationNS.DeletedPermissions = [];
ContractGeneralInformationNS.EmailPattern = "";
ContractGeneralInformationNS.OwnerId = null;
ContractGeneralInformationNS.IsValid = false;

ContractGeneralInformationNS.InitializeControl = function (id, contractId) {
  ContractGeneralInformationNS.Mode = 0;
  ContractGeneralInformationNS.ContractId = contractId;
  ContractGeneralInformationNS.VendorId = id;
  ContractGeneralInformationNS.EmailPattern = "";
  ContractGeneralInformationNS.OwnerId = null;
  ContractGeneralInformationNS.LoadControls(id, contractId);

  if (!contractId) {
    ContractGeneralInformationNS.Mode = 0;
    ContractGeneralInformationNS.initializeAddMenu();
    ContractGeneralInformationNS.getVendorNameByVendorId(id);
    ContractGeneralInformationNS.DeletedPermissions = [];
  } else {
    ContractGeneralInformationNS.Mode = 1;
    ContractGeneralInformationNS.DeletedPermissions = [];
    ContractGeneralInformationNS.initializeEditMenu();
    ContractGeneralInformationNS.getVendorNameByVendorId(id);
    ContractGeneralInformationNS.getGeneralInformation(id, contractId);
  }
};

ContractGeneralInformationNS.getGeneralInformation = function (id, contractId) {
  ContractGeneralInformationNS.getContractByContractId(contractId);
  ContractGeneralInformationNS.getUnmappedUsersByContractId(contractId);
  ContractGeneralInformationNS.getMappedUsers();
}

ContractGeneralInformationNS.getUnmappedUsersByContractId = function (contractId) {
  $.ajax({
    url: 'api/contract/' + contractId + '/unmapped',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      var comboBox = $("#contract-permission-users").kendoComboBox({
        dataTextField: "fullName",
        dataValueField: "userInfoId",
        change: function (e) {
          var widget = e.sender;
          if (widget.value() && widget.select() === -1) {
            widget.value("");
          }
        },
        dataSource: data,
        suggest: true,
        select: function (e) {
          if (e.item) {
            var dataItem = this.dataItem(e.item.index());
            comboBox.data("kendoComboBox").dataSource.remove(dataItem);
            var ds = $("#contact-permission-grid").data().kendoGrid.dataSource;
            ds.add({
              userInfoId: dataItem.userInfoId,
              fullName: dataItem.fullName,
              canRead: 1,
              canWrite: 2,
              canSign: 2,
              contractPermissionId: null
            });
          }
        }
      });
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request');
    }
  });
}

ContractGeneralInformationNS.getContractByContractId = function (contractId) {
  $.ajax({
    url: 'api/contract/' + ContractGeneralInformationNS.ContractId,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {

      if (data) {
        $('#contractPermissionTitle').val(data.details.title);
        var startDate = kendo.toString(kendo.parseDate(data.details.startDate), 'MM/dd/yyyy');
        $("#contractDetailsStartDate").data("kendoDatePicker").value(startDate);
        var endDate = kendo.toString(kendo.parseDate(data.details.endDate), 'MM/dd/yyyy');
        $("#contractDetailsEndDate").data("kendoDatePicker").value(endDate);
        $('#contractDetailsDescription').val(data.details.description);
        var country = $("#contractDetailsCountry").data("kendoComboBox");
        country.value(data.details.country);
        $("#contractVendorEntity").val(data.details.vendorEntity);

        var todaysDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
        var start = $("#contractDetailsStartDate").kendoDatePicker({}).data("kendoDatePicker");
        var end = $("#contractDetailsEndDate").kendoDatePicker({}).data("kendoDatePicker")
        start.min(new Date(todaysDate) > new Date(data.details.startDate) ? new Date(data.details.startDate) : new Date(todaysDate));
        end.min(new Date(todaysDate) > new Date(data.details.startDate) ? new Date(data.details.startDate) : new Date(todaysDate));

        if (!data.isOwned) {
          $("#save-vendor-general-info").css({ "display": "none" });
          $('#contractPermissionTitle').attr('disabled', true);
          $("#contractDetailsStartDate").attr('disabled', true);
          $("#contractDetailsEndDate").attr('disabled', true);
          $('#contractDetailsEndDate').data('kendoDatePicker').enable(false);
          $('#contractDetailsStartDate').data('kendoDatePicker').enable(false);
          $('#contractDetailsDescription').attr('disabled', true);
          $("#contractDetailsCountry").attr('disabled', true);
          $("#contractDetailsCountry").data("kendoComboBox").enable(false);
          $("#contractVendorEntity").attr('disabled', true);
          $("#btnDeleteContract").hide();
          $("#btnCancelContract").hide();
        } else {
          $("#btnDeleteContract").show();
        }

        if (data.alerts) {
          if (data.alerts.isContractAlertBeforeDaysExpired == 1) {
            document.getElementById("isContractAlertBeforeDaysExpired").checked = true;
          } else {
            document.getElementById("isContractAlertBeforeDaysExpired").checked = false;
          }

          if (data.alerts.isContractAlertWhenExpired == 1) {
            document.getElementById("isContractAlertWhenExpired").checked = true;
          } else {
            document.getElementById("isContractAlertWhenExpired").checked = false;
          }

          if (data.alerts.isAlertWhenNewContactAreIncluded == 1) {
            document.getElementById("isAlertWhenNewContactAreIncluded").checked = true;
          } else {
            document.getElementById("isAlertWhenNewContactAreIncluded").checked = false;
          }

          $('#contractAlertBeforeDaysExpiredEmails').val(data.alerts.contractAlertBeforeDaysExpiredEmails);
          $('#contractAlertBeforeDaysExpiredDays').val(data.alerts.contractAlertBeforeDaysExpiredDays);
          $('#contractAlertWhenExpiredEmails').val(data.alerts.contractAlertWhenExpiredEmails);
          $('#alertWhenNewContactAreIncludedEmails').val(data.alerts.alertWhenNewContactAreIncludedEmails);

          if (!data.alerts.contractAlertBeforeDaysExpiredEmails) {
            $('#isContractAlertBeforeDaysExpired').attr('disabled', true);
          } else {
            $('#isContractAlertBeforeDaysExpired').attr('disabled', false);
          }

          if (!data.alerts.contractAlertWhenExpiredEmails) {
            $('#isContractAlertWhenExpired').attr('disabled', true);
          } else {
            $('#isContractAlertWhenExpired').attr('disabled', false);
          }

          if (!data.alerts.alertWhenNewContactAreIncludedEmails) {
            $('#isAlertWhenNewContactAreIncluded').attr('disabled', true);
          } else {
            $('#isAlertWhenNewContactAreIncluded').attr('disabled', false);
          }
        }

        ContractGeneralInformationNS.EmailPattern = data.email.split('@')[1];
        if (data.ownerId) {
          ContractGeneralInformationNS.OwnerId = data.ownerId.toString().toLowerCase();
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

ContractGeneralInformationNS.getVendorNameByVendorId = function (vendorId) {
  $.ajax({
    url: 'api/vendor/' + vendorId + '/name',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      $("#contract-details-company").html(data);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

ContractGeneralInformationNS.initializeAddMenu = function () {
  $('#contract-permission-menu').addClass('disabled');
  $('#contract-alert-menu').addClass('disabled');
  $('#contract-history-menu').addClass('disabled');
  $("#contract-alert-tab").attr("href", "");
  $("#contract-history-tab").attr("href", "");
  $("#contract-permission-tab").attr("href", "");
  $("#contract-details-tab").trigger('click');
  $("#contract-history-menu").hide();
}

ContractGeneralInformationNS.initializeEditMenu = function () {
  $('#contract-permission-menu').removeClass('disabled');
  $('#contract-alert-menu').removeClass('disabled');
  $('#contract-history-menu').removeClass('disabled');
  $("#contract-permission-tab").attr("href", "#contract-permission-content");
  $("#contract-alert-tab").attr("href", "#contract-alert-content");
  $("#contract-history-tab").attr("href", "#contract-history-content");
  $("#contract-details-tab").trigger('click');
  $("#contract-history-menu").show();
}

ContractGeneralInformationNS.getMappedUsers = function () {

  $("#contact-permission-grid").data('kendoGrid').dataSource.data([]);

  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: "api/contract/" + ContractGeneralInformationNS.ContractId + "/mapped",
        dataType: "json"
      }
    },
    schema: {
      model: {
        id: "userInfoId",
        fields: {
          userInfoId: { editable: false, type: "guid" },
          canRead: { type: "number" },
          canWrite: { type: "number" },
          canSign: { type: "number" },
          contractPermissionId: { type: "guid" },
          fullName: { type: "string" },
        }
      }
    }
  });

  var grid = $("#contact-permission-grid").data("kendoGrid");
  grid.setDataSource(dataSource);
}

ContractGeneralInformationNS.LoadControls = function (id, contractId) {
  var dataSource = [];
  var formContractDetailsValidator = $("#form-contract-details").kendoValidator().data("kendoValidator");
  dataSource = new kendo.data.DataSource({
    schema: {
      model: {
        id: "userInfoId",
        fields: {
          userInfoId: { editable: false, type: "guid" },
          canRead: { type: "number" },
          canWrite: { type: "number" },
          canSign: { type: "number" },
          contractPermissionId: { type: "guid" },
          fullName: { type: "string" }
        }
      }
    },
  });

  $("#contact-permission-grid").kendoGrid({
    dataSource: dataSource,
    noRecords: true,
    sortable: true,
    filterable: true,
    scrollable: false,
    dataBound: function databound(e) {

      $(".can-write").each(function (c) {
        $(this).unbind("click");
      });
      $(".can-read").each(function (c) {
        $(this).unbind("click");
      });

      $(".can-write").each(function () {
        $(this).on('click', function (e) {
          var guid = $(this).attr('item-guid');
          var items = $("#contact-permission-grid").data().kendoGrid.dataSource.view();
          for (var counter = 0; counter < items.length; counter++) {
            if (items[counter].uid.toLowerCase() == guid.toLowerCase()) {
              if (items[counter].canWrite == 1) {
                items[counter].set("canWrite", 2);
                $(this).attr('data-value', 2);
              } else {
                items[counter].set("canWrite", 1);
                $(this).attr('data-value', 1);
              }
            }
          }
        });
      });

      $(".can-sign").each(function () {
        $(this).on('click', function (e) {
          var guid = $(this).attr('item-guid');
          var items = $("#contact-permission-grid").data().kendoGrid.dataSource.view();
          for (var counter = 0; counter < items.length; counter++) {
            if (items[counter].uid.toLowerCase() == guid.toLowerCase()) {
              if (items[counter].canSign == 1) {
                items[counter].set("canSign", 2);
                $(this).attr('data-value', 2);
              } else {
                items[counter].set("canSign", 1);
                $(this).attr('data-value', 1);
              }
            }
          }
        });
      });
    },
    messages: {
      noRecords: "No Permission Yet"
    },
    editable: "inline",
    columns: [
      {
        field: "contractPermissionId",
        title: "contractPermissionId",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        hidden: true
      },
      {
        field: "fullName",
        title: "Name",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        }
      },
      {
        field: "userInfoId",
        title: "UserInfoId",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        hidden: true
      },
      {
        field: "canRead",
        title: "Can Read?",
        width: 120,
        template: '<span class="text-center can-read"  style="cursor: pointer" item-guid="#:uid#" data-value="#:canRead#"><i class="#: canRead  == 1 ? "fa fa-check green-ico" : "fa fa-times red-ico" #" ></i></span>',
        width: "50px"
      },
      {
        field: "canWrite",
        title: "Can Write?",
        width: 120,
        template: '<span class="text-center can-write" style="cursor: pointer" item-guid="#:uid#" data-value="#:canWrite#"><i class="#: canWrite  == 1 ? "fa fa-check green-ico" : "fa fa-times red-ico" #" ></i></span>',
      },
      {
        field: "canSign",
        title: "Can Sign?",
        width: 120,
        template: '<span class="text-center can-sign" style="cursor: pointer" item-guid="#:uid#" data-value="#:canSign#"><i class="#: canSign  == 1 ? "fa fa-check green-ico" : "fa fa-times red-ico" #"></i></span>',
      },
      {
        field: "destroy",
        title: " ",
        width: "60px",
        template: "<center><span class='fas fa-trash' style='text-align: center; cursor:pointer' onclick=\"ContractGeneralInformationNS.deletePermissionRow('#= uid #')\" > </span> </center>"
      },
    ]
  });



  var todaysDate = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
  var start = $("#contractDetailsStartDate").kendoDatePicker({}).data("kendoDatePicker");
  var end = $("#contractDetailsEndDate").kendoDatePicker({}).data("kendoDatePicker")
  start.min(new Date(todaysDate));
  end.min(new Date(todaysDate));

  $("#contractAlertWhenExpiredEmails").change(function (e) {
    if ($(this).val()) {
      $('#isContractAlertWhenExpired').prop('disabled', false);
    } else {
      $('#isContractAlertWhenExpired').prop('checked', false);
      $('#isContractAlertWhenExpired').attr('disabled', true);
    }
  });

  $("#contractAlertBeforeDaysExpiredEmails").change(function (e) {
    if ($(this).val()) {
      $('#isContractAlertBeforeDaysExpired').prop('disabled', false);
    } else {
      $('#isContractAlertBeforeDaysExpired').prop('checked', false);
      $('#isContractAlertBeforeDaysExpired').attr('disabled', true);
    }
  });

  $("#alertWhenNewContactAreIncludedEmails").change(function (e) {
    if ($(this).val()) {
      $('#isAlertWhenNewContactAreIncluded').prop('disabled', false);
    } else {
      $('#isAlertWhenNewContactAreIncluded').prop('checked', false);
      $('#isAlertWhenNewContactAreIncluded').attr('disabled', true);
    }
  });

  if (ContractGeneralInformationNS.Mode == 1) {
    ContractGeneralInformationNS.getContractByContractId(ContractGeneralInformationNS.ContractId);
  }

  $("form#form-contract-details").submit(function (e) {
    e.preventDefault();
    if (formContractDetailsValidator.validate()) {
      if ($('#contractDetailsStartDate').data("kendoDatePicker").value() >= $('#contractDetailsEndDate').data("kendoDatePicker").value()) {
        toastr.error('Please check the start date and the end date.');
      } else {
        ContractGeneralInformationNS.saveVendorDetails();
      }
    }
  });

  var container = $("#form-contract-details");
  kendo.init(container);
  container.kendoValidator({
    rules: {
      greaterdate: function (input) {
        if (input.is("[data-greaterdate-msg]") && input.val() != "") {
          var date = kendo.parseDate(input.val()),
            otherDate = kendo.parseDate($("[name='" + input.data("greaterdateField") + "']").val());
          return otherDate == null || otherDate.getTime() < date.getTime();
        }
        return true;
      }
    }
  });

  $("#update-contract-permissions").click(function (e) {
    ContractGeneralInformationNS.saveContractPermissions();
  });

  $("#contractDetailsCountry").kendoComboBox({
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

  $("form#form-contract-alert").submit(function (e) {
    e.preventDefault();
    var isValid = true;

    if ($('#contractAlertBeforeDaysExpiredEmails').val()) {
      var emails = $('#contractAlertBeforeDaysExpiredEmails').val();
      if (emails.length > 1) {
        var lastChar = emails.substr(emails.length - 1);
        if (lastChar == ';') {
          emails = emails.slice(0, -1);
          $('#contractAlertBeforeDaysExpiredEmails').val(emails);
        }
      }
      var splittedEmails = [];
      var contractAlertBeforeDaysExpiredEmails = [];
      splittedEmails = emails.split(';');
      $('#contractAlertBeforeDaysExpiredEmailsValidator').hide();
      splittedEmails.forEach(function (element) {
        if (!(validateEmail(element) && element.split('@')[1].toLowerCase() == ContractGeneralInformationNS.EmailPattern.toLowerCase())) {
          isValid = false;
          $('#contractAlertBeforeDaysExpiredEmailsValidator').show();
          return;
        } else {
          if (contractAlertBeforeDaysExpiredEmails.indexOf(element.toLowerCase()) < 0) {
            contractAlertBeforeDaysExpiredEmails.push(element.toLowerCase());
          } else {
            $('#primaryContactChangeEmailsValidator').show();
            isValid = false;
            return;
          }
        }
      });
    }

    if ($('#contractAlertWhenExpiredEmails').val()) {
      var emails = $('#contractAlertWhenExpiredEmails').val();
      if (emails.length > 1) {
        var lastChar = emails.substr(emails.length - 1);
        if (lastChar == ';') {
          emails = emails.slice(0, -1);
          $('#contractAlertWhenExpiredEmails').val(emails);
        }
      }
      var splittedEmails = [];
      var contractAlertWhenExpiredEmails = [];
      splittedEmails = emails.split(';');
      $('#contractAlertWhenExpiredEmailsValidator').hide();
      splittedEmails.forEach(function (element) {
        if (!(validateEmail(element) && element.split('@')[1].toLowerCase() == ContractGeneralInformationNS.EmailPattern.toLowerCase())) {
          isValid = false;
          $('#contractAlertWhenExpiredEmailsValidator').show();
          return;
        } else {
          if (contractAlertWhenExpiredEmails.indexOf(element.toLowerCase()) < 0) {
            contractAlertWhenExpiredEmails.push(element.toLowerCase());
          } else {
            $('#contractAlertWhenExpiredEmailsValidator').show();
            isValid = false;
            return;
          }
        }
      });
    }

    if ($('#alertWhenNewContactAreIncludedEmails').val()) {
      var emails = $('#alertWhenNewContactAreIncludedEmails').val();
      if (emails.length > 1) {
        var lastChar = emails.substr(emails.length - 1);
        if (lastChar == ';') {
          emails = emails.slice(0, -1);
          $('#alertWhenNewContactAreIncludedEmails').val(emails);
        }
      }
      var splittedEmails = [];
      var alertWhenNewContactAreIncludedEmails = [];
      splittedEmails = emails.split(';');
      $('#alertWhenNewContactAreIncludedEmailsValidator').hide();
      splittedEmails.forEach(function (element) {
        if (!(validateEmail(element) && element.split('@')[1].toLowerCase() == ContractGeneralInformationNS.EmailPattern.toLowerCase())) {
          isValid = false;
          $('#alertWhenNewContactAreIncludedEmailsValidator').show();
          return;
        } else {
          if (alertWhenNewContactAreIncludedEmails.indexOf(element.toLowerCase()) < 0) {
            alertWhenNewContactAreIncludedEmails.push(element.toLowerCase());
          } else {
            $('#alertWhenNewContactAreIncludedEmailsValidator').show();
            isValid = false;
            return;
          }
        }
      });
    }

    if (isValid) {
      ContractGeneralInformationNS.saveContractAlerts();
    }
  });

  if (!contractId) {
    $("#contact-permission-grid").data('kendoGrid').dataSource.data([]);
  }

  $("#btnDeleteContract").click(function (e) {
    e.preventDefault();
    ContractGeneralInformationNS.deleteContract(ContractGeneralInformationNS.ContractId);
  });


  $("#btnCancelContract").click(function (e) {
    e.preventDefault();
    ContractGeneralInformationNS.cancelContract(ContractGeneralInformationNS.ContractId);
  });

  $("#contract-history-menu").click(function (e) {
    if (!$("#contract-history-menu").hasClass("disabled")) {
      ContractGeneralInformationNS.getHistory();
    }
  });
};

ContractGeneralInformationNS.saveContractAlerts = function () {
  var model = {};
  model.Alert = {};
  model.Alert.IsContractAlertWhenExpired = $('#isContractAlertWhenExpired').is(':checked') ? 1 : 0;;
  model.Alert.ContractAlertWhenExpiredEmails = $('#contractAlertWhenExpiredEmails').val();
  model.Alert.IsContractAlertBeforeDaysExpired = $('#isContractAlertBeforeDaysExpired').is(':checked') ? 1 : 0;
  model.Alert.ContractAlertBeforeDaysExpiredDays = parseInt($('#contractAlertBeforeDaysExpiredDays').val());
  model.Alert.ContractAlertBeforeDaysExpiredEmails = $('#contractAlertBeforeDaysExpiredEmails').val();
  model.Alert.IsAlertWhenNewContactAreIncluded = $('#isAlertWhenNewContactAreIncluded').is(':checked') ? 1 : 0;
  model.Alert.AlertWhenNewContactAreIncludedEmails = $('#alertWhenNewContactAreIncludedEmails').val();
  model.ContractId = ContractGeneralInformationNS.ContractId;
  ContractGeneralInformationNS.updateContractAlerts(model);
}

ContractGeneralInformationNS.updateContractAlerts = function (model) {
  $.ajax({
    url: 'api/contract/' + ContractGeneralInformationNS.ContractId + '/alerts',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (!data.error) {
        toastr.success('Contract alerts successfully updated');
      } else {
        toastr.error(data.error);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}


ContractGeneralInformationNS.saveVendorDetails = function () {

  var model = {};
  model.DetailInformation = {};
  model.DetailInformation.Title = $('#contractPermissionTitle').val();
  model.DetailInformation.StartDate = $('#contractDetailsStartDate').val();
  model.DetailInformation.EndDate = $('#contractDetailsEndDate').val();
  model.DetailInformation.Description = $('#contractDetailsDescription').val();
  model.DetailInformation.Country = $("#contractDetailsCountry").val();
  model.DetailInformation.VendorEntity = $("#contractVendorEntity").val();
  model.VendorId = ContractGeneralInformationNS.VendorId;

  if (ContractGeneralInformationNS.Mode == 0) {
    model.ContractId = "00000000-0000-0000-0000-000000000000";
    model.DetailInformation.ContractId = "00000000-0000-0000-0000-000000000000";
    ContractGeneralInformationNS.createContractDetails(model);
  }
  else {
    model.ContractId = ContractGeneralInformationNS.ContractId;
    model.DetailInformation.ContractId = ContractGeneralInformationNS.ContractId;
    ContractGeneralInformationNS.updateContractDetails(model);
  }
}

ContractGeneralInformationNS.createContractDetails = function (model) {

  $.ajax({
    url: 'api/contract/',
    type: 'POST',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (!data.error) {
        $("#lblContractNameValue").text(model.DetailInformation.Title);
        $("#contractGrid").data("kendoGrid").dataSource.read();
        toastr.success('Contract successfully added');
        $('#btnDeleteContract').show();
        ContractGeneralInformationNS.Mode = 1;
        ContractGeneralInformationNS.ContractId = data;
        ContractGeneralInformationNS.initializeEditMenu();
        ContractWizardNS.ContractId = data;
        ContractGeneralInformationNS.getGeneralInformation(ContractGeneralInformationNS.VendorId, ContractGeneralInformationNS.ContractId);
      } else {
        toastr.error(data.error);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

ContractGeneralInformationNS.updateContractDetails = function (model) {
  $.ajax({
    url: 'api/contract/' + ContractGeneralInformationNS.ContractId,
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (!data.error) {
        $("#lblContractNameValue").text(model.DetailInformation.Title);
        $("#contractGrid").data("kendoGrid").dataSource.read();
        toastr.success('Contract successfully updated');
      } else {
        toastr.error(data.error);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}


ContractGeneralInformationNS.saveContractPermissions = function (e) {

  var displayedData = $("#contact-permission-grid").data().kendoGrid.dataSource.view();
  var permissionList = [];
  var permission = 0;
  for (var counter = 0; counter < displayedData.length; counter++) {
    var contactItem = {};
    contactItem.UserInfoId = displayedData[counter].userInfoId == null ? "00000000-0000-0000-0000-000000000000" : displayedData[counter].userInfoId;
    contactItem.CanRead = displayedData[counter].canRead;
    contactItem.CanWrite = displayedData[counter].canWrite;
    contactItem.CanSign = displayedData[counter].canSign;
    contactItem.ContractPermissionId = displayedData[counter].contractPermissionId == null ? "00000000-0000-0000-0000-000000000000" : displayedData[counter].contractPermissionId;
    permissionList.push(contactItem);
    permission++;
  }
  if (permission == 0) {
    toastr.error('Permission is required');
    return;
  } else {
    var model = {};
    model.DeletedPermissions = ContractGeneralInformationNS.DeletedPermissions;
    model.Permissions = permissionList;
    model.ContractId = ContractGeneralInformationNS.ContractId;
    ContractGeneralInformationNS.updatePermissions(model);
  }
}

ContractGeneralInformationNS.updatePermissions = function (model) {
  $.ajax({
    url: 'api/contract/' + ContractGeneralInformationNS.ContractId + '/permissions',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (!data.error) {
        $("#contractGrid").data("kendoGrid").dataSource.read();
        ContractGeneralInformationNS.DeletedPermissions = [];
        $("#contact-permission-grid").data("kendoGrid").dataSource.read();
        toastr.success('Contract permissions successfully updated');
      } else {
        toastr.error(data.error);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

ContractGeneralInformationNS.deletePermissionRow = function (id) {
  if (confirm("Are you sure you want to delete this item?")) {
    var items = $("#contact-permission-grid").data().kendoGrid.dataSource.view();
    for (var counter = 0; counter < items.length; counter++) {
      if (items[counter].uid.toLowerCase() == id.toLowerCase()) {
        var grid = $("#contact-permission-grid").data("kendoGrid");
        var widget = $("#contract-permission-users").getKendoComboBox();
        var cbox = widget.dataSource;
        if (items[counter].userInfoId != ContractGeneralInformationNS.OwnerId) {
          cbox.add({ userInfoId: items[counter].userInfoId, fullName: items[counter].fullName });
          var dataItem = grid.dataSource.getByUid(id.toLowerCase());
          grid.dataSource.remove(dataItem);
          if (items[counter].contractPermissionId != null) {
            ContractGeneralInformationNS.DeletedPermissions.push({ UserInfoId: items[counter].userInfoId });
          }
        } else {
          toastr.error('Cannot delete the contract creator in the permission');
        }
      }
    }
  }
};


ContractGeneralInformationNS.deleteContract = function (id) {
  if (confirm("Are you sure you want to delete this contract?")) {
    $.ajax({
      url: 'api/contract/' + id,
      type: 'DELETE',
      contentType: 'application/json; charset=utf-8',
      success: function (data, textStatus, XMLHttpRequest) {
        if (!data.error) {
          toastr.success('Contract deleted');
          $(".buttonExit").trigger('click');
          $("#contractGrid").data("kendoGrid").dataSource.read();
        } else {
          toastr.error(data.error);
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        toastr.error('Something went wrong with the request!');
      }
    });
  }
};

ContractGeneralInformationNS.cancelContract = function (id) {
  if (confirm("Are you sure you want to cancel this contract?")) {
    $.ajax({
      url: 'api/contract/' + id + '/updateContractToCanceled',
      type: 'PUT',
      contentType: 'application/json; charset=utf-8',
      success: function (data, textStatus, XMLHttpRequest) {
        if (!data.error) {
          toastr.success('Contract canceled');
          $(".buttonExit").trigger('click');
          $("#contractGrid").data("kendoGrid").dataSource.read();
        } else {
          toastr.error(data.error);
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        toastr.error('Something went wrong with the request!');
      }
    });
  }
};



ContractGeneralInformationNS.getHistory = function () {
  $.ajax({ url: '/history/ContractGeneralInformation?contractId=' + ContractGeneralInformationNS.ContractId })
    .done(function (result) {
      $("#contract-history-content-pane").empty();
      $("#contract-history-content-pane").html(result);
    });
}
