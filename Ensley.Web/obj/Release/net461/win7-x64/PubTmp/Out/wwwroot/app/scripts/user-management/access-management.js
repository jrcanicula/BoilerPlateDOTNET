var AccessManagementNS = {};
AccessManagementNS.ExcelURL = null;
AccessManagementNS.AccessId = null;

AccessManagementNS.init = function () {
  AccessManagementNS.hookup();
}

AccessManagementNS.onChange = function onChange(arg) {
  var text = "";
  var grid = this;

  if (grid.select().length >= 1) {
    grid.select().each(function () {
      var dataItem = grid.dataItem($(this));
      AccessManagementNS.AccessId = dataItem.accessId;
      $('#access-edit-name').val(dataItem.name);
      $('#access-edit-description').val(dataItem.description);
      $('#access-edit-category').val(dataItem.category);

      $('#edit-access-popup').prop('disabled', false);
      $('#delete-access-popup').prop('disabled', false);
    });
  } else {
    AccessManagementNS.AccessId = null;
    $('#access-edit-name').val(null);
    $('#access-edit-description').val(null);
    $('#access-edit-category').val(null);

    $('#edit-access-popup').prop('disabled', true);
    $('#delete-access-popup').prop('disabled', true);
  }
};

AccessManagementNS.populateAccess = function () {
  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: "api/access/list",
        dataType: "json"
      }
    },
    batch: true,
    pageSize: 10,
    schema: {
      model: {
        id: "accessId",
        fields: {
          accessId: { editable: false, type: "guid" },
          name: { validation: { required: true } },
          description: { validation: { required: true } },
          category: { validation: { required: true } },
          createdOn: { validation: { required: true }, hidden: true },
        }
      }
    }
  });

  $("#access-grid").kendoGrid({
    dataSource: dataSource,
    selectable: true,
    pageable: true,
    columns: [
      {
        field: "accessId", title: "AccessId", hidden: true
      },
      { field: "name", title: "Name", width: 500, },
      { field: "description", title: "Description", width: 400 },
      { field: "category", title: "Category" },
      { field: "createdOn", title: "Created On", hidden: true },
    ],
    scrollable: false,
    sortable: true,
    change: AccessManagementNS.onChange,
    filterable: {
      extra: false,
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
        }
      }
    },
    pageable: true
  });
}



AccessManagementNS.hookup = function () {

  var createAccessValidator = $("#form-access-create").kendoValidator().data("kendoValidator"),
    status = $(".status");

  var updateAccessValidator = $("#form-access-edit").kendoValidator().data("kendoValidator"),
    status = $(".status");

  $("#add-access-popup").click(function (e) {
    $('#access-add-name').val(null);
    $('#access-add-description').val(null);
    $('#access-add-category').val(null);
    createAccessValidator.hideMessages();
  });

  $('#edit-access-popup').on('hidden.bs.modal', function () {
    updateAccessValidator.hideMessages();
    createAccessValidator.hideMessages();
  });

  $('#access-edit-popup').on('hidden.bs.modal', function () {
    updateAccessValidator.hideMessages();
    createAccessValidator.hideMessages();
  });


  $("#edit-access-dismiss").click(function (e) {
    var grid = $("#access-grid").data("kendoGrid");
    grid.clearSelection();
    updateAccessValidator.hideMessages();
    createAccessValidator.hideMessages();
  });


  $('#access-edit-popup').on('hidden.bs.modal', function () {
    var grid = $("#access-grid").data("kendoGrid");
    grid.clearSelection();
    updateAccessValidator.hideMessages();
    createAccessValidator.hideMessages();
  });


  $("form#form-access-create").submit(function (e) {
    e.preventDefault();

    if (createAccessValidator.validate()) {
      var model = {};
      model.Description = $('#access-add-description').val();
      model.Category = $('#access-add-category').val();
      model.AccessId = null;
      model.Name = $('#access-add-name').val();

      if (model.Name != null && model.Name.length > 0) {
        AccessManagementNS.createAccess(model);
      } else if (model.OrderNo == null) {

        toastr.error("Order Number is required");
      }
      else {
        toastr.error("Name is required");
      }
    }
  });

  $("form#form-access-edit").submit(function (e) {

    e.preventDefault();

    if (updateAccessValidator.validate()) {
      var model = {};
      model.Description = $('#access-edit-description').val();
      model.Category = $('#access-edit-category').val();
      model.AccessId = AccessManagementNS.AccessId;
      model.Name = $('#access-edit-name').val();

      if (model.Name != null && model.Name.length > 0) {
        AccessManagementNS.updateAccess(model);
      }
      else {
        toastr.error("Name is required");
      }
    }
  });

  $("#delete-access").click(function (e) {
    AccessManagementNS.deleteAccess();
  });

  AccessManagementNS.populateAccess();
}

AccessManagementNS.createAccess = function (model) {
  $.ajax({
    url: 'api/access/',
    type: 'POST',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#save-access-dismiss").trigger("click");
        $("#access-grid").data("kendoGrid").dataSource.read();
        AccessManagementNS.selectFirstItem();
        $('#access-add-name').val(null);
        $('#access-add-description').val(null);
        $('#access-add-category').val(null);
        toastr.success('Access successfully added');
      } else {
        toastr.error('Access already exist!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });

}

AccessManagementNS.updateAccess = function (model) {
  $.ajax({
    url: 'api/access/' + AccessManagementNS.AccessId,
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#edit-access-dismiss").trigger("click");
        $("#access-grid").data("kendoGrid").dataSource.read();
        $('#access-add-name').val(null);
        $('#access-add-description').val(null);
        $('#access-add-category').val(null);
        $('#edit-access-popup').prop('disabled', true);
        $('#delete-access-popup').prop('disabled', true);
        toastr.success('Access successfully updated!');
      } else {
        toastr.error('Access already exist!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

AccessManagementNS.deleteAccess = function () {
  $.ajax({
    url: 'api/access/' + AccessManagementNS.AccessId,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {

      if (data != false && data != "false") {
        $("#delete-access-dismiss").trigger("click");
        $("#access-grid").data("kendoGrid").dataSource.read();
        $('#access-edit-name').val(null);
        $('#access-edit-orderNo').val(null);
        $('#edit-access-popup').prop('disabled', true);
        $('#delete-access-popup').prop('disabled', true);
        toastr.success('Access successfully deleted!');
      } else {
        toastr.error('Error deleting access!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
};

AccessManagementNS.selectFirstItem = function () {
  var grid = $("#access-grid").data("kendoGrid");
  grid.one("dataBound", function (e) {
    setTimeout(function () {
      var row = e.sender.tbody.find('tr:first');
      grid.select(row);
      row.trigger('click');
    }, 2000)
  });
  grid.dataSource.page(1);
};

function TryParseInt(str, defaultValue) {
  var retValue = defaultValue;
  if (str !== null) {
    if (str.length > 0) {
      if (!isNaN(str)) {
        retValue = parseInt(str);
      }
    }
  }
  return retValue;
}