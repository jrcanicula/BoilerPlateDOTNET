var VendorHistoryNS = {};
VendorHistoryNS.VendorId = null;

VendorHistoryNS.InitializeControl = function (id) {
  VendorHistoryNS.VendorId = id;
  VendorHistoryNS.LoadControls(id);
};

VendorHistoryNS.DataBound = function (e) {
  $("#saveVendor").focus();
  $('#vendorModal').animate({
    scrollTop: $("#saveVendor").offset().top
  }, {
      duration: 3000,
      specialEasing: {
        width: "linear",
        height: "easeOutBounce"
      }
    });
};

VendorHistoryNS.LoadControls = function (id) {
  $("#vendor-alert-history-item").click(function () {
    VendorHistoryNS.getAlertHistory();
  });

  $("#vendor-contact-history-item").click(function () {
    VendorHistoryNS.getContactHistory();
  });

  $("#vendor-history-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/vendor/" + VendorHistoryNS.VendorId + "/vendorhistory",
          dataType: "json"
        }
      },
      schema: {
        model: {
          fields: {
            name: { type: "string" },
            status: { type: "int" },
            description: { type: "string" },
            email: { type: "string" },
            address: { type: "string" },
            contactNo: { type: "string" },
            modifiedOn: { type: "date" },
            modifiedBy: { type: "string" },
            createdOn: { type: "date" },
            createdBy: { type: "string" },

          }
        }
      },
      pageSize: 10
    },
    noRecords: true,
    pageable: true,
    sortable: true,
    filterable: true,
    scrollable: false,
    messages: {
      noRecords: "History not yet available"
    },
    columns: [
      {
        field: "name",
        title: "Company",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        }
      },
      {
        field: "email",
        title: "Email",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        }
      },
      {
        field: "contactNo",
        title: "ContactNo",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        }
      },
      {
        field: "status",
        title: "Status",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        }
      },
      {
        field: "modifiedOn",
        title: "Modified On",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        format: "{0:MM/dd/yyyy h:mm:ss tt}",
      },
      {
        field: "modifiedBy",
        title: "Modified By",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
      },
      {
        field: "createdOn",
        title: "Created On",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        format: "{0:MM/dd/yyyy h:mm:ss tt}",
      },
      {
        field: "createdBy",
        title: "Created By",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        hidden: true
      },
    ]
  });

};


VendorHistoryNS.getContactHistory = function () {
  $("#vendor-contact-history-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/vendor/" + VendorHistoryNS.VendorId + "/vendorcontacthistory",
          dataType: "json"
        }
      },
      schema: {
        model: {
          fields: {
            type: { type: "string" },
            name: { type: "string" },
            status: { type: "string" },
            createdBy: { type: "string" },
            createdOn: { type: "date" },
            modifiedOn: { type: "date" },
            modifiedBy: { type: "string" },
          }
        }
      },
      pageSize: 10
    },
    noRecords: true,
    pageable: true,
    sortable: true,
    filterable: true,
    scrollable: false,
    messages: {
      noRecords: "History not yet available"
    },
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
        field: "type",
        title: "Type",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        }
      },
      {
        field: "status",
        title: "Status",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
      },
      {
        field: "createdOn",
        title: "Created On",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        format: "{0:MM/dd/yyyy h:mm:ss tt}",
      },
      {
        field: "createdBy",
        title: "Created By",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
      },
      {
        field: "modifiedOn",
        title: "Modified On",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        format: "{0:MM/dd/yyyy h:mm:ss tt}",
      },
      {
        field: "modifiedBy",
        title: "Modified By",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
      },
    ]
  });
}


VendorHistoryNS.getAlertHistory = function () {
  $("#vendor-alert-history-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/vendor/" + VendorHistoryNS.VendorId + "/vendoralerthistory",
          dataType: "json"
        }
      },
      schema: {
        model: {
          fields: {
            value: { type: "string" },
            name: { type: "string" },
            emails: { type: "string" },
            createdBy: { type: "string" },
            createdOn: { type: "date" },
            modifiedOn: { type: "date" },
            modifiedBy: { type: "string" },
          }
        }
      },
      pageSize: 10
    },
    noRecords: true,
    pageable: true,
    sortable: true,
    filterable: true,
    scrollable: false,
    messages: {
      noRecords: "History not yet available"
    },
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
        field: "value",
        title: "Value",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        }
      },
      {
        field: "createdOn",
        title: "Created On",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        format: "{0:MM/dd/yyyy h:mm:ss tt}",
      },
      {
        field: "createdBy",
        title: "Created By",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
      },
      {
        field: "modifiedOn",
        title: "Modified On",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        format: "{0:MM/dd/yyyy h:mm:ss tt}",
      },
      {
        field: "modifiedBy",
        title: "Modified By",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
      },
    ]
  });
}