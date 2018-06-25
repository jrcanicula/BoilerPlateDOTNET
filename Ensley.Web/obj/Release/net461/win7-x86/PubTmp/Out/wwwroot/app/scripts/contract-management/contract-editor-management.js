var ContractEditorManagementNS = {};
ContractEditorManagementNS.EditorValue = '';
ContractEditorManagementNS.ContractTagType = [{ "name": "text", "value": "text" }, { "name": "date", "value": "date" }, { "name": "number", "value": "number" }];
ContractEditorManagementNS.SectionId = null;
ContractEditorManagementNS.ContractSectionTemplateArr = '';
ContractEditorManagementNS.EditorValueEdited = [];
ContractEditorManagementNS.ContractTemplateId = '';
ContractEditorManagementNS.RemoveContractTemplate = [];
ContractEditorManagementNS.ControlValue = null;
ContractEditorManagementNS.TemplateName = '';
ContractEditorManagementNS.SelectedTag = '';

ContractEditorManagementNS.init = function () {
   $("h3#page-title").text("Contract Management");

    var createTagValidator = $("#form-tag-create").kendoValidator().data("kendoValidator");
    ContractEditorManagementNS.initTagEditor();

    $(".editorDiv").kendoEditor({
        tools: ["print", "bold", "italic", "underline", "strikethrough", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "insertUnorderedList", "insertOrderedList", "indent", "outdent", "createLink", "unlink", "tableWizard", "createTable", "addRowAbove", "addRowBelow", "addColumnLeft", "addColumnRight", "deleteRow", "deleteColumn", "viewHtml", "formatting", "cleanFormatting", "fontName", "fontSize", "foreColor", "backColor",
            {
                name: "addTag",
                tooltip: "Add Tag",
                exec: function (e) {
                    var editor = $(".editorDiv").data("kendoEditor");
                    var textSelected = editor.getRange().toString().trim();
                    var textSelectedWordCount = textSelected.split(/\s+|\./).length;
                    ContractEditorManagementNS.SelectedTag = textSelected;

                    if (textSelectedWordCount > 1 || textSelected == '') {
                        toastr.error('Please highlight one word only!');
                    }
                    else {
                        $("#tag-name span").text(textSelected);
                        $('#tag-create-popup').modal('show');
                    }
                }
            },
            {
                name: "deleteTag",
                tooltip: "Delete Tag",
                exec: function (e) {
                    var editor = $(".editorDiv").data("kendoEditor");
                    var textSelected = editor.getRange().toString().trim();
                    var textSelectedWordCount = textSelected.split(/\s+|\./).length;

                    if (textSelectedWordCount > 1 || textSelected == '') {
                        toastr.error('Please highlight one word only!');
                    }
                    else {
                        $.ajax({
                            url: 'api/contract/contractTag/' + textSelected,
                            type: 'GET',
                            contentType: 'application/json; charset=utf-8',
                            success: function (data, textStatus, XMLHttpRequest) {
                                if (data != null) {
                                    ContractEditorManagementNS.RemoveBackgroundColorForSection(data.color, data.name, data.contractTagId);
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                toastr.error('Something went wrong with the request!');
                            }
                        });
                    }
                }
            }]
    });

    $("form#form-tag-create").submit(function (e) {
        e.preventDefault();

        if (createTagValidator.validate()) {
            var model = {};
            model.ContractTagId = null;
            model.Name = ContractEditorManagementNS.SelectedTag;
            model.Type = $("#tag-type").val();
            model.Color = $("#tag-color").val();

            ContractEditorManagementNS.addTag(model);
        }
    })

   $("#updateTextAreaEditor").kendoEditor({
    tools: ["print", "bold", "italic", "underline", "strikethrough", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "insertUnorderedList", "insertOrderedList", "indent", "outdent", "createLink", "unlink", "insertImage", "insertFile", "tableWizard", "createTable", "addRowAbove", "addRowBelow", "addColumnLeft", "addColumnRight", "deleteRow", "deleteColumn", "viewHtml", "formatting", "cleanFormatting", "fontName", "fontSize", "foreColor", "backColor"]
  });

   $("#sortableListLeft").kendoSortable({
    connectWith: "#sortableListRight",
    placeholder: ContractEditorManagementNS.placeholder,
    end: ContractEditorManagementNS.onEndRemove
  });

   $("#sortableListRight").kendoSortable({
    connectWith: "#sortableListLeft",
    placeholder: ContractEditorManagementNS.placeholder,
    end: ContractEditorManagementNS.onEnd
  });
    
   $("#textAreaEditor").kendoEditor({
    resizable: {
      content: true,
      toolbar: true
    }
  });

   $("#section-add-ordernum").kendoNumericTextBox({ format: "#", decimals: 0 });

   $("#btnAddSection").click(function (e) {
    ContractEditorManagementNS.clearSectionPopUp();
    $('#section-create-popup').modal('show');
  });

   $("#btnSaveSection").click(function (e) {
    e.preventDefault();
    ContractEditorManagementNS.saveSection();
  });

   $("#btnUpdateDeleteSection").click(function (e) {
    e.preventDefault();
    $("#section-update-name").data('kendoDropDownList').select(0);
    var ret = ContractEditorManagementNS.EditorValue.find(x => x.sectionTemplateId === $("#section-update-name").val());
    if (ret != undefined) {
      var editor = $("#updateTextAreaEditor").data("kendoEditor");
      editor.value(ret.value);
    }
    $('#section-update-popup').modal('show');
  });

   $("#btnUpdateSection").click(function (e) {
    e.preventDefault();
    ContractEditorManagementNS.UpdateSection();
  });

   $("#btnDeleteSection").click(function (e) {
    e.preventDefault();
    var selected = false;
    $('#sortableListRight li').each(function (i) {
      if ($(this).attr('id') !== 'placeholder') {
        if (i < $('#sortableListRight li').length) {
          if ($(this)[0].dataset.id === ContractEditorManagementNS.SectionId.sectionTemplateId) {
            selected = true;
            return false;
          }
        }
      }
    });

    if (selected) {
      var unmap = confirm("Section been selected. Unmapped the section if you want to delete this section.");
      if (unmap === true) {
        $('#section-update-popup').modal('toggle');
      }
    }
    else {
      var result = confirm("Are you sure you want to delete this section?");
      if (result === true) {
        ContractEditorManagementNS.DeleteSection();
      }
      $('#section-update-popup').modal('toggle');
    }

  });

   $("#btnSave").click(function (e) {
    e.preventDefault();
    ContractEditorManagementNS.SaveContractTemplate();
  });

    $(".editorDiv").mouseleave(function (e) {
        e.preventDefault();
        var editor = $(".editorDiv");
        for (var i = 1; i < editor.length; i++) {
          var ret = ContractEditorManagementNS.EditorValueEdited.find(x => x.sectionId === editor[i].dataset.id);
          if (ret !== undefined) {
            var index = jQuery.inArray(ret, ContractEditorManagementNS.EditorValueEdited);
            ContractEditorManagementNS.EditorValueEdited[index].content = ret.content;
          } else {
            var hasChanges = ContractEditorManagementNS.EditorValue.find(x => x.sectionTemplateId === editor[i].dataset.id
              && x.value !== editor[i].innerHTML)
            if (hasChanges != undefined) {
              var data = {};
              data.id = editor[i].id;
              data.sectionId = editor[i].dataset.id;
              data.content = editor[i].innerHTML;
              ContractEditorManagementNS.EditorValueEdited.push(data);
            }
          }
        }
    });

   $("#contract-template-tab").click(function () {
      $("#contract-template-grid").data("kendoGrid").clearSelection();
    })

    var searching,
        limitsearch,
        countsearch;

    $('#btn-search-text').click(function () {
        var searchedText = $('#searchEditorText').val();
        var page = $('#editorWrapper');

        if (searchedText != "") {
            if (searching != searchedText) {
                page.find('span.match').contents().unwrap();
                var pageText = page.html();
                var theRegEx = new RegExp("(" + searchedText + ")", "igm");
                var newHtml = pageText.replace(theRegEx, "<span class='match'>$1</span>");
                page.html(newHtml);

                searching = searchedText;
                limitsearch = page.find('span.match').length;
                countsearch = 0;
            } else {
                countsearch < limitsearch - 1 ? countsearch++ : countsearch = 0;
            }

            $("#search-result").text((countsearch + 1) + '/' + limitsearch);

            var actual = $("#editorWrapper span.match").eq(countsearch);
            $('span.active').removeClass('active');
            actual.addClass('active');

            $('html,body').animate({
                scrollTop: actual.offset().top - 50
            }, 200);
        } else {
            page.find('span.match').contents().unwrap();
            $("#search-result").text('');
        }
    });
}

ContractEditorManagementNS.clearSectionPopUp = function () {
  $('#section-add-name').val("");
  var editor = $("#textAreaEditor").data("kendoEditor");
  editor.value(" ");
}

ContractEditorManagementNS.saveSection = function () {
  var createSectionValidator = $("#form-section-create").kendoValidator().data("kendoValidator");
  if (createSectionValidator.validate()) {
    var editor = $("#textAreaEditor").data("kendoEditor");
    var model = {};
    model.SectionTemplateId = "00000000-0000-0000-0000-000000000000";
    model.Name = $('#section-add-name').val();
    model.Value = editor.value();
    model.OrderNo = $("#section-add-ordernum").val();
    $.ajax({
      url: "api/Contract/createSection",
      type: 'POST',
      data: JSON.stringify(model),
      contentType: 'application/json; charset=utf-8',
      success: function (data, textStatus, XMLHttpRequest) {
        if (data !== false && data !== "false") {
          ContractEditorManagementNS.clearSectionPopUp();
          ContractEditorManagementNS.EditorValue.push(data);
          ContractEditorManagementNS.UpdateSectionRight(data, -1);
          $("#section-update-name").data("kendoDropDownList").setDataSource(ContractEditorManagementNS.EditorValue);
          $('#section-create-popup').modal('toggle');
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        toastr.error('Something went wrong with the saving section request!');
      }
    });
  }
}

ContractEditorManagementNS.UpdateSection = function () {
  var editor = $("#updateTextAreaEditor").data("kendoEditor");
  var model = {};
  model.SectionTemplateId = ContractEditorManagementNS.SectionId.sectionTemplateId;
  model.Name = ContractEditorManagementNS.SectionId.name;
  model.Value = editor.value();
  model.OrderNo = parseInt(ContractEditorManagementNS.SectionId.orderNo);
  $.ajax({
    url: 'api/Contract/updateSection',
    type: 'PUT',
    data: JSON.stringify(model),
    contentType: "application/json; charset=utf-8",
    success: function (data, textStatus, XMLHttpRequest) {
        if (data !== false && data !== "false") {
            var updatedIndex = getIndexByProperty(ContractEditorManagementNS.EditorValue, 'sectionTemplateId', data.sectionTemplateId);
            if (updatedIndex > -1) {
                ContractEditorManagementNS.EditorValue[updatedIndex].value = data.value;
            } 

            ContractEditorManagementNS.LoadEditor();
            $('#section-update-popup').modal('toggle');
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the saving section request!');
    }
  });
}

ContractEditorManagementNS.DeleteSection = function () {
  $.ajax({
    url: 'api/contract/deleteSection/' + ContractEditorManagementNS.SectionId.sectionTemplateId,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    success: function (data, textStatus, XMLHttpRequest) {
      if (data !== false && data !== "false") {
        for (var i = 0; i < ContractEditorManagementNS.EditorValue.length; i++) {
          if (ContractEditorManagementNS.EditorValue[i].sectionTemplateId === ContractEditorManagementNS.SectionId.sectionTemplateId) {
            var deletedData = ContractEditorManagementNS.EditorValue[i];
            ContractEditorManagementNS.EditorValue.splice(i, 1);
            break;
          }
        }
        ContractEditorManagementNS.UpdateSectionLeft();
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the saving section request!');
    }
  });
}

ContractEditorManagementNS.SaveContractTemplate = function () {
  var editor = $(".editorDiv").data("kendoEditor");
  var selectedTemplate = '';
    if (ContractEditorManagementNS.ControlValue === 'existing') {
        selectedTemplate = ContractTemplateManagementNS.ContractTemplateId;
  } else {
    selectedTemplate = $("#ContractTemplate").val();
  }

  if (selectedTemplate === '') {
    toastr.error('Please set template name');
  } else {
      if (ContractEditorManagementNS.ContractTemplateId == '' && ContractEditorManagementNS.ControlValue === 'new') {
      $.ajax({
        url: "api/Contract/createContractTemplate/" + $("#ContractTemplate").val(),
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (data, textStatus, XMLHttpRequest) {
          if (data !== false && data !== "false") {
              ContractEditorManagementNS.ContractTemplateId = data;
              ContractEditorManagementNS.GetAllSelectedSectionRight();
              $("#contract-template-grid").data("kendoGrid").dataSource.read();
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          toastr.error('Something went wrong with the saving contract section template request!');
        }
      });
    } else {
      ContractEditorManagementNS.GetAllSelectedSectionRight();
    }
  }
}

ContractEditorManagementNS.placeholder = function (element) {
  return $("<li class='list-item' id='placeholder'>Drop Here!</li>");
}

ContractEditorManagementNS.onEnd = function (e) {
  var editor = $(".editorDiv").data("kendoEditor");
  var value = '';
  var id = e.item[0].id;
  var action = e.action;
  var editedSection = '';
  $('#sortableListRight li').each(function (i) {
    editedSection = '';
    if ($(this).attr('id') === 'placeholder') {
      value += "<div class='editorDiv' id=" + id + " data-id=" + ContractEditorManagementNS.EditorValue[id].sectionTemplateId + ">";
      editedSection = ContractEditorManagementNS.CheckIfSectionIsEdited(ContractEditorManagementNS.EditorValue[id].sectionTemplateId);
      if (editedSection !== '') {
        value += editedSection;
      } else {
          value += ContractEditorManagementNS.EditorValue[id].content !== undefined ? ContractEditorManagementNS.EditorValue[id].content : ContractEditorManagementNS.EditorValue[id].value;
      }
      value += "</div>";
    } else {
      if (id !== $(this).attr('id')) {
        var idDiv = parseInt($(this).attr('id'));
        value += "<div class='editorDiv' id=" + idDiv + " data-id=" + ContractEditorManagementNS.EditorValue[idDiv].sectionTemplateId + ">";
        editedSection = ContractEditorManagementNS.CheckIfSectionIsEdited(ContractEditorManagementNS.EditorValue[idDiv].sectionTemplateId);
        if (editedSection !== '') {
          value += editedSection;
        } else {
            value += ContractEditorManagementNS.EditorValue[id].content !== undefined ? ContractEditorManagementNS.EditorValue[id].content : ContractEditorManagementNS.EditorValue[id].value;
        }
        value += "</div>";
      }
    }
    editor.value(value);
  });
}

ContractEditorManagementNS.onEndRemove = function (e) {
  var editor = $(".editorDiv").data("kendoEditor");
  var value = '';
  var action = e.action;
  var sectionId = e.item[0].dataset.id;
  $('#sortableListRight li').each(function (i) {
    if ($('#sortableListRight li').length === 0) {
      value = '';
      editor.value('');
    }
    if (action !== "receive") {
      if ($(this).attr('id') !== 'placeholder') {
        if (i < (parseInt($('#sortableListRight li').length))) {
          var id = parseInt($(this).attr('id'));
          value += "<div class='editorDiv' id=" + id + " data-id=" + ContractEditorManagementNS.EditorValue[id].sectionTemplateId + ">";
          editedSection = ContractEditorManagementNS.CheckIfSectionIsEdited(ContractEditorManagementNS.EditorValue[id].sectionTemplateId);
          if (editedSection !== '') {
            value += editedSection;
          } else {
              value += ContractEditorManagementNS.EditorValue[id].content !== undefined ? ContractEditorManagementNS.EditorValue[id].content : ContractEditorManagementNS.EditorValue[id].value;
          }
          value += "</div>";
        }
      }
      editor.value(value);
    } else {
      if ($(this).attr('id') !== 'placeholder') {
        if (i < (parseInt($('#sortableListRight li').length))) {
          var id = parseInt($(this).attr('id'));
          if (sectionId === ContractEditorManagementNS.EditorValue[id].sectionTemplateId) {
            var ret = ContractEditorManagementNS.RemoveSectionIsEdited(ContractEditorManagementNS.EditorValue[id].sectionTemplateId);
            if (ret == false) {
              if (ContractEditorManagementNS.ContractSectionTemplateArr != '') {
                var ContractTemplateId = ''
                  if (ContractEditorManagementNS.ControlValue == 'existing') {
                      ContractTemplateId = ContractTemplateManagementNS.ContractTemplateId;
                } else {
                  ContractTemplateId = ContractEditorManagementNS.ContractTemplateId;
                }
                var result = ContractEditorManagementNS.ContractSectionTemplateArr.find(x => x.contractTemplateId === ContractTemplateId
                  && x.sectionTemplateId === ContractEditorManagementNS.EditorValue[id].sectionTemplateId);
                if (result != undefined) {
                  ContractEditorManagementNS.RemoveContractTemplate.push(result.contractSectionTemplateId);
                }
              }
            }
          }
        }
      }
    }
  });
}

ContractEditorManagementNS.CheckIfSectionIsEdited = function (sectionId) {
  var value = ''
  var ret = ContractEditorManagementNS.EditorValueEdited.find(x => x.sectionId === sectionId);
  if (ret !== undefined) {
    var index = jQuery.inArray(ret, ContractEditorManagementNS.EditorValueEdited);
      value = ContractEditorManagementNS.EditorValue[index].content !== undefined ? ContractEditorManagementNS.EditorValue[index].content : ContractEditorManagementNS.EditorValue[index].value;;
  }
  return value;
}

ContractEditorManagementNS.RemoveSectionIsEdited = function (sectionId) {
  var retValue = false;
  var ret = ContractEditorManagementNS.EditorValueEdited.find(x => x.sectionId === sectionId);
  if (ret !== undefined) {
    var index = jQuery.inArray(ret, ContractEditorManagementNS.EditorValueEdited);
    ContractEditorManagementNS.EditorValueEdited.splice(index, 1);
    retValue = true;
  }
  return retValue;
}

ContractEditorManagementNS.GetAllSectionTemplate = function (templateVal) {
  var url = '';
  if (templateVal === '') {
    url = "api/contract/getAllSectionTemplate";
  }
  else {
      url = "api/contract/getAllSectionTemplateByTemplate/" + templateVal;
  }
  $.ajax({
    url: url,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
      success: function (data, textStatus, XMLHttpRequest) {
      if (data !== false && data !== "false") {
        ContractEditorManagementNS.EditorValue = data;
        ContractEditorManagementNS.UpdateSectionLeft();
        $("#section-update-name").kendoDropDownList({
          dataTextField: "name",
          dataValueField: "sectionTemplateId",
          dataSource: ContractEditorManagementNS.EditorValue,
          index: 0,
          change: ContractEditorManagementNS.onChangeSectionTemplate
        });
        ContractEditorManagementNS.onChangeSectionTemplate();
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      toastr.error('Something went wrong with the request for get all sections!');
    }
  });
}

ContractEditorManagementNS.onChangeSectionTemplate = function () {
  var id = $("#section-update-name").val();
  var editor = $("#updateTextAreaEditor").data("kendoEditor");
  var value = '';
  ContractEditorManagementNS.SectionId = ContractEditorManagementNS.EditorValue.find(x => x.sectionTemplateId === id);
  if (editor !== undefined) {
    editor.value(ContractEditorManagementNS.SectionId.content);
  }
}

ContractEditorManagementNS.UpdateSectionLeft = function () {
  var sectionLeft = $("#sortableListLeft").empty();
  var valueLeft = "";
  for (i = 0; i < ContractEditorManagementNS.EditorValue.length; i++) {
    if (ContractEditorManagementNS.EditorValue[i].contractSectionTemplateId === undefined
      || ContractEditorManagementNS.EditorValue[i].selected === 0) {
      valueLeft += "<li class='list-item' ondblclick='ContractEditorManagementNS.loadContent(this)' id=" + i + " data-id=" + ContractEditorManagementNS.EditorValue[i].sectionTemplateId + ">" + ContractEditorManagementNS.EditorValue[i].name + "</li>";
    } else {
      ContractEditorManagementNS.UpdateSectionRight(ContractEditorManagementNS.EditorValue[i], i);
    }
  }
  sectionLeft.append(valueLeft);
}

ContractEditorManagementNS.UpdateSectionRight = function (data, index) {
  var sectionRight = $("#sortableListRight");
  var i = index == -1 ? ContractEditorManagementNS.EditorValue.length - 1 : index;
  var valueRight = "<li class='list-item' ondblclick='ContractEditorManagementNS.loadContent(this)' id=" + i + " data-id=" + data.sectionTemplateId + ">" + data.name + "</li>";
  sectionRight.append(valueRight);
  ContractEditorManagementNS.LoadEditor();
}

ContractEditorManagementNS.GetAllSelectedSectionRight = function () {
  var arr = [];
  $('#sortableListRight li').each(function (i) {
    if ($(this).attr('id') !== 'placeholder') {
      if (i < $('#sortableListRight li').length) {
          var editor = $(".editorDiv");
        for (var i = 1; i < editor.length; i++) {
          if ($(this).attr('data-id') == editor[i].dataset.id) {
            var model = ContractEditorManagementNS.SectionSelectedContent($(this).attr('data-id'), editor[i].innerHTML);
            arr.push(model);
          }
        }
      }
    }
  });

  if (ContractEditorManagementNS.RemoveContractTemplate.length > 0) {
    for (var i = 0; i < ContractEditorManagementNS.RemoveContractTemplate.length; i++) {
      var model = {};
      model.RemoveContractSectionTemplateId = ContractEditorManagementNS.RemoveContractTemplate[i];
      arr.push(model);
    }
  }

  if (arr.length > 0) {
    var ret = arr.find(x => x.ContractSectionTemplateId != "00000000-0000-0000-0000-000000000000");
    var url = "api/Contract/createContractSectionTemplate";
    var type = 'POST';
    if (ret != undefined) {
      url = "api/Contract/updateContractSectionTemplate";
      type = 'PUT';
    }

    $.ajax({
      url: url,
      type: type,
      data: JSON.stringify(arr),
      contentType: 'application/json; charset=utf-8',
      success: function (data, textStatus, XMLHttpRequest) {
        if (data !== false && data !== "false") {
            ContractEditorManagementNS.ContractSectionTemplateArr = data;
            toastr.success('Contract Template successfully updated!');
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        toastr.error('Something went wrong with the saving contract section template request!');
      }
    });
  }
}

ContractEditorManagementNS.SectionSelectedContent = function (id, content) {
  var model = {};
    if (ContractEditorManagementNS.ControlValue == 'existing') {
        model.ContractTemplateId = ContractTemplateManagementNS.ContractTemplateId;
  } else {
    model.ContractTemplateId = ContractEditorManagementNS.ContractTemplateId;
  }
  if (ContractEditorManagementNS.ContractSectionTemplateArr != '') {
    var ret = ContractEditorManagementNS.ContractSectionTemplateArr.find(x => x.contractTemplateId === model.ContractTemplateId
      && x.sectionTemplateId === id);
    if (ret !== undefined) {
      model.ContractSectionTemplateId = ret.contractSectionTemplateId;
    } else {
      model.ContractSectionTemplateId = "00000000-0000-0000-0000-000000000000";
    }
  } else {
    var retTemp = ContractEditorManagementNS.EditorValue.find(x => x.sectionTemplateId === id && x.contractSectionTemplateId !== undefined);
    if (retTemp !== undefined) {
      model.ContractSectionTemplateId = retTemp.contractSectionTemplateId;
    } else {
      model.ContractSectionTemplateId = "00000000-0000-0000-0000-000000000000";
    }
  }

  model.SectionTemplateId = id;
  model.Content = content;
  return model;
}

ContractEditorManagementNS.LoadEditor = function () {
  var editor = $(".editorDiv").data("kendoEditor");
  var value = '';
    $('#sortableListRight li').each(function (i) {
    if ($(this).attr('id') !== 'placeholder') {
      var id = parseInt($(this).attr('id'));
        if (i < $('#sortableListRight li').length) {
             value += "<div class='editorDiv' id=" + id + " data-id=" + ContractEditorManagementNS.EditorValue[id].sectionTemplateId + " data-contractsectiontemplateid=" + ContractEditorManagementNS.EditorValue[id].contractSectionTemplateId + ">";
             editedSection = ContractEditorManagementNS.CheckIfSectionIsEdited(ContractEditorManagementNS.EditorValue[id].sectionTemplateId);
        if (editedSection !== '') {
          value += editedSection;
        } else {
            value += ContractEditorManagementNS.EditorValue[id].content !== undefined ? ContractEditorManagementNS.EditorValue[id].content : ContractEditorManagementNS.EditorValue[id].value;
        }
        value += "</div>";
      }
    }
    editor.value(value);
  });
}

ContractEditorManagementNS.loadContent = function (e) {
  var id = e.id;
  var name = e.textContent;
  //var iframe = $('#parentEditorDiv iframe').contents();
  //$('#sortableListRight li').each(function (i) {
  //    if (i == 0 && name == $(this)[0].textContent) {
  //        iframe.scrollTop(0);
  //        return false;
  //    } else {
  //        if (name == $(this)[0].textContent) {
  //            iframe.scrollTop(($(this).innerHeight() + $(this).innerWidth()) * id);
  //            return false;
  //        }
  //    }
  //});
}

ContractEditorManagementNS.tabShow = function () {
    var valEditor = $(".editorDiv").data("kendoEditor");
    valEditor.value("");

    if (ContractEditorManagementNS.ControlValue === 'existing') {
        $('#templateForm .k-dropdown').css('display', 'block');
        $("#ContractTemplate").css('display', 'none');
        $("#sortableListRight").empty();
        $('#templateForm span').html('<strong>' + ContractEditorManagementNS.TemplateName + '</strong>');
    }
    else if (ContractEditorManagementNS.ControlValue === 'new') {
        $('#templateForm .k-dropdown').css('display', 'none');
        $("#ContractTemplate").css('display', 'block');
        $("#ContractTemplate").val('');
        $("#sortableListRight").empty();
        $('#templateForm span').html('');
    }

    ContractEditorManagementNS.GetAllSectionTemplate(ContractTemplateManagementNS.ContractTemplateId);
}

ContractEditorManagementNS.initTagEditor = function () {
    $("#tag-type").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
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
                    url: 'api/contract/getAllContractTemplateTagType'
                }
            }
        },
        suggest: true
    });

    $("#tag-color").kendoColorPicker({
        buttons: false
    });
}

ContractEditorManagementNS.addTag = function (model) {
    $.ajax({
        url: 'api/contract/createTag',
        type: 'POST',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        success: function (data, textStatus, XMLHttpRequest) {
            if (data != false && data != "false") {
                ContractEditorManagementNS.AddBackgroundColorForSection($("#tag-color").val(), ContractEditorManagementNS.SelectedTag, data.contractTagId);
            }
            else {
                toastr.error('Tag already exist!');
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error('Something went wrong with the request!');
        }
    });
}

ContractEditorManagementNS.AddBackgroundColorForSection = function (color, name, contractTagId) {
    for (var i = 0; i < ContractEditorManagementNS.EditorValue.length; i++) {
        var bindText = 'ContractEditorManagementNS.' + name + "'";
        var newSectionValue = "<span style='color:white;padding:1px 5px;background-color:" + color + ";'>" + name + "</span>";

        ContractEditorManagementNS.EditorValue[i].content = ContractEditorManagementNS.EditorValue[i].content.replace(new RegExp(name, "g"), newSectionValue);
        if (ContractEditorManagementNS.EditorValue[i].content.indexOf(name) >= 0) {
            ContractEditorManagementNS.EditorValue[i].tags = contractTagId;
            ContractEditorManagementNS.updateContractSectionTag(ContractEditorManagementNS.EditorValue[i], contractTagId);
        }
    }
}

ContractEditorManagementNS.RemoveBackgroundColorForSection = function (color, name, contractTagId) {
    for (var i = 0; i < ContractEditorManagementNS.EditorValue.length; i++) {
        var oldSectionValue = "<span style='color:white;padding:1px 5px;background-color:" + color + ";'>" + name + "</span>";

        ContractEditorManagementNS.EditorValue[i].content = ContractEditorManagementNS.EditorValue[i].content.replace(new RegExp(oldSectionValue, "g"), name);

        if (ContractEditorManagementNS.EditorValue[i].content.indexOf(name) >= 0) {
            ContractEditorManagementNS.EditorValue[i].tags = contractTagId;
            ContractEditorManagementNS.removeContractSectionTag(ContractEditorManagementNS.EditorValue[i], contractTagId);
        }
    }
}

ContractEditorManagementNS.updateContractSectionTag = function (contractSection, contractTagId) {
    var model = {};
    model.ContractSectionId = contractSection.contractSectionTemplateId;
    model.Tags = contractTagId;
    model.Content = contractSection.content;

    $.ajax({
        url: 'api/contract/updateTagContractSectionTemplate/',
        type: 'POST',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            ContractEditorManagementNS.LoadEditor();

            toastr.success('Tag successfully added');

            ContractEditorManagementNS.SelectedTag = '';
            $("#tag-name span").text('');
            $("#tag-type").data("kendoComboBox").value("");

            $('#tag-create-popup').modal('toggle');
        }
    });
}

ContractEditorManagementNS.removeContractSectionTag = function (contractSection, contractTagId) {
    var model = {};
    model.ContractSectionId = contractSection.contractSectionTemplateId;
    model.Tags = contractTagId;
    model.Content = contractSection.content;

    $.ajax({
        url: 'api/contract/deleteTagContractSectionTemplate/',
        type: 'POST',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            ContractEditorManagementNS.LoadEditor();

            toastr.success('Tag successfully removed');
        }
    });
}

function getIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
        if (data[i][key] == value) {
            return i;
        }
    }
    return -1;
}