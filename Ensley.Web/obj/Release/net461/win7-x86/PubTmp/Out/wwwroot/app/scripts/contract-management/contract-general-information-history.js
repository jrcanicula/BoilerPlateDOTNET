var ContractGeneralInformationHistoryNS = {};
ContractGeneralInformationHistoryNS.VendorId = null;

ContractGeneralInformationHistoryNS.InitializeControl = function (id) {
  ContractGeneralInformationHistoryNS.ContractId = id;
  ContractGeneralInformationHistoryNS.LoadControls(id);
};

ContractGeneralInformationHistoryNS.DataBound = function (e) {

};

ContractGeneralInformationHistoryNS.LoadControls = function (id) {

  $("#contract-alert-history-item").click(function () {
    ContractGeneralInformationHistoryNS.getAlertHistory();
  });

  $("#contract-permission-history-item").click(function () {
    ContractGeneralInformationHistoryNS.getPermissionHistory();
  });

  $("#contract-details-history-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/contract/" + ContractGeneralInformationHistoryNS.ContractId + "/contractdetialshistory",
          dataType: "json"
        }
      },
      schema: {
        model: {
          fields: {
            title: { type: "string" },
            description: { type: "string" },
            startDate: { type: "date" },
            endDate: { type: "date" },
            location: { type: "string" },
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
        field: "title",
        title: "title",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        }
      },
      {
        field: "description",
        title: "Description",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        }
      },
      {
        field: "startDate",
        title: "Start Date",
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
        field: "endDate",
        title: "End Date",
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
        field: "location",
        title: "Location",
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


ContractGeneralInformationHistoryNS.getPermissionHistory = function () {
  $("#contract-permission-history-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/contract/" + ContractGeneralInformationHistoryNS.ContractId + "/contractpermissionhistory",
          dataType: "json"
        }
      },
      schema: {
        model: {
          fields: {
            name: { type: "string" },
            canRead: { type: "number" },
            canWrite: { type: "number" },
            canSign: { type: "number" },
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
        },
      },
      {
        field: "canRead",
        title: "Can Read?",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        template: '<div><span> #=canRead == 1 ? "Yes" : "No" # </span></div>',
      },
      {
        field: "canWrite",
        title: "Can Write?",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        template: '<div><span> #=canWrite == 1 ? "Yes" : "No" # </span></div>',
      },
      {
        field: "canSign",
        title: "Can Sign?",
        width: 120,
        filterable: {
          cell: {
            operator: "contains",
            suggestionOperator: "contains"
          }
        },
        template: '<div><span> #=canSign == 1 ? "Yes" : "No" # </span></div>',
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


ContractGeneralInformationHistoryNS.getAlertHistory = function () {

  $("#contract-alert-history-grid").kendoGrid({
    dataSource: {
      transport: {
        read: {
          url: "api/contract/" + ContractGeneralInformationHistoryNS.ContractId + "/contractalertshistory",
          dataType: "json"
        }
      },
      schema: {
        model: {
          fields: {
            value: { type: "string" },
            duration: { type: "int" },
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
        field: "duration",
        title: "Duration",
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