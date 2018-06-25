var RoleManagementNS = {};
RoleManagementNS.ExcelURL = null;
RoleManagementNS.RoleId = null;

RoleManagementNS.init = function () {
  RoleManagementNS.hookup();
}

RoleManagementNS.onChange = function onChange(arg) {
  var text = "";
  var grid = this;

  if (grid.select().length >= 1) {
    grid.select().each(function () {
      var dataItem = grid.dataItem($(this));
      RoleManagementNS.RoleId = dataItem.roleId;
      $('#role-edit-name').val(dataItem.name);
      $('#role-edit-description').val(dataItem.description);
      if (dataItem.status == 1) {
        document.getElementById("role-edit-isactive").checked = true;
      } else {
        document.getElementById("role-edit-isactive").checked = false;
      }
      $('#edit-role-popup').prop('disabled', false);
      $('#delete-role-popup').prop('disabled', false);
    });
  } else {
    RoleManagementNS.RoleId = null;
    $('#role-edit-name').val(null);
    $('#role-edit-description').val(null);
    $('#edit-role-popup').prop('disabled', true);
    $('#delete-role-popup').prop('disabled', true);
  }
};

RoleManagementNS.populateRole = function () {
  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: "api/role/list",
        dataType: "json"
      }
    },
    batch: true,
    pageSize: 10,
    schema: {
      model: {
        id: "RoleId",
        fields: {
          roleId: { editable: false, type: "guid" },
          name: { validation: { required: true } },
          description: { validation: { required: true }, hidden: true },
          createdOn: { validation: { required: true } },
        }
      }
    }
  });

  $("#role-grid").kendoGrid({
    dataSource: dataSource,
    selectable: true,
    pageable: true,
    columns: [
      {
        field: "roleId", title: "RoleId", hidden: true
      },
      { field: "name", title: "Name", width: 500, },
      { field: "description", title: "Description", width: 400 },
      { field: "createdOn", title: "Created On", hidden: true },
    ],
    scrollable: false,
    sortable: true,
    change: RoleManagementNS.onChange,
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

RoleManagementNS.hookup = function () {

  var createRoleValidator = $("#form-role-create").kendoValidator().data("kendoValidator"),
    status = $(".status");

  var updateRoleValidator = $("#form-role-edit").kendoValidator().data("kendoValidator"),
    status = $(".status");

  document.getElementById("role-add-isactive").checked = true;

  $("#edit-role-dismiss").click(function (e) {
    var grid = $("#role-grid").data("kendoGrid");
    grid.clearSelection();
  });

  $('#role-edit-popup').on('hidden.bs.modal', function () {
    var grid = $("#role-grid").data("kendoGrid");
    grid.clearSelection();
  })

  $("#add-role-popup").click(function (e) {
    createRoleValidator.hideMessages();
    RoleManagementNS.RoleId = null;
    document.getElementById("role-add-isactive").checked = true;
    $('#role-add-description').val(null);
    $('#role-add-name').val(null);
    RoleManagementNS.populateAddAccessMappings();
  });

  $("#edit-role-popup").click(function (e) {
    updateRoleValidator.hideMessages();
    RoleManagementNS.populateEditAccessMappings();
  });


  $("form#form-role-create").submit(function (e) {

    e.preventDefault();

    if (createRoleValidator.validate()) {

      var model = {};
      model.RoleId = RoleManagementNS.RoleId;
      model.Status = $('#role-add-isactive').is(':checked') ? 1 : 0;
      model.Description = $('#role-add-description').val();
      model.Name = $('#role-add-name').val();

      var ids = [];
      var dataSource = $("#add-selected-access-mapping-grid").data().kendoGrid.dataSource;
      for (var i = 0; i < dataSource._data.length; i++) {
        ids.push({ AccessId: dataSource._data[i].accessId, Name: dataSource._data[i].name, Category: dataSource._data[i].category });
      }

      model.AccessMappingItems = ids;

      if (model.Name != null && model.Name.length > 0) {
        RoleManagementNS.createRole(model);
      }
      else {
        toastr.error("Name is required");
      }
    }
  });

  $("form#form-role-edit").submit(function (e) {

    e.preventDefault();

    if (updateRoleValidator.validate()) {
      var model = {};
      model.RoleId = RoleManagementNS.RoleId;
      model.Status = $('#role-edit-isactive').is(':checked') ? 1 : 0;
      model.Description = $('#role-edit-description').val();
      model.Name = $('#role-edit-name').val();
      var ids = [];
      var dataSource = $("#edit-selected-access-mapping-grid").data().kendoGrid.dataSource;
      for (var i = 0; i < dataSource._data.length; i++) {
        ids.push({ AccessId: dataSource._data[i].accessId, Name: dataSource._data[i].name, Category: dataSource._data[i].category });
      }
      model.AccessMappingItems = ids;

      if (model.Name != null && model.Name.length > 0) {
        RoleManagementNS.updateRole(model);
      }
      else {
        toastr.error("Name is required");
      }
    }
  });


  $("#delete-role").click(function (e) {
    RoleManagementNS.deleteRole();
  });

  RoleManagementNS.populateRole();
}


RoleManagementNS.createRole = function (model) {
  $.ajax({
    url: 'api/role/',
    type: 'POST',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#save-role-dismiss").trigger("click");
        $("#role-grid").data("kendoGrid").dataSource.read();
        RoleManagementNS.selectFirstItem();
        $('#role-add-description').val(null);
        $('#role-add-name').val(null);
        toastr.success('Role successfully added');
      } else {
        toastr.error('Role already exist!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

RoleManagementNS.updateRole = function (model) {
  $.ajax({
    url: 'api/role/' + RoleManagementNS.RoleId,
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#edit-role-dismiss").trigger("click");
        $("#role-grid").data("kendoGrid").dataSource.read();
        $('#edit-role-popup').prop('disabled', true);
        $('#delete-role-popup').prop('disabled', true);
        toastr.success('Role successfully updated!');
      } else {
        toastr.error('Role already exist!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

RoleManagementNS.deleteRole = function () {
  $.ajax({
    url: 'api/role/' + RoleManagementNS.RoleId,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      $("#delete-role-dismiss").trigger("click");
      $("#role-grid").data("kendoGrid").dataSource.read();
      if (data != false && data != "false") {
        $('#role-edit-description').val(null);
        $('#role-edit-name').val(null);
        $('#edit-role-popup').prop('disabled', true);
        $('#delete-role-popup').prop('disabled', true);
        toastr.success('Role successfully deleted!');
      } else {
        toastr.error('Error in deleting role!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
};

RoleManagementNS.selectFirstItem = function () {
  var grid = $("#role-grid").data("kendoGrid");
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


RoleManagementNS.populateAddAccessMappings = function () {
  $.ajax({
    url: "api/access/availableMappingList",
    type: 'GET',
  }).done(function (result) {
    RoleManagementNS.initializeAddAccessMappingGrid(result);
  }).fail(function () {
    toastr.error('Something went wrong with the request!');
  });
}


RoleManagementNS.populateEditAccessMappings = function () {
  RoleManagementNS.initializeEditAccessMappingGrid();
}

RoleManagementNS.initializeAddAccessMappingGrid = function (dataSource) {

  var grid1 = $("#add-available-access-mapping-grid").kendoGrid({
    dataSource: dataSource,
    columns: [
      { field: "accessId", title: "AccessId", hidden: true },
      { field: "name", title: "Name", width: "50px" },
      { field: "category", title: "Category", width: "50px" },
    ],
    selectable: "row",
    filterable: {
      extra: false,
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
        }
      }
    },
    scrollable: true,
    sortable: true,
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

  var grid2 = $("#add-selected-access-mapping-grid").kendoGrid({
    dataSource: [],
    columns: [
      { field: "accessId", title: "AccessId", hidden: true },
      { field: "name", title: "Name", width: "50px" },
      { field: "category", title: "Category", width: "50px" },
    ],
    selectable: "row",
    filterable: {
      extra: false,
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
        }
      }
    },
    scrollable: true,
    sortable: true,
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

  $('#add-mapped-access-to-available').click(function (e) {
    var grid = $("#add-selected-access-mapping-grid").data("kendoGrid");
    currentSelection = grid.select();
    if (grid.select().length >= 1) {
      currentSelection.each(function (index, row) {
        var selectedItem = grid.dataItem(row);
        var dataSource = $("#add-available-access-mapping-grid").data().kendoGrid.dataSource;
        dataSource.add({
          accessId: selectedItem.accessId ? selectedItem.accessId : null,
          name: selectedItem.name ? selectedItem.name : null,
          category: selectedItem.category ? selectedItem.category : null,
        });
        grid.dataSource.remove(selectedItem);
      })
    }
    e.preventDefault();
  });

  $('#add-available-access-to-selected').click(function (e) {
    var grid = $("#add-available-access-mapping-grid").data("kendoGrid");
    currentSelection = grid.select();
    if (grid.select().length >= 1) {
      grid.select().each(function () {
        var dataItem = grid.dataItem($(this));
        var dataSource = $("#add-selected-access-mapping-grid").data().kendoGrid.dataSource;
        dataSource.add({
          accessId: dataItem.accessId ? dataItem.accessId : null,
          name: dataItem.name ? dataItem.name : null,
          category: dataItem.category ? dataItem.category : null,
        });
        grid.dataSource.remove(dataItem);
      });
    }
    e.preventDefault();
  });
}

RoleManagementNS.initializeEditAccessMappingGrid = function () {

  var grid1 = $("#edit-available-access-mapping-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/role/unmapped/" + RoleManagementNS.RoleId,
          dataType: "json"
        },
      },
    },
    columns: [
      { field: "accessId", title: "AccessId", hidden: true },
      { field: "name", title: "Name", width: "50px" },
      { field: "category", title: "Category", width: "50px" },
    ],
    filterable: {
      extra: false,
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
        }
      }
    },
    selectable: "row",
    sortable: true,
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

  var grid2 = $("#edit-selected-access-mapping-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/role/mapped/" + RoleManagementNS.RoleId,
          dataType: "json"
        },
      },
    },
    columns: [
      { field: "accessId", title: "AccessId", hidden: true },
      { field: "name", title: "Name", width: "50px" },
      { field: "category", title: "Category", width: "50px" },
    ],
    selectable: "row",
    selectable: "row",
    filterable: {
      extra: false,
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
        }
      }
    },
    scrollable: true,
    sortable: true,
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

  $('#edit-mapped-access-to-available').click(function (e) {
    var grid = $("#edit-selected-access-mapping-grid").data("kendoGrid");
    currentSelection = grid.select();
    if (grid.select().length >= 1) {
      currentSelection.each(function (index, row) {
        var selectedItem = grid.dataItem(row);
        var dataSource = $("#edit-available-access-mapping-grid").data().kendoGrid.dataSource;
        dataSource.add({
          accessId: selectedItem.accessId,
          name: selectedItem.name,
          category: selectedItem.category
        });
        grid.dataSource.remove(selectedItem);
      })
    }
    e.preventDefault();
  });

  $('#edit-available-access-to-selected').click(function (e) {
    var grid = $("#edit-available-access-mapping-grid").data("kendoGrid");
    currentSelection = grid.select();
    if (grid.select().length >= 1) {
      grid.select().each(function () {
        var dataItem = grid.dataItem($(this));
        var dataSource = $("#edit-selected-access-mapping-grid").data().kendoGrid.dataSource;
        dataSource.add({
          accessId: dataItem.accessId ? dataItem.accessId : null,
          name: dataItem.name ? dataItem.name : null,
          category: dataItem.category
        });
        grid.dataSource.remove(dataItem);
      });
    }
    e.preventDefault();
  });
}
