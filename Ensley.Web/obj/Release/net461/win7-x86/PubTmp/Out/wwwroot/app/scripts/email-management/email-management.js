var EmailManagementNS = {};
EmailManagementNS.EmailTemplateId = null;

EmailManagementNS.init = function () {
  
    $("h3#page-title").text("Email Management");

    EmailManagementNS.populateEmailTemplates();
}


EmailManagementNS.populateEmailTemplates = function () {
  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: "api/emailtemplate/emailTemplates",
        dataType: "json"
      }
    },
    batch: true,
    pageSize: 10,
    schema: {
      model: {
        id: "emailTemplateId",
        fields: {
          emailTemplateId: { editable: false, type: "guid" },
          title: { validation: { required: true } },
          subject: { validation: { required: true } },
          content: { validation: { required: true } }
        }
      }
    }
  });

    $("#emailTemplate-grid").kendoGrid({
        dataSource: dataSource,
        selectable: true,
        pageable: true,
        columns: [
            {
                field: "emailTemplateId", title: "Email Template Id", hidden: true
            },
            {
                field: "title",
                title: "Title"
            },
            {
                field: "subject",
                title: "Subject"
            },
            {
                field: "content",
                title: "Content"
            },
            
        ],
        scrollable: false,
        sortable: true,
        change: EmailManagementNS.onChange,
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

EmailManagementNS.onChange = function onChange(arg) {
  var text = "";
  var grid = this;

    if (grid.select().length >= 1) {
        grid.select().each(function () {
            var dataItem = grid.dataItem($(this));
            EmailManagementNS.EmailTemplateId = dataItem.emailTemplateId;
            $('#emailTemplate-edit-title').val(dataItem.title);
            $('#emailTemplate-edit-subject').val(dataItem.subject);
            $('#emailTemplate-edit-content').val(dataItem.content);

            $('#edit-emailTemplate-popup').prop('disabled', false);
            $('#delete-emailTemplate-popup').prop('disabled', false);
        });
    } else {
        EmailManagementNS.EmailTemplateId = null;
        $('#emailTemplate-edit-title').val(null);
        $('#emailTemplate-edit-subject').val(null);
        $('#emailTemplate-edit-content').val(null);        

        $('#edit-emailTemplate-popup').prop('disabled', true);
        $('#delete-emailTemplate-popup').prop('disabled', true);
  }
}




