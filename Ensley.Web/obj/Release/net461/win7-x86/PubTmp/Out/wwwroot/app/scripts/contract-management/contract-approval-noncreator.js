/*This is the creator's view*/
var ContractApprovalNonCreatorNS = {};
ContractApprovalNonCreatorNS.ContractId = null;
ContractApprovalNonCreatorNS.ContractSectionId = null;
ContractApprovalNonCreatorNS.CurrentUserId = null;
ContractApprovalNonCreatorNS.OwnerId = null;
ContractApprovalNonCreatorNS.SectionList = [];
ContractApprovalNonCreatorNS.NewlyEntered = true;
ContractApprovalNonCreatorNS.OldVersionSectionCount = 0;

ContractApprovalNonCreatorNS.init = function (contractId, userId, ownerId) {
  ContractApprovalNonCreatorNS.NewlyEntered = true;
  ContractApprovalNonCreatorNS.CurrentUserId = userId;
  ContractApprovalNonCreatorNS.ContractId = contractId;
  ContractApprovalNonCreatorNS.OwnerId = ownerId;
  ContractApprovalNonCreatorNS.SectionList = [];
  ContractApprovalNonCreatorNS.ContractSectionId = null;
  ContractApprovalNonCreatorNS.initializeControls(contractId);
  ContractApprovalNonCreatorNS.getContractSections(contractId);
};

ContractApprovalNonCreatorNS.initializeControls = function (contractId) {

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
    ContractApprovalNonCreatorNS.getReviewers(ContractApprovalNonCreatorNS.ContractId);
  }

  $('#btnAddApprover').click(function (e) {
    e.preventDefault();
    var current = {};
    current.ApproverId = $("#reviewers").val();
    current.ContractSectionId = ContractApprovalNonCreatorNS.ContractSectionId;
    current.Remarks = $('#assingerRemarks').val();
    ContractApprovalNonCreatorNS.updateApprover(ContractApprovalNonCreatorNS.ContractSectionId, current);
  });

  $('#btnShowAddApprover').click(function (e) {
    $('#btnAddApprover').show();
  });

  $('#btnApproveSection').click(function (e) {
    var model = {};
    model.UserInfoId = ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase();
    model.ContractSectionId = ContractApprovalNonCreatorNS.ContractSectionId;
    model.Remarks = $("#approverRemarks").val();
    if (model.Remarks == null) {
      toastr.error('Remarks is required');
    } else {
      ContractApprovalNonCreatorNS.approveContractSection(ContractApprovalNonCreatorNS.ContractSectionId.toLowerCase(), model);
    }
  });

  $('#btnRejectSection').click(function (e) {
    var model = {};
    model.UserInfoId = ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase();
    model.ContractSectionId = ContractApprovalNonCreatorNS.ContractSectionId;
    model.Remarks = $("#approverRemarks").val();
    if (model.Remarks == null) {
      toastr.error('Remarks is required');
    } else {
      ContractApprovalNonCreatorNS.rejectContractSection(ContractApprovalNonCreatorNS.ContractSectionId.toLowerCase(), model);
    }
  });

  $('#contractApprovalSubmitToVendor').click(function (e) {
    var isValid = true;
    for (var i = 0; i < ContractApprovalNonCreatorNS.SectionList.length; i++) {
      if (ContractApprovalNonCreatorNS.SectionList[i].status != 4) {
        isValid = false;
      }
    }

    if (!$("#contractNotesForApproval").val()) {
      isValid = false;
      toastr.error('Notes is required');
    }

    if (isValid) {
      var model = {};
      model.Notes = $("#contractNotesForApproval").val();
      ContractApprovalNonCreatorNS.updateContractToApprove(ContractApprovalNonCreatorNS.ContractId, model);
    }
  });

  $('#contractApprovalSubmitToVendor2').click(function (e) {

    var isValid = true;
    if (!$("#contractNotesForNotSigned").val()) {
      isValid = false;
      toastr.error('Notes is required');
    }

    if (isValid) {
      var model = {};
      model.Notes = $("#contractNotesForNotSigned").val();
      ContractApprovalNonCreatorNS.updateContractToNotSigned(ContractApprovalNonCreatorNS.ContractId, model);
    }
  });

  $('#approverChanger').click(function (e) {
    $("#approverAdder").show();
    $('#approverChanger').hide();
  });
};

ContractApprovalNonCreatorNS.updateContractToApprove = function (contractId, model) {
  $.ajax({
    url: 'api/contract/' + contractId + '/updateContractToApprove',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {

      $('#approve-contract-modal').modal('toggle');
      $("#lblContractStatus").text("Approved");
      $("#contractGrid").data("kendoGrid").dataSource.read();
      toastr.success('Contract is now approved!');
      $(".buttonExit").trigger('click');
      $("#contractNotesForApproval").val(null);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request');
    }
  });
}

ContractApprovalNonCreatorNS.updateContractToNotSigned = function (contractId, model) {
  $.ajax({
    url: 'api/contract/' + contractId + '/updateContractToNotSigned',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      $('#not-signed-contract-modal').modal('toggle');
      $("#lblContractStatus").text("Not Signed");
      $("#contractGrid").data("kendoGrid").dataSource.read();
      toastr.success('Contract is not signed!');
      $(".buttonExit").trigger('click');
      $("#contractNotesForNotSigned").val(null);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request');
    }
  });
}

ContractApprovalNonCreatorNS.getReviewers = function (contractId) {
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

ContractApprovalNonCreatorNS.getContractSections = function (contractId) {
  ContractApprovalNonCreatorNS.SectionList = [];
  $.ajax({
    url: 'api/contract/' + contractId + '/nonOwnerContractSections',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      var greenCount = 0;
      $("#sectionList").empty();
      var valueRight = "";
      for (var i = 0; i < data.length; i++) {
        var listItem = "";
        if (data[i].status == 1) {
          listItem += "<li class='list-item not-sortable gray-bg section-list-item' onclick='ContractApprovalNonCreatorNS.loadContent(\"" + data[i].contractSectionId + "\")' data-id='" + data[i].contractSectionId + "'> " + data[i].name + "</li>";
        } else if (data[i].status == 2) {
          listItem += "<li class='list-item not-sortable red-bg section-list-item' onclick='ContractApprovalNonCreatorNS.loadContent(\"" + data[i].contractSectionId + "\")' data-id='" + data[i].contractSectionId + "'> " + data[i].name + "</li>";
        }
        else if (data[i].status == 3) {
          listItem += "<li class='list-item not-sortable orange-bg section-list-item' onclick='ContractApprovalNonCreatorNS.loadContent(\"" + data[i].contractSectionId + "\")' data-id='" + data[i].contractSectionId + "'> " + data[i].name + "</li>";
        }
        else if (data[i].status == 4) {
          listItem += "<li class='list-item not-sortable green-bg section-list-item' onclick='ContractApprovalNonCreatorNS.loadContent(\"" + data[i].contractSectionId + "\")' data-id='" + data[i].contractSectionId + "'>" + data[i].name + "</li>";
          greenCount++;
        }
        var section = $("#sectionList");
        section.append(listItem);
        ContractApprovalNonCreatorNS.SectionList.push({
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

      ///*dapat walang daya*/

      //if (greenCount == data.length) {
      //  $("#btnApproveContract").prop("disabled", false);
      //} else {
      //  $("#btnApproveContract").prop("disabled", true);
      //}

      //dapat mahandle na old version length reporpose

      if (ContractApprovalNonCreatorNS.NewlyEntered) {
        var hasSelected = false;

        for (var i = 0; i < ContractApprovalNonCreatorNS.SectionList.length; i++) {
          console.log(ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() + ' ' + ContractApprovalNonCreatorNS.SectionList[i].approverId);
          if (ContractApprovalNonCreatorNS.SectionList[i].approverId &&
            ContractApprovalNonCreatorNS.SectionList[i].approverId.toLowerCase() == ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() && ContractApprovalNonCreatorNS.SectionList[i].status == 2) {
            $("ul li.section-list-item:nth-child(" + (i + 1) + ")").trigger('click');
            hasSelected = true;
            break;
          }
        }

        if (!hasSelected) {
          for (var i = 0; i < ContractApprovalNonCreatorNS.SectionList.length; i++) {
            console.log(ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() + ' ' + ContractApprovalNonCreatorNS.SectionList[i].approverId);
            if (ContractApprovalNonCreatorNS.SectionList[i].approverId &&
              ContractApprovalNonCreatorNS.SectionList[i].approverId.toLowerCase() == ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase()) {

              if (ContractApprovalNonCreatorNS.SectionList[i].status == 3) {
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
        ContractApprovalNonCreatorNS.NewlyEntered = false;
      }

      $.ajax({
        url: 'api/contract/' + contractId + '/contractversion',
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function (response, textStatus, XMLHttpRequest) {
          if (greenCount == data.length && (response % 2 != 0)) {
            $("#btnApproveContract").prop("disabled", false);
          } else {
            $("#btnApproveContract").prop("disabled", true);
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          toastr.error('Something went wrong with the request!');
        }
      });
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request');
    }
  });
};

ContractApprovalNonCreatorNS.loadContent = function (id) {

  ContractApprovalNonCreatorNS.clearRemarkFields();

  function sameId(item) {
    return item.contractSectionId.toLowerCase() === id.toLowerCase();
  }

  $("#approverRemarks").val(null);
  $("#assingerRemarks").val(null);

  var selectedItem = ContractApprovalNonCreatorNS.SectionList.find(sameId);

  if (ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() != ContractApprovalNonCreatorNS.OwnerId.toLowerCase()
    && !selectedItem.approverId) {
    toastr.error('You do not have access to see the content');
    return;
  }

  if (ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() != ContractApprovalNonCreatorNS.OwnerId.toLowerCase()
    && selectedItem.approverId && selectedItem.approverId.toLowerCase() != ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase()) {
    toastr.error('You do not have access to see the content');
    return;
  }

  var editor = $("#contractSectionContent").data("kendoEditor");
  editor.value(selectedItem.content);
  $("#reviewers").val($("#reviewers option:first").val());
  ContractApprovalNonCreatorNS.ContractSectionId = selectedItem.contractSectionId;
  ContractApprovalNonCreatorNS.getHistory(selectedItem.contractSectionId);

  if (selectedItem.status == 4) {
    $("#approverAdder").hide();
    $("#approverControls").hide();
    $('#approverChanger').hide();
  }

  else if (!selectedItem.approverId && ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() == ContractApprovalNonCreatorNS.OwnerId.toLowerCase()) {
    $("#approverAdder").show();
    $("#approverControls").hide();
    $('#approverChanger').hide();
    console.log('no approver yet and i am the creator');
  } else if (!selectedItem.approverId && ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() != ContractApprovalNonCreatorNS.OwnerId.toLowerCase()) {
    $("#approverAdder").hide();
    $("#approverControls").hide();
    $('#approverChanger').hide();
    console.log('no approver yet and i am not creator');
  }
  else if (selectedItem.approverId &&
    ContractApprovalNonCreatorNS.OwnerId.toLowerCase() == ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase()
    && selectedItem.status == 2) {
    $("#approverAdder").show();
    $('#approverChanger').hide();
    $("#approverControls").hide();
    console.log('i am the creator and it is rejected');
  }
  else if (selectedItem.approverId
    && (ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() == selectedItem.approverId.toLowerCase())
    && (ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() == ContractApprovalNonCreatorNS.OwnerId.toLowerCase())) {
    if (selectedItem.status == 3) {
      $("#approverControls").show();
    }
    $("#approverAdder").hide();
    $("#approverChanger").show();
  }
  else if (selectedItem.approverId &&
    ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase()
    == selectedItem.approverId.toLowerCase()) {
    $("#approverAdder").hide();
    $("#approverChanger").hide();
    $("#approverControls").show();
  }
  else if (selectedItem.approverId &&
    ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() ==
    ContractApprovalNonCreatorNS.OwnerId.toLowerCase()) {
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
  ContractApprovalNonCreatorNS.getSectionTagsValue(selectedItem.contractSectionTags, selectedItem.content);
};

ContractApprovalNonCreatorNS.SplitTags = function (data) {
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
};

ContractApprovalNonCreatorNS.ReplaceContentValue = function (data, tags, content) {
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


ContractApprovalNonCreatorNS.getSectionTagsValue = function (tags, content) {
  var splittedTags = ContractApprovalNonCreatorNS.SplitTags(tags);

  if (tags) {
    $.ajax({
      url: "api/Contract/getAllSectionTags",
      type: 'POST',
      data: JSON.stringify(splittedTags),
      contentType: 'application/json; charset=utf-8',
      async: false,
      success: function (data, textStatus, XMLHttpRequest) {
        if (data != false && data != "false") {
          ContractApprovalNonCreatorNS.ReplaceContentValue(data, tags, content);
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        toastr.error('Something went wrong with GetSectionTags request!');
      }
    });
  }
}



ContractApprovalNonCreatorNS.getHistory = function (contractSectionId) {
  $.ajax({
    url: 'api/contract/' + contractSectionId + '/nonOwnerContractsectionhistory',
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      ContractApprovalNonCreatorNS.populateContractSectionHistory(data);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
};

ContractApprovalNonCreatorNS.populateContractSectionHistory = function (data) {
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

ContractApprovalNonCreatorNS.updateApprover = function (contractSectionId, current) {
  $.ajax({
    url: 'api/contract/' + contractSectionId + '/updateNonOwnerApprover',
    type: 'PUT',
    data: JSON.stringify(current),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      toastr.success('Approver successfully updated');
      ContractApprovalNonCreatorNS.getHistory(contractSectionId);
      if (ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() == current.ApproverId.toLowerCase()) {
        $("#approverAdder").hide();
        $("#approverControls").show();
        $('#approverChanger').show();
      } else {
        $("#approverAdder").hide();
        $("#approverControls").hide();
        $('#approverChanger').show();
      }
      ContractApprovalNonCreatorNS.getContractSections(ContractApprovalNonCreatorNS.ContractId);
      ContractApprovalNonCreatorNS.clearRemarkFields();
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
};

ContractApprovalNonCreatorNS.approveContractSection = function (contractSectionId, model) {
  $.ajax({
    url: 'api/contract/' + contractSectionId + '/approveNonOwner',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      $("#approverControls").hide();
      toastr.success('Review submitted');
      ContractApprovalNonCreatorNS.getHistory(contractSectionId);
      ContractApprovalNonCreatorNS.getContractSections(ContractApprovalNonCreatorNS.ContractId);
      ContractApprovalNonCreatorNS.clearRemarkFields();
      if (ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() == ContractApprovalNonCreatorNS.OwnerId.toLowerCase()) {
        $("#approverAdder").hide();
        $('#approverChanger').hide();
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
};

ContractApprovalNonCreatorNS.rejectContractSection = function (contractSectionId, model) {
  $.ajax({
    url: 'api/contract/' + contractSectionId + '/rejectNonOwner',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      $("#approverControls").hide();
      toastr.success('Review submitted');
      ContractApprovalNonCreatorNS.getHistory(contractSectionId);
      ContractApprovalNonCreatorNS.getContractSections(ContractApprovalNonCreatorNS.ContractId);
      ContractApprovalNonCreatorNS.clearRemarkFields();
      if (ContractApprovalNonCreatorNS.CurrentUserId.toLowerCase() == ContractApprovalNonCreatorNS.OwnerId.toLowerCase()) {
        $("#approverAdder").show();
        $("#approverControls").hide();
        $('#approverChanger').hide();
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request!');
    }
  });
};

ContractApprovalNonCreatorNS.clearRemarkFields = function () {
  $("#approverRemarks").val(null);
  $("#assingerRemarks").val(null);
};