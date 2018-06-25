var ContractManagementNS = {};
ContractManagementNS.Mode = 0;
ContractManagementNS.ContractID = null;

ContractManagementNS.init = function () {
  ContractManagementNS.initializeControls();
  ContractManagementNS.showVendors();
}


ContractManagementNS.initializeControls = function () {
  $("h3#page-title").text("My Contracts");
}

ContractManagementNS.showVendors = function () {
  var element = $("#contractGrid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/contract/vendorList",
          dataType: "json"
        }
      },
      pageSize: 20,
      serverPaging: true,
      serverSorting: true
    },
    sortable: true,
    pageable: true,
    filterable: true,
    detailInit: detailInit,
    dataBound: function () {
    },
    columns: [
      {
        field: "vendorName",
        title: "Vendor Name",
        template: "<div>#= vendorName #</div>",
        width: "150px",
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
        template: "<div style='text-align: right;'>#: noOfActiveContracts #</div>",
        width: "135px",
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
      {
        field: "noOfLicenses",
        title: "Licenses",
        template: "<div style='text-align: right;'>#= noOfLicenses #</div>",
        width: "90px",
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
      {
        field: "vendorContact",
        title: "Vendor Contact",
        template: "<div>#= vendorContact #</div>",
        width: "180px",
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
        field: "status",
        title: "Status",
        template: "<div style='text-align: center;'>#= status #</div>",
        headerAttributes: {
          style: "text-align: center"
        },
        width: "90px",
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
        field: "noOfAmendments",
        title: "Amendments",
        template: "<div style='text-align: right;'>#= noOfAmendments #</div>",
        width: "100px",
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
      {
        field: "noOfAlerts",
        title: "Alerts",
        template: "<center><div class='badge bg-red'>#= noOfAlerts #</div></center>",
        headerAttributes: {
          style: "text-align: center"
        },
        width: "90px",
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
      {
        field: "actions",
        title: "Actions",
        template: "<div style='text-align:center'><span style='text-align: center; cursor:pointer'><i onclick=\"VendorManagementNS.showEditVendor('#= vendorId #')\" class='fas fa-pencil-alt'></i></span> &nbsp; &nbsp; &nbsp; <span style='text-align: center; cursor:pointer'><i onclick=\"ContractManagementNS.showAddContract('#= vendorId #',null)\" class='fas fa-plus'></i></span></div>",
        headerAttributes: {
          style: "text-align: center"
        },
        width: "90px",
      }
    ]
  });
}

function detailInit(e) {
  $("<div/>").appendTo(e.detailCell).kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/contract/contractList?vendorId=" + e.data.vendorId,
          dataType: "json"
        }
      },
      serverPaging: true,
      serverSorting: true,
      serverFiltering: true,
      pageSize: 10,
    },
    scrollable: false,
    sortable: true,
    pageable: true,
    columns: [
      { field: "title", title: "Name", template: "<div'>#= title #</div>", width: "250px" },
      { field: "status", title: "Status", template: "<div style='text-align: center;'>#= status #</div>", width: "90px", headerAttributes: { style: "text-align: center" } },
      { field: "startDate", title: "Start Date", template: "<div'>#= kendo.toString(kendo.parseDate(startDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #</div>", width: "130px" },
      { field: "endDate", title: "End Date", template: "<div'>#= kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yyyy') #</div>", width: "130px" },
      { field: "noOfLicenses", title: "Quantity", template: "<div style='text-align: center;'>#= noOfLicenses #</div>", width: "50px", headerAttributes: { style: "text-align: center" } },
      { field: "noOfApp", title: "App", template: "<div style='text-align: center;'>#= noOfApp #</div>", width: "50px", headerAttributes: { style: "text-align: center" } },
      {
        field: "actions",
        title: "Actions",
        template: "<div style='text-align: center; cursor:pointer'><i onclick=\"ContractManagementNS.showEditContract('#= contractId #')\" class='fas fa-pencil-alt'></i></div>",
        headerAttributes: {
          style: "text-align: center"
        },
        width: "90px"
      }
    ]
  });
}

ContractManagementNS.showAddContract = function (vendorId, contractId) {
  ContractManagementNS.Mode = 0; 
  ContractWizardNS.initializeWizard(vendorId, contractId);
  $('#contractModal').modal('show');
}

ContractManagementNS.showEditContract = function (vendorId, contractId) {
  ContractManagementNS.ContractID = contractId;
  ContractManagementNS.Mode = 1;
  ContractWizardNS.initializeWizard(vendorId, contractId);
  $('#contractModal').modal('show');
}

ContractManagementNS.save = function () {
  if (ContractManagementNS.Mode == 1) {
  }
  else {
  }

  toastr.success('Succesfully Saved');
}

