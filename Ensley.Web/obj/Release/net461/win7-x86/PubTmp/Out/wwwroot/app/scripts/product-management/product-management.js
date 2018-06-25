var ProductManagementNS = {};
ProductManagementNS.ExcelURL = null;
ProductManagementNS.ProductMatrixId = null;

ProductManagementNS.init = function () {
  ProductManagementNS.hookup();
  $("h3#page-title").text("Product Management");
}

ProductManagementNS.onChange = function onChange(arg) {
  var text = "";
  var grid = this;

    if (grid.select().length >= 1) {
        grid.select().each(function () {
            var dataItem = grid.dataItem($(this));
            ProductManagementNS.ProductMatrixId = dataItem.productMatrixId;
            $('#product-edit-code').val(dataItem.code);
            $('#product-edit-name').val(dataItem.name);
            $("#product-edit-productType").data("kendoComboBox").value(dataItem.productTypeId);
            $("#product-edit-productLicenseMetric").data("kendoComboBox").value(dataItem.productLicenseMetricId);
            $("#product-edit-productLicenseTerm").data("kendoComboBox").value(dataItem.productLicenseTermId);
            $("#product-edit-productUnitPrice").data("kendoNumericTextBox").value(dataItem.unitPrice);
            $("#product-edit-productDiscount").data("kendoNumericTextBox").value(dataItem.discount);

            $('#edit-product-popup').prop('disabled', false);
            $('#delete-product-popup').prop('disabled', false);
        });
    } else {
        ProductManagementNS.ProductMatrixId = null;
        $('#product-edit-code').val(null);
        $('#product-edit-name').val(null);
        $('#product-edit-productType').val(null);
        $('#product-edit-productLicenseMetric').val(null);
        $('#product-edit-productLicenseTerm').val(null);
        $("#product-edit-productUnitPrice").val(null);
        $("#product-edit-productDiscount").val(null);

    $('#edit-product-popup').prop('disabled', true);
    $('#delete-product-popup').prop('disabled', true);
  }
}

ProductManagementNS.populateProduct = function () {
  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: "api/product/productMatrixList",
        dataType: "json"
      }
    },
    batch: true,
    pageSize: 10,
    schema: {
      model: {
        id: "productMatrixId",
        fields: {
          productMatrixId: { editable: false, type: "guid" },
          code: { validation: { required: true } },
          name: { validation: { required: true } },
          productTypeName: { validation: { required: true } }
        }
      }
    }
  });

    $("#product-grid").kendoGrid({
        dataSource: dataSource,
        selectable: true,
        pageable: true,
        columns: [
            {
                field: "productMatrixId", title: "ProductMatrixId", hidden: true
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
                field: "productTypeName",
                title: "Type"
            },
            {
                field: "productLicenseMetricName",
                title: "License Metric"
            },
            {
                field: "productLicenseTermName",
                title: "License Term"
            },
            {
                field: "unitPrice",
                title: "Unit Price"
            },
            {
                field: "discount",
                title: "Discount %",
            },
            {
                field: "modifiedBy",
                title: "Modified By"
            },
            {
                field: "modifiedDate",
                title: "Modified Date",
                filterable: false,
                template: '#= kendo.toString(kendo.parseDate(modifiedDate), "MM/dd/yyyy")#'
            },
        ],
        scrollable: false,
        sortable: true,
        change: ProductManagementNS.onChange,
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

ProductManagementNS.initEditor = function () {
    $(".productTypeComboBox").kendoComboBox({
        dataTextField: "name",
        dataValueField: "productTypeId",
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
                    url: 'api/product/productTypeList'
                }
            }
        },
        suggest: true
    });

  $(".productLicenseMetricComboBox").kendoComboBox({
    dataTextField: "name",
    dataValueField: "productLicenseMetricId",
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
          url: 'api/product/productLicenseMetric'
        }
      }
    },
    suggest: true
  });

    $(".productLicenseTermComboBox").kendoComboBox({
        dataTextField: "name",
        dataValueField: "productLicenseTermId",
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
                    url: 'api/product/productLicenseTerm'
                }
            }
        },
        suggest: true
    });

    $(".productUnitPriceNumericTextBox").kendoNumericTextBox();
    $(".productDiscountNumericTextBox").kendoNumericTextBox();
}

ProductManagementNS.hookup = function () {
  var createProductValidator = $("#form-product-create").kendoValidator().data("kendoValidator");
  var updateProductValidator = $("#form-product-edit").kendoValidator().data("kendoValidator");

    ProductManagementNS.initEditor();

    $("#add-product-popup").click(function (e) {
        $('#product-add-code').val(null);
        $('#product-add-name').val(null);
        $('#product-add-productType').data("kendoComboBox").value("");
        $('#product-add-productLicenseMetric').data("kendoComboBox").value("");
        $('#product-add-productLicenseTerm').data("kendoComboBox").value("");
        $("#product-add-productUnitPrice").data("kendoNumericTextBox").value("");
        $("#product-add-productDiscount").data("kendoNumericTextBox").value("");
        createProductValidator.hideMessages();
    });

    $('#edit-product-popup').on('hidden.bs.modal', function () {
        updateProductValidator.hideMessages();
        createProductValidator.hideMessages();
    });

    $("#edit-product-dismiss").click(function (e) {
        var grid = $("#product-grid").data("kendoGrid");
        grid.clearSelection();
        updateProductValidator.hideMessages();
        createProductValidator.hideMessages();
    });

    $("form#form-product-create").submit(function (e) {
        e.preventDefault();

        if (createProductValidator.validate()) {
            var model = {};
            model.ProductMatrixId = null;
            model.Name = $('#product-add-name').val();
            model.Code = $('#product-add-code').val();
            model.ProductTypeId = $('#product-add-productType').val().toLowerCase();
            model.ProductLicenseMetricId = $('#product-add-productLicenseMetric').val().toLowerCase();
            model.ProductLicenseTermId = $('#product-add-productLicenseTerm').val().toLowerCase();
            model.UnitPrice = $("#product-add-productUnitPrice").data("kendoNumericTextBox").value();
            model.Discount = $("#product-add-productDiscount").data("kendoNumericTextBox").value();

            ProductManagementNS.createProduct(model);
        }
    });

    $("form#form-product-edit").submit(function (e) {
        e.preventDefault();

        if (updateProductValidator.validate()) {
            var model = {};
            model.ProductMatrixId = ProductManagementNS.ProductMatrixId;
            model.Code = $('#product-edit-code').val();
            model.Name = $('#product-edit-name').val();
            model.ProductTypeId = $('#product-edit-productType').val().toLowerCase();
            model.ProductLicenseMetricId = $('#product-edit-productLicenseMetric').val().toLowerCase();
            model.ProductLicenseTermId = $('#product-edit-productLicenseTerm').val().toLowerCase();
            model.UnitPrice = $("#product-edit-productUnitPrice").data("kendoNumericTextBox").value();
            model.Discount = $("#product-edit-productDiscount").data("kendoNumericTextBox").value();

            ProductManagementNS.updateProduct(model);
        }
    });

    $("#delete-product").click(function (e) {
        ProductManagementNS.deleteProduct();
    });

  ProductManagementNS.populateProduct();
}

ProductManagementNS.createProduct = function (model) {
  $.ajax({
    url: 'api/product/productMatrix',
    type: 'POST',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#save-product-dismiss").trigger("click");
        $("#product-grid").data("kendoGrid").dataSource.read();

                $('#product-add-code').val(null);
                $('#product-add-name').val(null);
                $('#product-add-productType').data("kendoComboBox").value("");
                $('#product-add-productLicenseMetric').data("kendoComboBox").value("");
                $('#product-add-productLicenseTerm').data("kendoComboBox").value("");
                $("#product-add-productUnitPrice").data("kendoNumericTextBox").value("");
                $("#product-add-productDiscount").data("kendoNumericTextBox").value("");

        $('#edit-product-popup').prop('disabled', true);
        $('#delete-product-popup').prop('disabled', true);
        toastr.success('Product successfully added');
      } else {
        toastr.error('Product already exist!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });

}

ProductManagementNS.updateProduct = function (model) {
  $.ajax({
    url: 'api/product/productMatrix/' + ProductManagementNS.ProductMatrixId,
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#edit-product-dismiss").trigger("click");
        $("#product-grid").data("kendoGrid").dataSource.read();

                $('#product-add-code').val(null);
                $('#product-add-name').val(null);
                $('#product-add-productType').data("kendoComboBox").value("");
                $('#product-add-productLicenseMetric').data("kendoComboBox").value("");
                $('#product-add-productLicenseTerm').data("kendoComboBox").value("");
                $("#product-add-productUnitPrice").data("kendoNumericTextBox").value("");
                $("#product-add-productDiscount").data("kendoNumericTextBox").value("");

        $('#edit-product-popup').prop('disabled', true);
        $('#delete-product-popup').prop('disabled', true);
        toastr.success('Product successfully updated!');
      } else {
        toastr.error('Product already exist!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

ProductManagementNS.deleteProduct = function () {
  $.ajax({
    url: 'api/product/productMatrix/' + ProductManagementNS.ProductMatrixId,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#delete-product-dismiss").trigger("click");
        $("#product-grid").data("kendoGrid").dataSource.read();
        $('#edit-product-popup').prop('disabled', true);
        $('#delete-product-popup').prop('disabled', true);
        toastr.success('Product successfully deleted!');
      } else {
        toastr.error('Error deleting product!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

ProductManagementNS.uploadProduct = function () {
    var fdata = new FormData();
    var fileUpload = $("#upload-product-file").get(0);
    var files = fileUpload.files;
    fdata.append(files[0].name, files[0]);

    var control = $("#upload-product-file");

    $.ajax({
        type: "POST",
        url: "api/product/productUpload",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        data: fdata,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.result != false || response != "False" || response != "false") {
                if (response.isUploaded === true || response.isUploaded === "True" || response.isUploaded === "true") {
                    toastr.success(response.result);
                    $("#product-grid").data("kendoGrid").dataSource.read();
                }
                else {
                    toastr.error(response.result);
                }
            }
            else {
                toastr.error("Something's wrong with the excel sheet you upload.");
            }

            $('#upload-product-file').val(''); 
            $('#product-upload-popup').modal('toggle');
        },
        error: function (e) {
            toastr.error("Something's wrong with the excel sheet you upload.");
        }
    });
}