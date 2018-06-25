var ContractTemplateManagementNS = {};
ContractTemplateManagementNS.ContractTemplateId = '';

ContractTemplateManagementNS.init = function () {
    ContractTemplateManagementNS.populateTemplateList();
}

ContractTemplateManagementNS.populateTemplateList = function () {
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "api/contract/getAllContractTypeByEntityId",
                dataType: "json"
            }
        },
        batch: false,
        pageSize: 10,
        schema: {
            model: {
                id: "contractTemplateId",
                fields: {
                    contractTemplateId: { editable: false, type: "guid" },
                    title: { editable: false, validation: { required: true } },
                }
            }
        }
    });

    $("#contract-template-grid").kendoGrid({
        dataSource: dataSource,
        selectable: true,
        pageable: true,
        columns: [
            {
                field: "contractTemplateId", title: "ContractTemplateId", hidden: true
            },
            {
                field: "title",
                title: "Title"
            },
            {
                field: "modifiedBy",
                title: "Modified By"
            },
            {
                field: "modifiedBy",
                title: "Modified Date",
                filterable: false,
                template: '#= kendo.toString(kendo.parseDate(modifiedDate), "MM/dd/yyyy")#'
            }],
        scrollable: false,
        sortable: true,
        change: ContractTemplateManagementNS.onChange,
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

ContractTemplateManagementNS.onChange = function onChange(arg) {
    var text = "";
    var grid = this;

    if (grid.select().length >= 1) {
        grid.select().each(function () {
            var dataItem = grid.dataItem($(this));
            ContractTemplateManagementNS.ContractTemplateId = dataItem.contractTemplateId;
            ContractEditorManagementNS.TemplateName = dataItem.title;

            $('#edit-template').prop('disabled', false);
            $('#delete-template').prop('disabled', false);
        });
    } else {
        ContractTemplateManagementNS.ContractTemplateId = '';
        ContractEditorManagementNS.TemplateName = '';

        $('#edit-template').prop('disabled', true);
        $('#delete-template').prop('disabled', true);
    }
}

ContractTemplateManagementNS.addTemplate = function () {
    ContractTemplateManagementNS.ContractTemplateId = '';
    ContractEditorManagementNS.ContractTemplateId = '';
    ContractEditorManagementNS.ControlValue = 'new'
    $('#templateTabs a[href="#contract-editor"]').tab('show');
    ContractEditorManagementNS.tabShow();

    $('#edit-template').prop('disabled', true);
    $('#delete-template').prop('disabled', true);
}

ContractTemplateManagementNS.editTemplate = function () {
    ContractEditorManagementNS.ControlValue = 'existing'
    $('#templateTabs a[href="#contract-editor"]').tab('show');
    ContractEditorManagementNS.tabShow();

    $('#edit-template').prop('disabled', true);
    $('#delete-template').prop('disabled', true);
}

ContractTemplateManagementNS.deleteTemplate = function () {
    if (confirm("Are you sure you want to delete this item?")) {
        $.ajax({
            url: 'api/contract/deleteContractTemplate/' + ContractTemplateManagementNS.ContractTemplateId,
            type: 'DELETE',
            contentType: 'application/json; charset=utf-8',
            success: function (data, textStatus, XMLHttpRequest) {
                if (data != false && data != "false") {
                    $("#contract-template-grid").data("kendoGrid").dataSource.read();
                    $('#edit-template').prop('disabled', true);
                    $('#delete-template').prop('disabled', true);
                    toastr.success('Template successfully deleted!');
                } else {
                    toastr.error('Error deleting template!');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error('Something went wrong with the request!');
            }
        });
    }
}
