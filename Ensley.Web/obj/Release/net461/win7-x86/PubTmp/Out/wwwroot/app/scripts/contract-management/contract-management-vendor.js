var ContractManagementVendorNS = {};
ContractManagementVendorNS.Mode = 0;
ContractManagementVendorNS.ContractId = null;
ContractManagementVendorNS.ContractPaymentId = '';
ContractManagementVendorNS.PaymentApprovedAction = false;

ContractManagementVendorNS.init = function () {
  ContractManagementVendorNS.initializeControls();
  ContractManagementVendorNS.showVendors();
}

ContractManagementVendorNS.initializeControls = function () {
  $("h3#page-title").text("My Contracts");
}

ContractManagementVendorNS.showVendors = function () {
  var element = $("#contractGrid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/contract/clientlist",
          dataType: "json"
        }
      },
      pageSize: 20
    },
    sortable: true,
    pageable: true,
    filterable: true,
    detailTemplate: kendo.template($("#contract-template").html()),
    dataBound: function databound(e) {
      $('[data-toggle="tooltip"]').tooltip();
    },
    detailInit: detailInitVendor,
    columns: [
      {
        field: "vendorName",
        title: "Client Name",
        template: '<div><span style="cursor:pointer" data-toggle="tooltip" data-placement="top" data-html="true" title="<img src=\'#=imageURL#\'/ height=\'20\' width=\'20\'> #=vendorEmail#" > #= vendorName #</span></div>',
        filterable: {
          extra: false,
          operators: {
            string: {
              contains: "Contains"
            }
          }
        }
      },
      {
        field: "vendorContact",
        title: "Primary Contact",
        template: '<div><span style="cursor:pointer" data-toggle="tooltip" data-placement="top" data-html="true" title=" #=email # <br/> #=contactNo#"> #=vendorContact ? vendorContact : "" # </span></div>',
        filterable: {
          extra: false,
          operators: {
            string: {
              contains: "Contains"
            }
          }
        }
      },
      {
        field: "noOfActiveContracts",
        title: "Active Contracts",
        width: "140px",
        template: '<div style="text-align:right; color: #: noOfActiveContracts  > 0 ? "green" : "red" #">#: noOfActiveContracts #</div>',
        filterable: {
          mode: "row",
          extra: false,
          operators: {
            string: {
              eq: "Is equal to",
              neq: "Is not equal to"
            }
          }
        },
      },
      {
        field: "totalContractValue",
        title: "Total Contract Value",
        template: '<center><div style="text-align:right; color: #: totalContractValue  > 0 ? "green" : "red" #">$#=totalContractValue != null ? totalContractValue: 0 #</div></center>',
        width: "160px",
        filterable: {
          extra: false,
          operators: {
            string: {
              eq: "Is equal to",
              neq: "Is not equal to"
            }
          }
        },
      },
      {
        field: "noOfAlerts",
        title: "Alerts",
        template: '<center><div data-toggle="tooltip" data-placement="top" title="#= noOfAlerts  > 0 ? \'View alerts\' : \'No alerts\' #" onclick=\'ContractManagementVendorNS.showVendorAlerts("#= vendorId #","#= noOfAlerts #" )\' class="#: noOfAlerts  > 0 ? "badge badge-red" : "badge badge-gray" #"> #= noOfAlerts #  </div></center>',
        headerAttributes: {
          style: "text-align: center"
        },
        width: "120px",
        filterable: {
          extra: false,
          operators: {
            string: {
              eq: "Is equal to",
              neq: "Is not equal to"
            }
          }
        }
      },
    ]
  });
}

function detailInitVendor(e) {
  var detailRow = e.detailRow;
  detailRow.find(".contracts-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/contract/clientContractList/" + e.data.vendorId,
          dataType: "json"
        }
      },
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
      pageSize: 10,
      sortable: true,
      pageable: true,
      filterable: true,
    },
    dataBound: function databound(e) {
      $('[data-toggle="tooltip"]').tooltip();
    },
    scrollable: false,
    sortable: true,
    pageable: true,
    columns: [
      {
        field: "title",
        title: "Name",
        template: '<div><span style="cursor:pointer" data-toggle="tooltip" data-placement="top" data-html="true" title=" #=description # "> #=title# </span></div>',
        width: "250px",
      },
      {
        field: "status",
        title: "Status",
        template: "<div style='text-align: center;color:#: status == 'Draft' ?'blue':'green'#\" '> #=status# </div>",
        width: "100px",
        headerAttributes: { style: "text-align: center" }
      },
      {
        field: "payment",
        title: "Payment",
        template: "<div onclick=\"ContractManagementVendorNS.showPayment('#= contractId #')\" style='text-align:center; cursor:pointer; color:#: payment != 'Pending Payment' ? 'green' : 'red' #'>#=payment#</div>",
        width: "110px",
        headerAttributes: { style: "text-align: center" }
      },
      {
        field: "startDate",
        title: "Start Date",
        template: "<div'>#= kendo.toString(kendo.parseDate(startDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #</div>",
        width: "110px"
      },
      {
        field: "endDate",
        title: "End Date",
        template: "<div'>#= kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #</div>",
        width: "110px"
      },
      {
        field: "ammendments",
        title: "Amendments",
        template: "<div style='text-align: right; color: #: ammendments == 0 ? 'green' : 'red' #'><span data-toggle='tooltip' data-placement='top' title='#= ammendments  > 0 ? \"View amendments\" : \"No amendments\" #' onclick=\"ContractManagementVendorNS.showAmmendments('#= contractId #', '#=ammendments#')\"> #=ammendments#</span></div>",
        width: "110px"
      },
      {
        field: "addProduct",
        title: "Add Product",
        template: "<div style='text-align: center; cursor:pointer'><i onclick=\"ContractManagementVendorNS.addProduct('" + e.data.vendorId + "','#= contractId #','#=status#','#=title#')\" class='fas fa-cube'></i></div>",
        width: "110px"
      },
      {
        field: "actions",
        title: "Edit Contract",
        template: "<div style='text-align:center; cursor:pointer'><i onclick=\"ContractManagementVendorNS.showEditContract('" + e.data.vendorId + "','#= contractId #','#=status#','#=title#')\" class='fas fa-pencil-alt'></i></div>",
        headerAttributes: {
          style: "text-align: center"
        },
        width: "100px"
      }
    ]
  });
}

ContractManagementVendorNS.showAddContract = function (vendorId, contractId) {
  $("#lblContractNameValue").text("TBD");
  $("#lblContractStatus").text("Draft");
  ContractManagementNS.Mode = 0;
  ContractManagementVendorNS.Mode = 0;
  ContractWizardNS.initializeWizard(vendorId, contractId, 1);
  $('#contractModal').modal('show');
}

ContractManagementVendorNS.showVendorAlerts = function (vendorId, alertCount) {
  if (parseInt(alertCount) > 0) {
    $('#my-vendor-alerts-grid').modal('show');
  }
}

ContractManagementVendorNS.showEditContract = function (vendorId, contractId, status, title) {
  ContractManagementVendorNS.ContractId = contractId;
  ContractManagementVendorNS.Mode = 1;
  ContractWizardNS.initializeWizard(vendorId, contractId, 1);
  $("#lblContractStatus").text(status);
  $("#lblContractNameValue").text(title);
  $('#contractModal').modal('show');
}

ContractManagementVendorNS.addProduct = function (vendorId, contractId, status, title) {
  ContractWizardNS.initializeWizard(vendorId, contractId, 3);
  $("#lblContractStatus").text(status);
  $("#lblContractNameValue").text(title);
};

ContractManagementVendorNS.showAmmendments = function (contractId, ammendmentsCount) {
  if (parseInt(ammendmentsCount) > 0) {
    $('#my-contract-ammendments-grid').modal('show');
  }
};

ContractManagementVendorNS.showPayment = function (contractId) {
  ContractManagementVendorNS.ContractId = contractId;
  ContractManagementVendorNS.initEditor();
  ContractManagementVendorNS.populateContractPayment();
  $('#my-contract-payment').modal('show');
  $("#vendor-approval-form").hide();
  $("#vendor-payment-button").hide();
};

ContractManagementVendorNS.initEditor = function () {
  $('#my-contract-payment').on('hidden.bs.modal', function () {
    if (ContractManagementVendorNS.PaymentApprovedAction != false) {
      $("#contractGrid").data("kendoGrid").dataSource.read();
      ContractManagementVendorNS.PaymentApprovedAction = false;
    }
  })
}


ContractManagementVendorNS.populateContractPayment = function () {
  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: "api/contract/getContractPaymentByContractId/" + ContractManagementVendorNS.ContractId,
        dataType: "json"
      }
    },
    batch: false,
    pageSize: 10,
    schema: {
      model: {
        id: "contractPaymentId",
        fields: {
          contractPaymentId: { editable: false, type: "guid" },
          purchaseOrderNo: { editable: false, validation: { required: true } },
          datePurchase: { editable: false, validation: { required: true } },
          status: { editable: false, validation: { required: true } },
          dateReceive: { editable: false, validation: { required: true } },
          attachmentURL: { editable: false, validation: { required: true } },
          attachmentName: { editable: false, validation: { required: true } },
          remark: { editable: false, validation: { required: true } },
        }
      }
    }
  });

  $("#my-contract-payment-grid").kendoGrid({
    dataSource: dataSource,
    pageable: true,
    columns: [
      {
        field: "contractPaymentId", title: "ContractProductId", hidden: true
      },
      {
        field: "purchaseOrderNo",
        title: "Purchase Order No"
      },
      {
        field: "datePurchase",
        title: "Date Purchase",
        template: '#if(datePurchase != null) {# #= kendo.toString(kendo.parseDate(datePurchase), "MM/dd/yyyy")# #} else {#<span> </span>#}#'
      },
      {
        field: "status",
        title: "Status",
        template: "<div style='text-align: left;color:#: status == 'Approved' ? 'green' : status == 'Waiting for Approval' ? 'blue' : 'red'  # '> #=status# </div>"
      },
      {
        field: "dateReceive",
        title: "Date Receive",
        template: '#if(dateReceive != null) {# #= kendo.toString(kendo.parseDate(dateReceive), "MM/dd/yyyy")# #} else {#<span> </span>#}#'
      },
      {
        field: "attachmentName",
        title: "Attachment",
        template: '<a href="#=attachmentURL#"> #=attachmentName# </a>'
      },
      {
        field: "remark",
        title: "Remark"
      },
      {
        field: " ",
        title: "Action",
        width: "50px",
        filterable: false,
        template: "#if(status != 'Approved') {#<center><span class='fas fa-pencil-alt' style='text-align: center; cursor:pointer' onclick=\"ContractManagementVendorNS.editPurchaseOrder('#= purchaseOrderNo #' ,'#= contractPaymentId #')\" > </span></center># } else {#<center><span class='fas fa-pencil-alt' style='cursor: not-allowed;'> </span></center>#}#"
      },
      {
        field: " ",
        title: "Delete",
        width: "50px",
        filterable: false,
        template: "#if(status == 'Waiting for Approval') {#<center><span class='fas fa-trash' style='text-align: center; cursor:pointer' onclick=\"ContractManagementNS.deletePurchaseOrder('#= contractPaymentId #')\" > </span></center># } else {#<center><span class='fas fa-trash' style='cursor: not-allowed;'> </span></center>#}#"
      }],
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
    pageable: true
  });
}

ContractManagementVendorNS.editPurchaseOrder = function (purchaseOrderNo, contractPaymentId) {
  ContractManagementVendorNS.ContractPaymentId = contractPaymentId;
  $("#purchaseOrderLabel span").text(purchaseOrderNo);
  $("#vendor-approval-form").show();
  $("#vendor-payment-button").show();
}

ContractManagementVendorNS.purcharseOrderApproval = function (action) {
  var model = {};
  model.ContractPaymentId = ContractManagementVendorNS.ContractPaymentId;
  model.Remark = $("#payment-remark").val();

  if (action == "approved") {
    model.Status = 2;
  }
  else if (action == "reject") {
    model.Status = 3;
  }

  $.ajax({
    url: 'api/contract/purchaseOrderApproval',
    type: 'POST',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#my-contract-payment-grid").data("kendoGrid").dataSource.read();
        $("#vendor-approval-form").hide();
        $("#vendor-payment-button").hide();

        ContractManagementVendorNS.PaymentApprovedAction = true;
        ContractManagementVendorNS.ContractPaymentId = '';
        $("#purchaseOrderLabel span").text('');
        $("#payment-remark").val(null);
      } else {
        toastr.error('Error deleting product!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  })
}
