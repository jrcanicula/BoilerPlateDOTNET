/*This is the creator's view*/
var ContractApprovalNS = {};
ContractApprovalNS.ContractId = null;
ContractApprovalNS.ContractSectionId = null;
ContractApprovalNS.CurrentUserId = null;
ContractApprovalNS.OwnerId = null;
ContractApprovalNS.SectionList = [];
ContractApprovalNS.NewlyEntered = true;
ContractApprovalNS.IsClient = null;
ContractApprovalNS.AttachmentPaymentName = '';
ContractApprovalNS.TagsData = [];

ContractApprovalNS.init = function (contractId, userId, ownerId, isClient) {
  ContractApprovalNS.NewlyEntered = true;
  ContractApprovalNS.CurrentUserId = userId;
  ContractApprovalNS.ContractId = contractId;
  ContractApprovalNS.OwnerId = ownerId;
  ContractApprovalNS.SectionList = [];
  ContractApprovalNS.ContractSectionId = null;
  ContractApprovalNS.initializeControls(contractId);
  ContractApprovalNS.getContractSections(contractId);
  ContractApprovalNS.IsClient = isClient;
};

ContractApprovalNS.initializeControls = function (contractId) {

  $("#sectionList").kendoSortable({
    disabled: ".list-item.not-sortable"
  });

  $("#contractSectionContent").kendoEditor({
    resizable: {
      content: true,
      toolbar: true
    },
    tools: [],
  });

  $($('#contractSectionContent').data().kendoEditor.body).attr('contenteditable', false);

  $("#approver-history").kendoGrid({
    dataSource: {
      data: [],
      schema: {
        model: {
          fields: {
            dateSubmitted: { type: "date" },
            reviewer: { type: "string" },
            status: { type: "string" },
            remarks: { type: "string" }
          }
        }
      },
      pageSize: 20
    },
    noRecords: true,
    sortable: true,
    filterable: true,
    scrollable: false,
    dataBound: function databound(e) {

    },
    messages: {
      noRecords: "No History Yet"
    },
    editable: "inline",
    columns: [
      {
        field: "dateSubmitted",
        title: "Date Submitted",
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
        field: "reviewer",
        title: "Reviewer",
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
        template: '<div class="#: status  == 1 ? "gray-bg" : status == 2 ? "red-bg": status == 3 ? "orange-bg" : "green-bg" #" style="border-radius:2px;"> #=statusText#</div>'
      },
      {
        field: "remarks",
        title: "Remarks",
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

  if ($("#reviewers").length > 0) {
    ContractApprovalNS.getReviewers(ContractApprovalNS.ContractId);
  }

  $('#btnAddApprover').click(function (e) {
    e.preventDefault();
    var current = {};
    current.ApproverId = $("#reviewers").val();
    current.ContractSectionId = ContractApprovalNS.ContractSectionId;
    current.Remarks = $('#assingerRemarks').val();

    if (current.Remarks) {
      ContractApprovalNS.updateApprover(ContractApprovalNS.ContractSectionId, current);
    } else {
      toastr.add('Remarks is required');
    }
  });

  $('#btnShowAddApprover').click(function (e) {
    $('#btnAddApprover').show();
  });

  $('#btnApproveSection').click(function (e) {
    var model = {};
    model.UserInfoId = ContractApprovalNS.CurrentUserId.toLowerCase();
    model.ContractSectionId = ContractApprovalNS.ContractSectionId;
    model.Remarks = $("#approverRemarks").val();
    if (!model.Remarks) {
      toastr.error('Remarks is required');
    } else {
      ContractApprovalNS.approveContractSection(ContractApprovalNS.ContractSectionId.toLowerCase(), model);
    }
  });

  $('#btnRejectSection').click(function (e) {
    var model = {};
    model.UserInfoId = ContractApprovalNS.CurrentUserId.toLowerCase();
    model.ContractSectionId = ContractApprovalNS.ContractSectionId;
    model.Remarks = $("#approverRemarks").val();
    if (!model.Remarks) {
      toastr.error('Remarks is required');
    } else {
      ContractApprovalNS.rejectContractSection(ContractApprovalNS.ContractSectionId.toLowerCase(), model);
    }
  });

  $('#contractApprovalSubmitToVendor').click(function (e) {
    var isValid = true;
    for (var i = 0; i < ContractApprovalNS.SectionList.length; i++) {
      if (ContractApprovalNS.SectionList[i].status != 4) {
        isValid = false;
      }
    }

    if (!$("#contractNotesForSubmission").val()) {
      isValid = false;
      toastr.error('Notes is required');
    }

    if (isValid) {
      var model = {};
      model.Notes = $("#contractNotesForSubmission").val();
      ContractApprovalNS.updateContractToPendingReview(ContractApprovalNS.ContractId, model);
    }
  });

  $('#btnSetContractToActive').click(function (e) {
    var isValid = true;
    for (var i = 0; i < ContractApprovalNS.SectionList.length; i++) {
      if (ContractApprovalNS.SectionList[i].status != 4) {
        isValid = false;
      }
    }

    if (isValid) {
      ContractApprovalNS.updateContractToActive(ContractApprovalNS.ContractId);
    } else {
      toastr.error('Notes is required');
    }

  });

  $('#approverChanger').click(function (e) {
    $("#approverAdder").show();
    $('#approverChanger').hide();
  });
};

ContractApprovalNS.getReviewers = function (contractId) {
  $.ajax({
    url: 'api/contract/' + contractId + '/companyusers',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      for (var count = 0; count < data.length; count++) {
        $('#reviewers')
          .append($("<option></option>")
            .attr("value", data[count].userInfoId)
            .text(data[count].fullName));
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request');
    }
  });
}

ContractApprovalNS.getContractSections = function (contractId) {

  ContractApprovalNS.SectionList = [];

  $.ajax({
    url: 'api/contract/' + contractId + '/contractsections',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      var greenCount = 0;
      $("#sectionList").empty();
      var valueRight = "";
      for (var i = 0; i < data.length; i++) {
        var listItem = "";
        if (data[i].status == 1) {
          listItem += "<li class='list-item not-sortable gray-bg section-list-item' onclick='ContractApprovalNS.loadContent(\"" + data[i].contractSectionId + "\")' data-id='" + data[i].contractSectionId + "'> " + data[i].name + "</li>";
        } else if (data[i].status == 2) {
          listItem += "<li class='list-item not-sortable red-bg section-list-item' onclick='ContractApprovalNS.loadContent(\"" + data[i].contractSectionId + "\")' data-id='" + data[i].contractSectionId + "'> " + data[i].name + "</li>";
        }
        else if (data[i].status == 3) {
          listItem += "<li class='list-item not-sortable orange-bg section-list-item' onclick='ContractApprovalNS.loadContent(\"" + data[i].contractSectionId + "\")' data-id='" + data[i].contractSectionId + "'> " + data[i].name + "</li>";
        }
        else if (data[i].status == 4) {
          listItem += "<li class='list-item not-sortable green-bg section-list-item' onclick='ContractApprovalNS.loadContent(\"" + data[i].contractSectionId + "\")' data-id='" + data[i].contractSectionId + "'>" + data[i].name + "</li>";
          greenCount++;
        }
        var section = $("#sectionList");
        section.append(listItem);
        ContractApprovalNS.SectionList.push({
          contractSectionId: data[i].contractSectionId,
          approverId: data[i].approverId,
          approver: data[i].approver,
          status: data[i].status,
          name: data[i].name,
          content: data[i].content,
          contractSectionTags: data[i].contractSectionTags,
        });
      }

      $("#sectionList li").click(function () {
        $('#sectionList li').removeClass('highlight');
        $(this).addClass('highlight');
      });

      if (greenCount == data.length) {
        $("#btnToSubmitToVendor").prop("disabled", false);
      } else {
        $("#btnToSubmitToVendor").prop("disabled", true);
      }

      if (ContractApprovalNS.NewlyEntered) {
        var hasSelected = false;
        for (var i = 0; i < ContractApprovalNS.SectionList.length; i++) {
          console.log(ContractApprovalNS.CurrentUserId.toLowerCase() + ' ' + ContractApprovalNS.SectionList[i].approverId);
          if (ContractApprovalNS.SectionList[i].approverId &&
            ContractApprovalNS.SectionList[i].approverId.toLowerCase() == ContractApprovalNS.CurrentUserId.toLowerCase() && ContractApprovalNS.SectionList[i].status == 2) {
            $("ul li.section-list-item:nth-child(" + (i + 1) + ")").trigger('click');
            hasSelected = true;
            break;
          }
        }

        if (!hasSelected) {
          for (var i = 0; i < ContractApprovalNS.SectionList.length; i++) {
            console.log(ContractApprovalNS.CurrentUserId.toLowerCase() + ' ' + ContractApprovalNS.SectionList[i].approverId);
            if (ContractApprovalNS.SectionList[i].approverId &&
              ContractApprovalNS.SectionList[i].approverId.toLowerCase() == ContractApprovalNS.CurrentUserId.toLowerCase()) {

              if (ContractApprovalNS.SectionList[i].status == 3) {
                $("ul li.section-list-item:nth-child(" + (i + 1) + ")").trigger('click');
                hasSelected = true;
                break;
              }
            }
          }
        }

        if (!hasSelected) {
          $("ul li.section-list-item:nth-child(1)").trigger('click');
        }
        ContractApprovalNS.NewlyEntered = false;
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request');
    }
  });
};

ContractApprovalNS.loadContent = function (id) {

  ContractApprovalNS.clearRemarkFields();
  function sameId(item) {
    return item.contractSectionId.toLowerCase() === id.toLowerCase();
  }

  $("#approverRemarks").val(null);
  $("#assingerRemarks").val(null);

  var selectedItem = ContractApprovalNS.SectionList.find(sameId);

  if (ContractApprovalNS.CurrentUserId.toLowerCase() != ContractApprovalNS.OwnerId.toLowerCase()
    && !selectedItem.approverId) {
    toastr.error('You do not have access to see the content');
    return;
  }

  if (ContractApprovalNS.CurrentUserId.toLowerCase() != ContractApprovalNS.OwnerId.toLowerCase()
    && selectedItem.approverId && selectedItem.approverId.toLowerCase() != ContractApprovalNS.CurrentUserId.toLowerCase()) {
    toastr.error('You do not have access to see the content');
    return;
  }

  var editor = $("#contractSectionContent").data("kendoEditor");
  editor.value(selectedItem.content);
  $("#reviewers").val($("#reviewers option:first").val());
  ContractApprovalNS.ContractSectionId = selectedItem.contractSectionId;
  ContractApprovalNS.getHistory(selectedItem.contractSectionId);

  if (selectedItem.status == 4) {
    $("#approverAdder").hide();
    $("#approverControls").hide();
    $('#approverChanger').hide();
  }
  else if (!selectedItem.approverId && ContractApprovalNS.CurrentUserId.toLowerCase() == ContractApprovalNS.OwnerId.toLowerCase()) {
    $("#approverAdder").show();
    $("#approverControls").hide();
    $('#approverChanger').hide();
    console.log('no approver yet and i am the creator');
  } else if (!selectedItem.approverId && ContractApprovalNS.CurrentUserId.toLowerCase() != ContractApprovalNS.OwnerId.toLowerCase()) {
    $("#approverAdder").hide();
    $("#approverControls").hide();
    $('#approverChanger').hide();
    console.log('no approver yet and i am not creator');
  }
  else if (selectedItem.approverId &&
    ContractApprovalNS.OwnerId.toLowerCase() == ContractApprovalNS.CurrentUserId.toLowerCase()
    && selectedItem.status == 2) {
    $("#approverAdder").show();
    $('#approverChanger').hide();
    $("#approverControls").hide();
    console.log('i am the creator and it is rejected');
  }
  else if (selectedItem.approverId
    && (ContractApprovalNS.CurrentUserId.toLowerCase() == selectedItem.approverId.toLowerCase())
    && (ContractApprovalNS.CurrentUserId.toLowerCase() == ContractApprovalNS.OwnerId.toLowerCase())) {
    if (selectedItem.status == 3) {
      $("#approverControls").show();
    }
    $("#approverAdder").hide();
    $("#approverChanger").show();
  }
  else if (selectedItem.approverId &&
    ContractApprovalNS.CurrentUserId.toLowerCase()
    == selectedItem.approverId.toLowerCase()) {
    $("#approverAdder").hide();
    $("#approverChanger").hide();
    $("#approverControls").show();
  }
  else if (selectedItem.approverId &&
    ContractApprovalNS.CurrentUserId.toLowerCase() ==
    ContractApprovalNS.OwnerId.toLowerCase()) {
    if (selectedItem.status == 3) {
      $("#approverAdder").hide();
    } else {
      $("#approverControls").hide();
    }
    $("#approverAdder").hide();
    $('#approverChanger').show();
  }
  else {
    $("#approverAdder").hide();
    $("#approverControls").hide();
    $('#approverChanger').hide();
  }

  ContractApprovalNS.getSectionTagsValue(selectedItem.contractSectionTags, selectedItem.content);
}


ContractApprovalNS.SplitTags = function (data) {
  var tags = [];
  if (data) {
    var arr = data.split(',');
    if (arr.length > 0) {
      for (var i = 0; i < arr.length; i++) {
        var item = {};
        item.ContractTagId = arr[i];
        var ret = tags.find(x => x.ContractTagId === arr[i]);
        if (ret === undefined) {
          tags.push(item);
        }
      }
      return tags;
    } else {
      return null;
    }
  }
}



ContractApprovalNS.ReplaceContentValue = function (data, tags, content) {
  if (tags) {
    var arr = tags.split(',');
    if (arr.length > 0) {
      for (var i = 0; i < arr.length; i++) {
        var ret = data.find(x => x.contractTagId === arr[i]);
        var value = '<span style="color:white;padding:1px 5px;background-color:' + ret.color + ';">' + ret.name + "</span>";
        content = content.replace(new RegExp(value, "g"), ret.value);
      }
    }
  } else {
    var ret = data.find(x => x.contractTagId === arr[0]);
    var value = '<span style="color:white;padding:1px 5px;background-color:' + ret.color + ';">' + ret.name + "</span>";
    content = content.replace(new RegExp(value, "g"), ret.value);
  }
  var editor = $("#contractSectionContent").data("kendoEditor");
  editor.value(content);
};


ContractApprovalNS.getSectionTagsValue = function (tags, content) {

  var splittedTags = ContractApprovalNS.SplitTags(tags);

  if (tags) {
    $.ajax({
      url: "api/Contract/getAllSectionTags",
      type: 'POST',
      data: JSON.stringify(splittedTags),
      contentType: 'application/json; charset=utf-8',
      async: false,
      success: function (data, textStatus, XMLHttpRequest) {
        if (data != false && data != "false") {
          ContractApprovalNS.ReplaceContentValue(data, tags, content);
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        toastr.error('Something went wrong with GetSectionTags request!');
      }
    });
  }
}


ContractApprovalNS.getHistory = function (contractSectionId) {
  $.ajax({
    url: 'api/contract/' + contractSectionId + '/contractsectionhistory',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      ContractApprovalNS.populateContractSectionHistory(data);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
};

ContractApprovalNS.populateContractSectionHistory = function (data) {
  $("#approver-history").data('kendoGrid').dataSource.data([]);
  var dataSource = new kendo.data.DataSource({
    data: data,
    schema: {
      model: {
        fields: {
          dateSubmitted: { type: "date" },
          reviewer: { type: "string" },
          status: { type: "string" },
          remarks: { type: "string" }
        }
      }
    },
    pageSize: 20
  });
  var grid = $("#approver-history").data("kendoGrid");
  grid.setDataSource(dataSource);
};

ContractApprovalNS.updateApprover = function (contractSectionId, current) {
  $.ajax({
    url: 'api/contract/' + contractSectionId + '/updateapprover',
    type: 'PUT',
    data: JSON.stringify(current),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      toastr.success('Approver successfully updated');
      ContractApprovalNS.getHistory(contractSectionId);
      if (ContractApprovalNS.CurrentUserId.toLowerCase() == current.ApproverId.toLowerCase()) {
        $("#approverAdder").hide();
        $("#approverControls").show();
        $('#approverChanger').show();
      } else {
        $("#approverAdder").hide();
        $("#approverControls").hide();
        $('#approverChanger').show();
      }
      ContractApprovalNS.getContractSections(ContractApprovalNS.ContractId);
      ContractApprovalNS.clearRemarkFields();
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
};

ContractApprovalNS.approveContractSection = function (contractSectionId, model) {
  $.ajax({
    url: 'api/contract/' + contractSectionId + '/approve',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      $("#approverControls").hide();
      toastr.success('Review submitted');
      ContractApprovalNS.getHistory(contractSectionId);
      ContractApprovalNS.getContractSections(ContractApprovalNS.ContractId);
      ContractApprovalNS.clearRemarkFields();
      if (ContractApprovalNS.CurrentUserId.toLowerCase() == ContractApprovalNS.OwnerId.toLowerCase()) {
        $("#approverAdder").hide();
        $('#approverChanger').hide();
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

ContractApprovalNS.rejectContractSection = function (contractSectionId, model) {
  $.ajax({
    url: 'api/contract/' + contractSectionId + '/reject',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      $("#approverControls").hide();
      toastr.success('Review submitted');
      ContractApprovalNS.getHistory(contractSectionId);
      ContractApprovalNS.getContractSections(ContractApprovalNS.ContractId);
      ContractApprovalNS.clearRemarkFields();
      if (ContractApprovalNS.CurrentUserId.toLowerCase() == ContractApprovalNS.OwnerId.toLowerCase()) {
        $("#approverAdder").show();
        $("#approverControls").hide();
        $('#approverChanger').hide();
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

ContractApprovalNS.updateContractToPendingReview = function (contractId, model) {

  $("#contractNotesForSubmission").val(null);

  $.ajax({
    url: 'api/contract/' + contractId + '/updateContractToPendingReview',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      $('#submit-to-other-entity').modal('toggle');
      $("#lblContractStatus").text("Pending Review");
      toastr.success('Contract successfully submitted for review');
      $(".buttonExit").trigger('click');
      $("#contractGrid").data("kendoGrid").dataSource.read();
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request');
    }
  });
}


ContractApprovalNS.updateContractToActive = function (contractId) {
  $.ajax({
    url: 'api/contract/' + contractId + '/updateContractToActive',
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (ContractApprovalNS.IsClient == 'True' || ContractApprovalNS.IsClient == 'true') {
        ContractApprovalNS.initEditor();
        ContractApprovalNS.populateContractPayment();
        $('#approval-contract-payment').modal('show');
      }
      else {
        $("#lblContractStatus").text("Active");
        $("#contractGrid").data("kendoGrid").dataSource.read();
        $(".buttonExit").trigger('click');
        toastr.success('Contract successfully submitted for review');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request');
    }
  });
};

ContractApprovalNS.initEditor = function () {
  $('#approval-payment-attachment').change(function () {
    ContractApprovalNS.ReadFile(this);
  });

  $('#approval-contract-payment').on('hidden.bs.modal', function () {
    $("#lblContractStatus").text("Active");
    $("#contractGrid").data("kendoGrid").dataSource.read();
    $(".buttonExit").trigger('click');
    toastr.success('Contract successfully submitted for review');
  })
}

ContractApprovalNS.ReadFile = function (input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#approval-payment-attachment").attr('src', e.target.result);
      var result = e.target.result;
      attachementURL = result.replace(" ", "+");
    }
    reader.readAsDataURL(input.files[0]);
    ContractApprovalNS.AttachmentPaymentName = input.files[0].name;
  }
}

ContractApprovalNS.populateContractPayment = function () {
  var dataSource = new kendo.data.DataSource({
    transport: {
      read: {
        url: "api/contract/getContractPaymentByContractId/" + ContractApprovalNS.ContractId,
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

  $("#approval-contract-payment-grid").kendoGrid({
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
        title: "Delete",
        width: "50px",
        filterable: false,
        template: "#if(status == 'Waiting for Approval') {#<center><span class='fas fa-trash' style='text-align: center; cursor:pointer' onclick=\"ContractApprovalNS.deletePurchaseOrder('#= contractPaymentId #')\" > </span></center># } else {#<center><span class='fas fa-trash' style='cursor: not-allowed;'> </span></center>#}#"
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

ContractApprovalNS.addPurchaseOrder = function () {
  var model = {};
  model.ContractId = ContractApprovalNS.ContractId;
  model.PurchaseOrderNo = $('#approval-payment-po').val();
  model.AttachmentURL = $("#approval-payment-attachment").attr('src');
  model.AttachmentName = ContractApprovalNS.AttachmentPaymentName;

  $.ajax({
    url: 'api/contract/contractPayment',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data != false && data != "false") {
        $("#approval-contract-payment-grid").data("kendoGrid").dataSource.read();

        $('#approval-payment-po').val(null);
        $("#approval-payment-attachment").val('');
        ContractApprovalNS.AttachmentPaymentName = '';

        toastr.success('Purchase Order successfully added');
      } else {
        toastr.error('Purchase Order already exist!');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
}

ContractApprovalNS.deletePurchaseOrder = function (contractPaymentId) {
  if (confirm("Are you sure you want to delete this item?")) {
    $.ajax({
      url: 'api/contract/contractPayment/' + contractPaymentId,
      type: 'DELETE',
      contentType: 'application/json; charset=utf-8',
      success: function (data, textStatus, XMLHttpRequest) {
        if (data != false && data != "false") {
          $("#approval-contract-payment-grid").data("kendoGrid").dataSource.read();
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

ContractApprovalNS.clearRemarkFields = function () {
  $("#approverRemarks").val(null);
  $("#assingerRemarks").val(null);
}