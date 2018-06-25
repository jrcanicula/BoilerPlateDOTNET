var UserManagementNS = {};
UserManagementNS.ExcelURL = null;
UserManagementNS.UserInfoId = null;

UserManagementNS.init = function () {
  UserManagementNS.hookup();
  $("h3#page-title").text("User Management");

  $("#user-edit-country").kendoComboBox({
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

  $("#user-add-country").kendoComboBox({
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

UserManagementNS.onChange = function onChange(arg) {
  var text = "";
  var grid = this;
  if (grid.select().length >= 1) {
    grid.select().each(function () {
      var dataItem = grid.dataItem($(this));
      UserManagementNS.UserInfoId = dataItem.userInfoId;
      $('#user-edit-firstname').val(dataItem.firstName);
      $('#user-edit-lastname').val(dataItem.lastName);
      $('#user-edit-email').val(dataItem.email);;
      $('#user-edit-address').val(dataItem.address);
      $('#user-edit-companyid').val(dataItem.companyId);
      $('#user-edit-position').val(dataItem.position);
      $('#user-edit-contactno').val(dataItem.contactNo);
      var country = $("#user-edit-country").data("kendoComboBox");
      country.value(dataItem.country);
      $('#user-edit-timezone').val(dataItem.timezone);
      if (dataItem.status === 1) {
        document.getElementById("user-edit-isactive").checked = true;
      } else {
        document.getElementById("user-edit-isactive").checked = false;
      }
      $('#edit-user-popup').prop('disabled', false);
      $('#delete-user-popup').prop('disabled', false);
    });
  } else {
    UserManagementNS.UserInfoId = null;

    $('#user-edit-firstname').val(null);
    $('#user-edit-lastname').val(null);
    $('#user-edit-email').val(null);;
    $('#user-edit-address').val(null);
    $('#user-edit-company').val(null);
    $('#user-edit-position').val(null);
    $('#user-edit-contactno').val(null);
    $('#user-edit-country').val(null);
    $('#user-edit-timezone').val(null);

    $('#edit-user-popup').prop('disabled', true);
    $('#delete-user-popup').prop('disabled', true);
  }
};

UserManagementNS.populateUser = function () {
  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: "api/userinfo/list",
        dataType: "json"
      }
    },
    batch: true,
    pageSize: 10,
    schema: {
      model: {
        id: "UserInfoId",
        fields: {
          userInfoId: { editable: false, type: "guid" },

          lastName: { type: "string" },
          firstName: { type: "string" },
          email: { type: "string" },
          position: { type: "string" },
          contactNo: { type: "string" },
          country: { type: "string" },
          status: { type: "int" },
          address: {
            type: "string"
          },
          position: {
            type: "string"
          },
          companyId: {
            type: "guid"
          },
          timezone: { type: "string" }
        }
      }
    }
  });

  $("#user-grid").kendoGrid({
    dataSource: dataSource,
    selectable: true,
    pageable: true,
    columns: [
      {
        field: "userInfoId", title: "UserInfoId", hidden: true
      },
      {
        field: "firstName", title: "First Name"
      },
      {
        field: "lastName", title: "Last Name"
      },
      {
        field: "email", title: "Email"
      },
      {
        field: "position", title: "Position"
      },
      {

        field: "contactNo", title: "Contact Number"
      }

    ],
    scrollable: false,
    sortable: true,
    change: UserManagementNS.onChange,
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


UserManagementNS.hookup = function () {

  var createUserValidator = $("#form-user-create").kendoValidator().data("kendoValidator"),
    status = $(".status");


  var updateUserValidator = $("#form-user-edit").kendoValidator().data("kendoValidator"),
    status = $(".status");


  document.getElementById("user-add-isactive").checked = true;

  $("#add-user-popup").click(function (e) {
    UserManagementNS.populateAddRoleMappings();
    createUserValidator.hideMessages();
    $('#user-add-firstname').val(null);
    $('#user-add-lastname').val(null);
    $('#user-add-email').val(null);;
    $('#user-add-address').val(null);
    $("#user-add-companyid").val($("#user-add-companyid option:first").val());
    $('#user-add-position').val(null);
    $("#user-add-contactno").val(null);
    $("#user-add-country").val(null);
    $('#user-add-timezone').val(null);
    document.getElementById("user-add-isactive").checked = true;
  });

  $("#edit-user-popup").click(function (e) {
    updateUserValidator.hideMessages();
    UserManagementNS.populateEditRoleMappings();
  });


  $("#edit-user-dismiss").click(function (e) {
    var grid = $("#user-grid").data("kendoGrid");
    grid.clearSelection();
  });


  $('#user-edit-popup').on('hidden.bs.modal', function () {
    var grid = $("#user-grid").data("kendoGrid");
    grid.clearSelection();
  })


  $("form#form-user-create").submit(function (e) {

    e.preventDefault();

    if (createUserValidator.validate()) {
      var model = {};
      model.FirstName = $('#user-add-firstname').val();
      model.LastName = $('#user-add-lastname').val();
      model.Email = $('#user-add-email').val();;
      model.Address = $('#user-add-address').val();
      model.Position = $('#user-add-position').val();
      model.CompanyId = $('#user-add-companyid').val();
      model.ContactNo = $('#user-add-contactno').val();
      model.Country = $('#user-add-country').val();
      model.Status = $('#user-add-isactive').is(':checked') ? 1 : 0;
      model.Timezone = null;

      var ids = [];
      var dataSource = $("#add-selected-role-mapping-grid").data().kendoGrid.dataSource;
      for (var i = 0; i < dataSource._data.length; i++) {
        ids.push({ RoleId: dataSource._data[i].roleId, Name: dataSource._data[i].name });
      }
      model.RoleMappingItems = ids;

      if (model.FirstName != null && model.FirstName.length > 0 && ids.length >= 1 && validateEmail(model.Email)) {
        UserManagementNS.createUser(model);
      } else if (model.LastName == null) {
        toastr.error("Lastname is required");
      }
      else if (!validateEmail(model.Email)) {
        toastr.error("Not a valid email");
      }
      else if (model.RoleMappingItems.length < 1) {
        toastr.error("Role is required");
      }
      else {
        toastr.error("Firstname is required");
      }
    }
  });

  $("form#form-user-edit").submit(function (e) {
    e.preventDefault();

    if (updateUserValidator.validate()) {
      var model = {};
      model.FirstName = $('#user-edit-firstname').val();
      model.LastName = $('#user-edit-lastname').val();
      model.Email = $('#user-edit-email').val();;
      model.Address = $('#user-edit-address').val();
      model.Position = $('#user-edit-position').val();
      model.CompanyId = $('#user-edit-companyid').val();
      model.ContactNo = $('#user-edit-contactno').val();
      model.Country = $('#user-edit-country').val();
      model.Status = $('#user-edit-isactive').is(':checked') ? 1 : 0;
      model.Timezone = null;
      model.UserInfoId = UserManagementNS.UserInfoId;

      var ids = [];
      var dataSource = $("#edit-selected-role-mapping-grid").data().kendoGrid.dataSource;
      for (var i = 0; i < dataSource._data.length; i++) {
        ids.push({ RoleId: dataSource._data[i].roleId, Name: dataSource._data[i].name });
      }
      model.RoleMappingItems = ids;

      if (model.FirstName != null && model.FirstName.length > 0 && ids.length >= 1 && validateEmail(model.Email)) {
        UserManagementNS.updateUser(model);
      } else if (model.LastName == null) {
        toastr.error("Lastname is required");
      } else if (!validateEmail(model.Email)) {
        toastr.error("Not a valid email");
      }
      else if (model.RoleMappingItems.length < 1) {
        toastr.error("Role is required");
      }
      else {
        toastr.error("Firstname is required");
      }
    }
  });

  $("#delete-user").click(function (e) {
    UserManagementNS.deleteUser();
  });

  UserManagementNS.populateUser();

  $.ajax({
    url: 'api/vendor/items',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      for (var count = 0; count < data.length; count++) {
        $('#user-edit-companyid')
          .append($("<option></option>")
            .attr("value", data[count].vendorId)
            .text(data[count].name));
        $('#user-add-companyid')
          .append($("<option></option>")
            .attr("value", data[count].vendorId)
            .text(data[count].name));
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request');
    }
  });
}


UserManagementNS.createUser = function (model) {
  $.ajax({
    url: 'api/userinfo/',
    type: 'POST',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#save-user-dismiss").trigger("click");
        $("#user-grid").data("kendoGrid").dataSource.read();
        UserManagementNS.selectFirstItem();
        $('#user-add-firstname').val(null);
        $('#user-add-lastname').val(null);
        $('#user-add-email').val(null);;
        $('#user-add-address').val(null);
        $('#user-add-companyid').val(null);
        $('#user-add-position').val(null);
        $('#user-add-contactno').val(null);
        $('#user-add-country').val(null);
        $('#user-add-timezone').val(null);
        document.getElementById("user-edit-isactive").checked = true;
        toastr.success('User successfully added');
      } else {
        toastr.error('User already exist!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

UserManagementNS.updateUser = function (model) {

  $.ajax({
    url: 'api/userinfo/' + UserManagementNS.UserInfoId,
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {

      if (data != false && data != "false") {
        $("#edit-user-dismiss").trigger("click");
        $("#user-grid").data("kendoGrid").dataSource.read();
        $('#user-edit-firstname').val(null);
        $('#user-edit-lastname').val(null);
        $('#user-edit-email').val(null);;
        $('#user-edit-address').val(null);
        $('#user-edit-company').val(null);
        $('#user-edit-position').val(null);
        $('#user-edit-contactno').val(null);
        $('#user-edit-country').val(null);
        $('#user-edit-timezone').val(null);
        $('#user-edit-companyid').val(null);
        document.getElementById("user-edit-isactive").checked = true;
        $('#edit-user-popup').prop('disabled', true);
        $('#delete-user-popup').prop('disabled', true);
        toastr.success('User successfully updated!');
      } else {
        toastr.error('User already exist!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

UserManagementNS.deleteUser = function () {

  $.ajax({
    url: 'api/userinfo/' + UserManagementNS.UserInfoId,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      $("#delete-user-dismiss").trigger("click");
      if (data == false) {
        toastr.success('Error in deleting user');
      } else {
        $("#user-grid").data("kendoGrid").dataSource.read();
        $('#user-edit-firstname').val(null);
        $('#user-edit-lastname').val(null);
        $('#user-edit-email').val(null);;
        $('#user-edit-address').val(null);
        $('#user-edit-company').val(null);
        $('#user-edit-position').val(null);
        $('#user-edit-contactno').val(null);
        $('#user-edit-country').val(null);
        $('#user-edit-timezone').val(null);
        $('#user-edit-companyid').val(null);
        $('#edit-user-popup').prop('disabled', true);
        $('#delete-user-popup').prop('disabled', true);
      }
      toastr.success('User successfully deleted!');
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
};

UserManagementNS.selectFirstItem = function () {
  var grid = $("#user-grid").data("kendoGrid");
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

UserManagementNS.populateAddRoleMappings = function () {
  $.ajax({
    url: "api/role/availableMappingList",
    type: 'GET',
  }).done(function (result) {
    UserManagementNS.initializeAddRoleMappingGrid(result);
  }).fail(function () {
    toastr.error('Something went wrong with the request!');
  });
}


UserManagementNS.populateEditRoleMappings = function () {
  UserManagementNS.initializeEditRoleMappingGrid(null);
}

UserManagementNS.initializeAddRoleMappingGrid = function (dataSource) {

  var grid1 = $("#add-available-role-mapping-grid").kendoGrid({
    dataSource: dataSource,
    columns: [
      { field: "roleId", title: "RoleId", hidden: true },
      { field: "name", title: "Name", width: "50px" },
    ],
    selectable: "row",
  }).data("kendoGrid");

  grid1.table.kendoSortable({
    filter: ">tbody >tr",
    hint: function (element) {
      var table = $('<table style="width: 100px;" class="k-grid k-widget"></table>'),
        hint;

      table.append(element.clone());
      table.css("opacity", 0.7);

      return table;
    },
    cursor: "move",
    placeholder: function (element) {
      return $('<tr colspan="4" class="placeholder"></tr>');
    },
    change: function (e) {
      var skip = grid1.dataSource.skip(),
        oldIndex = e.oldIndex + skip,
        newIndex = e.newIndex + skip,
        data = grid1.dataSource.data(),
        dataItem = grid1.dataSource.getByUid(e.item.data("uid"));

      grid1.dataSource.remove(dataItem);
      grid1.dataSource.insert(newIndex, dataItem);
    }
  });

  var grid2 = $("#add-selected-role-mapping-grid").kendoGrid({
    dataSource: [],
    columns: [
      { field: "roleId", title: "RoleId", hidden: true },
      { field: "name", title: "Name", width: "50px" },
    ],
    selectable: "row",
  }).data("kendoGrid");

  grid2.table.kendoSortable({
    filter: ">tbody >tr",
    hint: function (element) {
      var table = $('<table style="width: 200px;" class="k-grid k-widget"></table>'),
        hint;
      table.append(element.clone());
      table.css("opacity", 0.7);
      return table;
    },
    cursor: "move",
    placeholder: function (element) {
      return $('<tr colspan="4" class="placeholder"></tr>');
    },
    change: function (e) {
      var skip = grid2.dataSource.skip(),
        oldIndex = e.oldIndex + skip,
        newIndex = e.newIndex + skip,
        data = grid2.dataSource.data(),
        dataItem = grid2.dataSource.getByUid(e.item.data("uid"));

      grid2.dataSource.remove(dataItem);
      grid2.dataSource.insert(newIndex, dataItem);

    }
  });

  $('#add-mapped-role-to-available').click(function (e) {
    var grid = $("#add-selected-role-mapping-grid").data("kendoGrid");
    currentSelection = grid.select();
    if (grid.select().length >= 1) {
      currentSelection.each(function (index, row) {
        var selectedItem = grid.dataItem(row);
        var dataSource = $("#add-available-role-mapping-grid").data().kendoGrid.dataSource;
        dataSource.add({
          roleId: selectedItem.roleId ? selectedItem.roleId : null,
          name: selectedItem.name ? selectedItem.name : null,
        });
        grid.dataSource.remove(selectedItem);
      })
    }
    e.preventDefault();
  });

  $('#add-available-role-to-selected').click(function (e) {
    var grid = $("#add-available-role-mapping-grid").data("kendoGrid");
    currentSelection = grid.select();
    if (grid.select().length >= 1) {
      grid.select().each(function () {
        var dataItem = grid.dataItem($(this));
        var dataSource = $("#add-selected-role-mapping-grid").data().kendoGrid.dataSource;
        dataSource.add({
          roleId: dataItem.roleId ? dataItem.roleId : null,
          name: dataItem.name ? dataItem.name : null,
        });
        grid.dataSource.remove(dataItem);
      });
    }
    e.preventDefault();
  });
}

UserManagementNS.initializeEditRoleMappingGrid = function (dataSource) {

  var grid1 = $("#edit-available-role-mapping-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/userinfo/unmapped/" + UserManagementNS.UserInfoId,
          dataType: "json"
        },
      },
    },
    columns: [
      { field: "roleId", title: "RoleId", hidden: true },
      { field: "name", title: "Name", width: "50px" },
    ],
    selectable: "row",
  }).data("kendoGrid");

  grid1.table.kendoSortable({
    filter: ">tbody >tr",
    hint: function (element) {
      var table = $('<table style="width: 100px;" class="k-grid k-widget"></table>'),
        hint;

      table.append(element.clone());
      table.css("opacity", 0.7);

      return table;
    },
    cursor: "move",
    placeholder: function (element) {
      return $('<tr colspan="4" class="placeholder"></tr>');
    },
    change: function (e) {
      var skip = grid1.dataSource.skip(),
        oldIndex = e.oldIndex + skip,
        newIndex = e.newIndex + skip,
        data = grid1.dataSource.data(),
        dataItem = grid1.dataSource.getByUid(e.item.data("uid"));

      grid1.dataSource.remove(dataItem);
      grid1.dataSource.insert(newIndex, dataItem);
    }
  });

  var grid2 = $("#edit-selected-role-mapping-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/userinfo/mapped/" + UserManagementNS.UserInfoId,
          dataType: "json"
        },
      },
    },
    columns: [
      { field: "roleId", title: "RoleId", hidden: true },
      { field: "name", title: "Name", width: "50px" },
    ],
    selectable: "row",
  }).data("kendoGrid");

  grid2.table.kendoSortable({
    filter: ">tbody >tr",
    hint: function (element) {
      var table = $('<table style="width: 200px;" class="k-grid k-widget"></table>'),
        hint;
      table.append(element.clone());
      table.css("opacity", 0.7);
      return table;
    },
    cursor: "move",
    placeholder: function (element) {
      return $('<tr colspan="4" class="placeholder"></tr>');
    },
    change: function (e) {
      var skip = grid2.dataSource.skip(),
        oldIndex = e.oldIndex + skip,
        newIndex = e.newIndex + skip,
        data = grid2.dataSource.data(),
        dataItem = grid2.dataSource.getByUid(e.item.data("uid"));

      grid2.dataSource.remove(dataItem);
      grid2.dataSource.insert(newIndex, dataItem);

    }
  });

  $('#edit-mapped-role-to-available').click(function (e) {
    var grid = $("#edit-selected-role-mapping-grid").data("kendoGrid");
    currentSelection = grid.select();
    if (grid.select().length >= 1) {
      currentSelection.each(function (index, row) {
        var selectedItem = grid.dataItem(row);
        var dataSource = $("#edit-available-role-mapping-grid").data().kendoGrid.dataSource;
        dataSource.add({
          roleId: selectedItem.roleId,
          name: selectedItem.name
        });
        grid.dataSource.remove(selectedItem);
      })
    }
    e.preventDefault();
  });

  $('#edit-available-role-to-selected').click(function (e) {
    var grid = $("#edit-available-role-mapping-grid").data("kendoGrid");
    currentSelection = grid.select();
    if (grid.select().length >= 1) {
      grid.select().each(function () {
        var dataItem = grid.dataItem($(this));
        var dataSource = $("#edit-selected-role-mapping-grid").data().kendoGrid.dataSource;
        dataSource.add({
          roleId: dataItem.roleId ? dataItem.roleId : null,
          name: dataItem.name ? dataItem.name : null,
        });
        grid.dataSource.remove(dataItem);
      });
    }
    e.preventDefault();
  });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}