var ContractProductNS = {};
ContractProductNS.ContractID = null;
ContractProductNS.IsClient = null;

ContractProductNS.init = function (contractId, isClient) {
  ContractProductNS.ContractID = contractId;
  ContractProductNS.IsClient = parseBoolean(isClient);
  ContractProductNS.hookup();
}

ContractProductNS.hookup = function () {
  ContractProductNS.initComboBox();
  ContractProductNS.populateContractProduct();

  if (!ContractProductNS.IsClient) {
    $("#add-contractProduct").hide();
  }
}

ContractProductNS.initComboBox = function () {
  $("#contractProduct-productMatrix").kendoComboBox({
    dataTextField: "name",
    dataValueField: "productMatrixId",
    change: function (e) {
      var widget = e.sender;
      if (widget.value() && widget.select() === -1) {
        widget.value("");
      }
    },
    dataSource: {
      transport: {
        read: {
          dataType: "json",
          url: 'api/contract/productMatrixList'
        }
      }
    },
    suggest: true
  });
}

ContractProductNS.populateContractProduct = function () {
  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: "api/contract/contractProduct/" + ContractProductNS.ContractID,
        dataType: "json"
      }
    },
    batch: false,
    pageSize: 10,
    schema: {
      model: {
        id: "contractProductId",
        fields: {
          contractProductId: { editable: false, type: "guid" },
          contractId: { editable: false, type: "guid" },
          productMatrixId: { editable: false, type: "guid" },
          code: { editable: false, validation: { required: true } },
          name: { editable: false, validation: { required: true } },
          productTypeId: { editable: true, type: "guid" },
          productTypeName: { editable: false, validation: { required: true } },
          productLicenseMetricId: { editable: true, type: "guid" },
          productLicenseMetricName: { validation: { required: true } },
          productLicenseTermId: { editable: true, type: "guid" },
          productLicenseTermName: { validation: { required: true } },
          quantity: { editable: ContractProductNS.IsClient, validation: { required: true } },
          unitPrice: { editable: true, validation: { required: true } },
          discount: { editable: true, validation: { required: true } },
          price: { editable: false, validation: { required: true } },
          edit: { editable: false },
          destroy: { editable: false }
        }
      }
    }
  });

  $("#contractProduct-grid").kendoGrid({
    dataSource: dataSource,
    pageable: true,
    columns: [
      {
        field: "contractProductId", title: "ContractProductId", hidden: true
      },
      {
        field: "code",
        title: "Product Code"
      },
      {
        field: "name",
        title: "Name"
      },
      {
        field: "productTypeId",
        title: "Type",
        editor: ContractProductNS.licenseTypeComboBoxEditor,
        template: "#=productTypeName#"
      },
      {
        field: "productLicenseMetricId",
        title: "License Metric",
        editor: ContractProductNS.licenseMetricComboBoxEditor,
        template: "#=productLicenseMetricName#"
      },
      {
        field: "productLicenseTermId",
        title: "License Term",
        editor: ContractProductNS.licenseTermComboBoxEditor,
        template: "#=productLicenseTermName#"

      },
      {
        field: "quantity",
        title: "Quantity",
        editor: ContractProductNS.numericTextBoxEditor
      },
      {
        field: "unitPrice",
        title: "Unit Price",
        width: "110px",
        editor: ContractProductNS.numericTextBoxEditor,
        hidden: ContractProductNS.IsClient
      },
      {
        field: "discount",
        title: "Discount %",
        width: "110px",
        editor: ContractProductNS.discountNumericTextBoxEditor,
        hidden: ContractProductNS.IsClient
      },
      {
        field: "price",
        title: "Price",
        width: "100px",
      },
      {
        field: "edit",
        title: "Edit",
        width: "50px",
        filterable: false,
        command: [{ name: "edit", text: { edit: " ", update: " ", cancel: " " } }]
      },
      {
        field: "destroy",
        title: "Delete",
        width: "50px",
        filterable: false,
        template: "<center>  <span class='fas fa-trash' style='text-align: center; cursor:pointer' onclick=\"ContractProductNS.deleteContractProduct('#= contractProductId #')\" > </span> </center>"
      }],
    editable: "inline",
    scrollable: false,
    sortable: true,
    filterable: {
      extra: false,
      operators: {
        string: {
          contains: "Contains",
          eq: "Is equal to",
        }
      }
    },
    pageable: true,
      save: function (e) {
          $.ajax({
            url: 'api/contract/contractProduct',
            type: 'PUT',
            data: JSON.stringify(e.model),
            contentType: 'application/json; charset=utf-8',
              success: function (data, textStatus, XMLHttpRequest) {
                $("#contractProduct-grid").data("kendoGrid").dataSource.read();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              toastr.error('Something went wrong with the request!');
            }
          })
     }
  });
}

ContractProductNS.licenseTypeComboBoxEditor = function (container, options) {
  $('<input data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoComboBox({
      dataTextField: "name",
      dataValueField: "productTypeId",
      dataSource: {
        transport: {
          read: {
            dataType: "json",
            url: 'api/product/productTypeList'
          }
        }
      }
    });
}

ContractProductNS.licenseTermComboBoxEditor = function (container, options) {
  $('<input data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoComboBox({
      dataTextField: "name",
      dataValueField: "productLicenseTermId",
      dataSource: {
        transport: {
          read: {
            dataType: "json",
            url: 'api/product/productLicenseTerm'
          }
        }
      }
    });
}

ContractProductNS.licenseMetricComboBoxEditor = function (container, options) {
  $('<input data-bind="value:' + options.field + '"/>')
    .appendTo(container)
    .kendoComboBox({
      dataTextField: "name",
      dataValueField: "productLicenseMetricId",
      dataSource: {
        transport: {
          read: {
            dataType: "json",
            url: 'api/product/productLicenseMetric'
          }
        }
      }
    });
}

ContractProductNS.numericTextBoxEditor = function (container, options) {
  $('<input data-bind="value:' + options.field + '" min="0"/>')
    .appendTo(container)
    .kendoNumericTextBox();
}

ContractProductNS.discountNumericTextBoxEditor = function (container, options) {
  $('<input data-bind="value:' + options.field + '" min="0" max="100"/>')
    .appendTo(container)
    .kendoNumericTextBox();
}

ContractProductNS.addContractProduct = function () {
    var selectedProduct = $("#contractProduct-productMatrix").data('kendoComboBox').dataItem().productMatrixId;
    var model = {};
    model.ProductMatrixId = selectedProduct;
    model.ContractId = ContractProductNS.ContractID;

  $.ajax({
    url: 'api/contract/contractProduct',
    type: 'POST',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
      success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#contractProduct-grid").data("kendoGrid").dataSource.read();
      }
      else {
        toastr.error('Error adding product!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  })
}

ContractProductNS.deleteContractProduct = function (contractProductId) {
  if (confirm("Are you sure you want to delete this item?")) {
    $.ajax({
      url: 'api/contract/contractProduct/' + contractProductId,
      type: 'DELETE',
      contentType: 'application/json; charset=utf-8',
      success: function (data, textStatus, XMLHttpRequest) {
        if (data != false && data != "false") {
          $("#contractProduct-grid").data("kendoGrid").dataSource.read();
        } else {
          toastr.error('Error deleting product!');
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        toastr.error('Something went wrong with the request!');
      }
    })
  }
}

function parseBoolean(string) {
  if (string.toLowerCase() == 'true') {
    return true;
  }
  else if (string.toLowerCase() == 'false') {
    return false;
  }
  else {
    return undefined;
  }
}