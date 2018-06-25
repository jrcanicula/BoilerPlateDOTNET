var ContractGeneralInformationNS = {};
ContractGeneralInformationNS.VendorId = null;
ContractGeneralInformationNS.ContractId = null;
ContractGeneralInformationNS.Mode = 0;

ContractGeneralInformationNS.InitializeControl = function (id, contractId) {
  if (contractId != null) {
    ContractGeneralInformationNS.Mode = 1;
  }
  ContractGeneralInformationNS.ContractId = contractId;
  ContractGeneralInformationNS.VendorId = id;
  ContractGeneralInformationNS.LoadControls(id, contractId);
};

ContractGeneralInformationNS.resetCollapse = function () {
  $('#contract-details-collapse').removeClass('in');
  $('#contract-permission-collapse').removeClass('in');
  $('#contract-history-collapse').removeClass('in');
  $('#contract-alert-collapse').removeClass('in');
  $('#contractDetailsHeading').trigger('click');
}


ContractGeneralInformationNS.LoadControls = function (id, contractId) {



  var dataSource = [];

  var validator = $("#form-contract-general-information").kendoValidator().data("kendoValidator");

  if (contractId == null) {
    dataSource = new kendo.data.DataSource({
      schema: {
        model: {
          id: "userInfoId",
          fields: {
            userInfoId: { editable: false, type: "guid" },
            canRead: { type: "number" },
            canWrite: { type: "number" },
          }
        }
      },
      pageSize: 10,
    });
  } else { // dataSource must be fromDatabase;
    dataSource = new kendo.data.DataSource({
      schema: {
        model: {
          id: "userInfoId",
          fields: {
            userInfoId: { editable: false, type: "guid" },
            canRead: { type: "number" },
            canWrite: { type: "number" },
          }
        }
      }
    });
  };

  $("#contact-permission-grid").kendoGrid({
    dataSource: dataSource,
    noRecords: true,
    pageable: true,
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

      $('.can-write').click(function (e) {
        var guid = $(this).attr('item-guid');
        $('.can-write').each(function (a) {
          var items = $("#contact-permission-grid").data().kendoGrid.dataSource.view();
          for (var counter = 0; counter < items.length; counter++) {
            if (items[counter].uid.toLowerCase() == guid.toLowerCase()) {
              console.log(items[counter]);
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

      $('.can-read').click(function (e) {
        var guid = $(this).attr('item-guid');
        $('.can-read').each(function (a) {
          var items = $("#contact-permission-grid").data().kendoGrid.dataSource.view();
          for (var counter = 0; counter < items.length; counter++) {
            if (items[counter].uid.toLowerCase() == guid.toLowerCase()) {
              console.log(items[counter]);
              if (items[counter].canRead == 1) {
                items[counter].set("canRead", 2);
                $(this).attr('data-value', 2);
              } else {
                items[counter].set("canRead", 1);
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
        field: "name",
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
        template: '<p class="text-center can-read"  style="cursor: pointer" item-guid="#:uid#" data-value="#:canRead#"><span><i class="#: canRead  == 1 ? "fa fa-check" : "fa fa-times" #" style=" color : #: canRead  == 1 ? "green" : "red" #"></i></span></p>',
        width: "50px"
      },
      {
        field: "canWrite",
        title: "Can Write?",
        width: 120,
        template: '<p class="text-center can-write" style="cursor: pointer" item-guid="#:uid#" data-value="#:canWrite#"><span><i class="#: canWrite  == 1 ? "fa fa-check " : "fa fa-times" #" style=" color : #: canWrite  == 1 ? "green" : "red" #"></i></span></p>',
      },
      {
        field: "destroy",
        title: " ",
        width: "60px",
        template: "<center><span class='fas fa-trash' style='text-align: center; cursor:pointer' onclick=\"ContractGeneralInformationNS.deletePermissionRow('#= uid #')\" > </span> </center>"
      },
    ]
  });

  $("#contractDetailsStartDate").kendoDatePicker();
  $("#contractDetailsEndDate").kendoDatePicker();

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

  $.ajax({
    url: 'api/vendor/' + id + '/users',
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
              name: dataItem.fullName,
              canRead: 2,
              canWrite: 2,
            });
          }
        }
      });
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request');
    }
  });

  if (ContractGeneralInformationNS.Mode == 1) {
    ContractGeneralInformationNS.fillUpForm(ContractGeneralInformationNS.ContractId);
  }

  $("form#form-contract-general-information").submit(function (e) {
    e.preventDefault();

    var displayedData = $("#contact-permission-grid").data().kendoGrid.dataSource.view();

    if (validator.validate() && displayedData.length >= 1) {
      ContractGeneralInformationNS.save();
    } else if (displayedData.length < 1) {
      toastr.error('Permission is Required');
    }
  });

  ContractGeneralInformationNS.resetCollapse();
};

ContractGeneralInformationNS.fillUpForm = function (contractId) {

}


ContractGeneralInformationNS.deletePermissionRow = function (id) {
  if (confirm("Are you sure you want to delete this item?")) {
    var items = $("#contact-permission-grid").data().kendoGrid.dataSource.view();
    for (var counter = 0; counter < items.length; counter++) {
      if (items[counter].uid.toLowerCase() == id.toLowerCase()) {
        var grid = $("#contact-permission-grid").data("kendoGrid");
        var widget = $("#contract-permission-users").getKendoComboBox();
        var cbox = widget.dataSource;
        cbox.add({ userInfoId: items[counter].userInfoId, fullName: items[counter].name });
        var dataItem = grid.dataSource.getByUid(id.toLowerCase());
        grid.dataSource.remove(dataItem);
      }
    }
  }
};


ContractGeneralInformationNS.save = function () {

  var permissions = [];
  var displayedData = $("#contact-permission-grid").data().kendoGrid.dataSource.view();
  var permissionCount = 0;

  for (var counter = 0; counter < displayedData.length; counter++) {
    var permissionItem = {};
    permissionItem.CanRead = displayedData[counter].canRead;
    permissionItem.CanWrite = displayedData[counter].canWrite;
    permissionItem.UserInfoId = displayedData[counter].userInfoId;
    permissionCount++;
    permissions.push(permissionItem);
  }

  if (permissionCount == 0) {
    toastr.error('Permission is required');
    return;
  }

  var model = {};
  model.DetailInformation = {};
  model.DetailInformation.Title = $('#contractPermissionTitle').val();
  model.DetailInformation.StartDate = $('#contractDetailsStartDate').val();
  model.DetailInformation.EndDate = $('#contractDetailsEndDate').val();
  model.DetailInformation.Description = $('#contractDetailsDescription').val();
  model.DetailInformation.RenewalType = $('#contactDetailsRenewalType').val();
  model.VendorId = ContractGeneralInformationNS.VendorId;

  model.Contractid = "00000000-0000-0000-0000-000000000000";

  model.Alert = {};
  model.Alert.IsContractAlertWhenExpired = $('#isContractAlertWhenExpired').is(':checked') ? 1 : 0;;
  model.Alert.ContractAlertWhenExpiredEmails = $('#contractAlertWhenExpiredEmails').val();
  model.Alert.IsContractAlertBeforeDaysExpired = $('#isContractAlertBeforeDaysExpired').is(':checked') ? 1 : 0;
  model.Alert.ContractAlertBeforeDaysExpiredDays = $('#contractAlertBeforeDaysExpiredDays').val();
  model.Alert.ContractAlertBeforeDaysExpiredEmails = $('#contractAlertBeforeDaysExpiredEmails').val();
  model.Alert.IsAlertWhenNewContactAreIncluded = $('#isAlertWhenNewContactAreIncluded').is(':checked') ? 1 : 0;
  model.Alert.AlertWhenNewContactAreIncluded = $('#alertWhenNewContactAreIncludedEmails').val();
  model.Permissions = permissions;
}