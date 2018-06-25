var ContractEditorNS = {};
ContractEditorNS.EditorValue = '';
ContractEditorNS.TagsData = [];
ContractEditorNS.Name = '';
ContractEditorNS.TemplateContractValue = '';
ContractEditorNS.ContractId = '';
ContractEditorNS.SelSectionCount = 0;
ContractEditorNS.NewContractType = '';
ContractEditorNS.editor = '';
ContractEditorNS.newEditor = '';
ContractEditorNS.SelectedTag = '';
ContractEditorNS.AvailableTags = [];
ContractEditorNS.IsTagValue = false;
ContractEditorNS.PreviousTagValue = '';
ContractEditorNS.Permission = '';
ContractEditorNS.PrevVersion = 1;

ContractEditorNS.init = function (contractId) {
    ContractEditorNS.ContractId = contractId !== null ? contractId : ContractWizardNS.ContractId;
    ContractEditorNS.initializeKendoEditorAndDnD();
    ContractEditorNS.initTagEditor();
}

ContractEditorNS.initializeKendoEditorAndDnD = function () {
    ContractEditorNS.IsReadOnly();
    var createTagValidator = $("#form-contract-tag-create").kendoValidator().data("kendoValidator");

    $(".editor").kendoEditor({
        tools: ["bold", "italic", "underline", "strikethrough", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "insertUnorderedList", "insertOrderedList", "indent", "outdent", "createLink", "unlink", "tableWizard", "createTable", "addRowAbove", "addRowBelow", "addColumnLeft", "addColumnRight", "deleteRow", "deleteColumn", "viewHtml", "formatting", "cleanFormatting", "fontName", "fontSize", "foreColor",
            {
                name: "addTag",
                tooltip: "Add Tag",
                exec: function (e) {
                    var editor = $(".editor").data("kendoEditor");
                    var textSelected = editor.getRange().toString().trim();
                    var textSelectedWordCount = textSelected.split(/\s+|\./).length
                    ContractEditorNS.SelectedTag = textSelected;
                    $('#contract-tag-create-popup').modal('hide');
                    if (textSelectedWordCount > 1 || textSelected == '') {
                        toastr.error('Please highlight one word only!');
                    }
                    else {
                        if (tagExist(textSelected)) {
                            toastr.error('Tag already Exist!');
                        }
                        else {
                            $("#contract-tag-name span").text(textSelected);
                            $('#contract-tag-create-popup').modal('show');
                        }
                    }
                }
            },
            {
                name: "deleteTag",
                tooltip: "Delete Tag",
                exec: function (e) {
                    var editor = $(".editor").data("kendoEditor");
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
                                    ContractEditorNS.RemoveBackgroundColorForSection(data.color, data.name, data.contractTagId);
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
    $("#textAreaEditor").kendoEditor({
        tools: ["bold", "italic", "underline", "strikethrough", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "insertUnorderedList", "insertOrderedList", "indent", "outdent", "createLink", "unlink", "insertImage", "insertFile", "tableWizard", "createTable", "addRowAbove", "addRowBelow", "addColumnLeft", "addColumnRight", "deleteRow", "deleteColumn", "viewHtml", "formatting", "cleanFormatting", "fontName", "fontSize", "foreColor"]
    });

    ContractEditorNS.editor = $(".editor").data("kendoEditor");
    ContractEditorNS.newEditor = $("#textAreaEditor").data("kendoEditor");
    
    $("form#form-contract-tag-create").submit(function (e) {
        e.preventDefault();

        if (createTagValidator.validate()) {
            var model = {};
            model.ContractTagId = null;
            model.Name = ContractEditorNS.SelectedTag;
            model.Type = $("#contract-tag-type").val();

            if (model.Type == "Text") {
                model.Value = $("#contract-tag-value-text").val();
            }
            else if (model.Type == "Date") {
                model.Value = $("#contract-tag-value-datetime").val();
            }
            else if (model.Type == "Int") {
                model.Value = $("#contract-tag-value-int").val();
            }
            else if (model.Type == "Decimal") {
                model.Value = $("#contract-tag-value-decimal").val();
            }
            model.Color = $("#contract-tag-color").val();

            ContractEditorNS.addTag(model);
        }
    })

    $("#sortableListLeft").kendoSortable({
        connectWith: "#sortableListRight",
        placeholder: ContractEditorNS.placeholder,
        end: ContractEditorNS.onEndRemove
    });

    $("#sortableListRight").kendoSortable({
        connectWith: "#sortableListLeft",
        placeholder: ContractEditorNS.placeholder,
        end: ContractEditorNS.onEnd
    });

    $("#sortableListRight li").on("dblclick", ".item", function () { });

    $("#btnCompareTemplate").click(function (e) {
        e.preventDefault();
        var url = window.location.origin + "/" + "Contract/ContractVersion?contractId=" + ContractEditorNS.ContractId + "&contractTemplateId=" + ContractEditorNS.TemplateContractValue;
        window.open(url);
    });

    ContractEditorNS.GetContractType();

    $(".editor").mouseleave(function (e) {
        e.preventDefault();
        console.log("save content");
        var editor = $(".editor");
        var updateContractStatus = true;
        for (var i = 1; i < editor.length; i++) {
            var retEditor = ContractEditorNS.EditorValue.find(x => x.sectionTemplateId === editor[i].dataset.id);
            if (retEditor !== undefined) {
                var indexEditor = jQuery.inArray(retEditor, ContractEditorNS.EditorValue);

                if (ContractEditorNS.EditorValue[indexEditor].content !== editor[i].innerHTML
                    && ContractEditorNS.IsTagValue === false && ContractEditorNS.EditorValue[indexEditor].sectionTemplateId !== "a0428daa-f20e-4a57-98f5-b02d96fdefdf") {
                    if (ContractEditorNS.Permission.updateContractVersion == true &&
                        (ContractEditorNS.Permission.status === 2 || ContractEditorNS.Permission.status===7)) {
                        if (updateContractStatus && ContractEditorNS.PrevVersion == ContractEditorNS.EditorValue[indexEditor].version) {
                            ContractEditorNS.EditorValue[indexEditor].content = editor[i].innerHTML;
                            ContractEditorNS.updateContractSectionToDraft();
                            updateContractStatus = false;
                            ContractEditorNS.Permission.updateContractVersion = false;
                        }
                    } else {
                        ContractEditorNS.EditorValue[indexEditor].content = editor[i].innerHTML;
                        ContractEditorNS.UpdateContractSection(ContractEditorNS.EditorValue[indexEditor]);
                    }
                } 
            }
        }
    });

    $("#btnAddSection").click(function (e) {
        e.preventDefault();
        ContractEditorNS.clearSectionPopUp();
        $('#instance-section-create-popup').modal('show');
    });

    $("#btnSaveSection").click(function (e) {
        e.preventDefault();
        $('#instance-section-create-popup').modal('hide');
        ContractEditorNS.saveSection();
    });

    $("#change-contract-type").click(function (e) {
        e.preventDefault();
        $("#contract-change-type-popup").modal('hide');
        ContractEditorNS.DeleteContractTypeByContract();
    });

    $("#contract-type-dismiss").click(function (e) {
        e.preventDefault();
        $("#drpContractTemplate").data('kendoDropDownList').select(0);
    });

    $("#contract-change-close").click(function (e) {
        e.preventDefault();
        $("#drpContractTemplate").data('kendoDropDownList').select(0);
    });

    $("#btnAddTags").click(function (e) {
        e.preventDefault();
        $('#instance-tags-create-popup').modal('show');
    });

    $("#btnPreviewInstanceTemplate").click(function (e) {
        e.preventDefault();
        var url = window.location.origin + "/" + "Contract/ContractPreview?contractId=" + ContractEditorNS.ContractId + "&contractTemplateId=" + ContractEditorNS.TemplateContractValue;
        window.open(url);
    });
    
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

    $("#btnToggleTagsValue").click(function (e) {
        e.preventDefault();
        ContractEditorNS.ToggleEditorContent('');
    });
}

ContractEditorNS.ToggleEditorContent = function (update) {
    var editor = $(".editor");
    var value = '';
    for (var i = 1; i < editor.length; i++) {
        var retEditor = ContractEditorNS.EditorValue.find(x => x.sectionTemplateId === editor[i].dataset.id);
        if (retEditor !== undefined) {
            var indexEditor = jQuery.inArray(retEditor, ContractEditorNS.EditorValue);
            value += "<div class='editor' id=" + indexEditor + " data-id=" + ContractEditorNS.EditorValue[indexEditor].sectionTemplateId + " data-contractsectionid=" + ContractEditorNS.EditorValue[indexEditor].contractSectionId + ">";
            if (update === 'tagUpdate') {
                value += ContractEditorNS.ReplaceTagContentValue(ContractEditorNS.EditorValue[indexEditor].tags, editor[i].innerHTML,update);
            } else {
                if (ContractEditorNS.IsTagValue) {
                    value += ContractEditorNS.ReplaceContentName(ContractEditorNS.EditorValue[indexEditor].tags, editor[i].innerHTML);
                } else {
                    value += ContractEditorNS.ReplaceTagContentValue(ContractEditorNS.EditorValue[indexEditor].tags, editor[i].innerHTML, update);
                }
            }
            
            value += "</div>";
        }
    }
    if (update !== 'tagUpdate') {
        ContractEditorNS.IsTagValue = ContractEditorNS.IsTagValue == false ? true : false;
    }
    ContractEditorNS.editor.value(value);
}

ContractEditorNS.ReplaceTagContentValue = function (tags, content,update) {
    if (tags) {
        var arr = tags.split(',');
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                var ret = ContractEditorNS.TagsData.find(x => x.contractTagId === arr[i]);
                if (ret !== undefined) {
                    var name = update === 'tagUpdate' ? ContractEditorNS.PreviousTagValue : ret.name;
                    content = content.replace(new RegExp(name, "g"), ret.value);
                }
            }
        } else {
            var ret = ContractEditorNS.TagsData.find(x => x.contractTagId === arr[0]);
            if (ret !== undefined) {
                var name = update === 'tagUpdate' ? ContractEditorNS.PreviousTagValue : ret.name;
                content = content.replace(new RegExp(name, "g"), ret.value);
            }
        }
    }

    return content;
}

ContractEditorNS.ReplaceContentName = function (tags, content) {
    if (tags) {
        var arr = tags.split(',');
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                var ret = ContractEditorNS.TagsData.find(x => x.contractTagId === arr[i]);
                if (ret !== undefined) {
                    content = content.replace(new RegExp(ret.value, "g"), ret.name);
                }
            }
        } else {
            var ret = ContractEditorNS.TagsData.find(x => x.contractTagId === arr[0]);
            if (ret !== undefined) {
                content = content.replace(new RegExp(ret.value, "g"), ret.name);
            }
        }
    }

    return content;
}

ContractEditorNS.clearSectionPopUp = function () {
    $('#section-add-name').val("");
    ContractEditorNS.newEditor.value(" ");
}

ContractEditorNS.IsReadOnly = function () {
    $.ajax({
        url: "api/Contract/getContractData/" + ContractEditorNS.ContractId,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            $("#lockIcon").css("pointer-events", "none");
            if (data !== false && data !== "false") {
                if (data) {
                    ContractEditorNS.Permission = data;
                    if (data.canWrite == false) {
                        $("#divContractType").css('pointer-events', 'none');
                        $("#divSearch").css('pointer-events', 'none');
                        $("#divEditorWrapper").css('pointer-events', 'none');
                        $("#lockIcon").show();
                    } else {
                        $("#divContractType").css('pointer-events', '');
                        $("#divSearch").css('pointer-events', '');
                        $("#divEditorWrapper").css('pointer-events', '');
                        $("#lockIcon").hide();
                    }
                } else {
                    $("#divContractType").css('pointer-events', 'none');
                    $("#divSearch").css('pointer-events', 'none');
                    $("#divEditorWrapper").css('pointer-events', 'none');
                    $("#lockIcon").show();
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error('Something went wrong with getting contract info!');
        }
    });
}

ContractEditorNS.updateContractSectionToDraft = function () {
    var model = {};
    model.ContractId = ContractEditorNS.ContractId;
    model.Version = ContractEditorNS.EditorValue[0].version;
    model.Version += 1;
    console.log(model);
    $.ajax({
        url: "api/Contract/updateContractVersion",
        type: 'POST',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            if (data !== false && data !== "false") {
                for (var i = 0; i < ContractEditorNS.EditorValue.length; i++) {
                    if (ContractEditorNS.EditorValue[i].contractSectionId !== null ||
                        ContractEditorNS.EditorValue[i].contractSectionId === "00000000-0000-0000-0000-000000000000") {
                        ContractEditorNS.EditorValue[i].version += 1;
                        ContractEditorNS.EditorValue[i].status = 1;
                        ContractEditorNS.EditorValue[i].remarks = "";
                        ContractEditorNS.EditorValue[i].nonOwnerRemarks = "";
                        ContractEditorNS.EditorValue[i].onOwnerStatus = 1;
                        ContractEditorNS.EditorValue[i].nonOwnerApprover = "00000000-0000-0000-0000-000000000000";
                        ContractEditorNS.UpdateContractSection(ContractEditorNS.EditorValue[i]);
                    }
                }
                $("#lblVersion").text("Version " + ContractEditorNS.EditorValue[0].version);
                if (ContractEditorNS.EditorValue[0].version === 1) {
                    $("#lblContractStatus").text("Draft");
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error('Something went wrong with the saving contract section request!');
        }
    });
};

ContractEditorNS.saveSection = function () {
    var createSectionValidator = $("#form-section-create").kendoValidator().data("kendoValidator");
    if (createSectionValidator.validate()) {
        var model = {};
        model.SectionTemplateId = "00000000-0000-0000-0000-000000000000";
        model.Name = $('#section-add-name').val();
        model.Value = ContractEditorNS.newEditor.value();
        model.OrderNo = $("#section-add-ordernum").val();

        $.ajax({
            url: "api/Contract/createSection",
            type: 'POST',
            data: JSON.stringify(model),
            contentType: 'application/json; charset=utf-8',
            async: false,
            success: function (data, textStatus, XMLHttpRequest) {
                if (data !== false && data !== "false") {
                    ContractEditorNS.CreateContractSection(data, 1);
                    toastr.success('Contract section successfully added');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error('Something went wrong with the saving contract section request!');
            }
        });
    }
}

ContractEditorNS.CreateContractSection = function (data, add) {
    var index = jQuery.inArray(data, ContractEditorNS.EditorValue);
    ContractEditorNS.TemplateContractValue = $("#drpContractTemplate").val();
    var model = {};
    model.ContractTemplateId = ContractEditorNS.TemplateContractValue;
    model.ContractId = ContractEditorNS.ContractId;
    model.SectionTemplateId = data.sectionTemplateId;
    model.Content = data.value !== undefined ? data.value : data.content;
    model.Tags = '';
    model.OrderNo = data.orderNo;
    model.Status = 1;
    model.Name = data.name;
    model.Version = 1;
    model.Title = $("#drpContractTemplate").data("kendoDropDownList").text();
    $.ajax({
        url: "api/Contract/createContractSection",
        type: 'POST',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            if (data !== false && data !== "false") {
                ContractEditorNS.clearSectionPopUp();
                if (index > -1) {
                    ContractEditorNS.EditorValue[index].contractSectionId = data.contractSectionId;
                    ContractEditorNS.EditorValue[index].contractId = data.contractId;
                    ContractEditorNS.EditorValue[index].contractTemplateId = data.contractTemplateId;
                    ContractEditorNS.EditorValue[index].selected = 1;
                    ContractEditorNS.EditorValue[index].version = data.version;
                    ContractEditorNS.EditorValue[index].status = data.status;
                } else {
                    data.selected = 1;
                    ContractEditorNS.EditorValue.push(data);
                }
                if (add === 1) {
                    ContractEditorNS.loadRightSection();
                }
                if (ContractEditorNS.Permission.updateContractVersion == true &&
                    (ContractEditorNS.Permission.status === 2 || ContractEditorNS.Permission.status === 7)) {
                    if (ContractEditorNS.PrevVersion == ContractEditorNS.EditorValue[index].version) {
                        ;
                        ContractEditorNS.updateContractSectionToDraft();
                        ContractEditorNS.Permission.updateContractVersion = false;
                    }
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error('Something went wrong with the saving contract section request!');
        }
    });
}

ContractEditorNS.DeleteContractSection = function (contractSection) {
    $.ajax({
        url: "api/Contract/deleteContractSection/" + contractSection.contractSectionId,
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            if (data !== false && data !== "false") {
                var index = jQuery.inArray(contractSection, ContractEditorNS.EditorValue);
                ContractEditorNS.EditorValue[index].contractSectionId = null;
                ContractEditorNS.EditorValue[index].contractId = null;
                ContractEditorNS.EditorValue[index].contractTemplateId = null;
                ContractEditorNS.EditorValue[index].selected = 0;
                if (ContractEditorNS.Permission.updateContractVersion == true &&
                    (ContractEditorNS.Permission.status === 2 || ContractEditorNS.Permission.status === 7)) {
                    if (ContractEditorNS.PrevVersion == ContractEditorNS.EditorValue[index].version) {
                        ContractEditorNS.updateContractSectionToDraft();
                        ContractEditorNS.Permission.updateContractVersion = false;
                    }
                }
                toastr.success('Contract section successfully remove');
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error('Something went wrong with the saving contract section request!');
        }
    });
}

ContractEditorNS.DeleteContractTypeByContract = function () {
    $.ajax({
        url: "api/Contract/deleteContractType/" + ContractEditorNS.ContractId,
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            if (data !== false && data !== "false") {
                ContractEditorNS.loadContentTemplateData(ContractEditorNS.TemplateContractValue);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error('Something went wrong with the saving contract section request!');
        }
    });
}

ContractEditorNS.UpdateContractSection = function (model) {
    $.ajax({
        url: "api/Contract/updateContractSection",
        type: 'POST',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        async: true,
        success: function (data, textStatus, XMLHttpRequest) {
            if (data !== false && data !== "false") {

            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error('Something went wrong in updating contract section data request!');
        }
    });
}

ContractEditorNS.GetContractType = function () {
    if (ContractEditorNS.Permission.canView) {
        $("#btnPreviewInstanceTemplate").prop('disabled', false);
        $("#btnCompareTemplate").prop('disabled', false);
        $("#btnToggleTagsValue").prop('disabled', false);
        var url = '';
        if (ContractEditorNS.Permission.updateContractVersion) {
            url = "api/Contract/getAllContractTypeByEntityIdPreviousVersion?contractId=" + ContractEditorNS.ContractId;
        } else {
            url = "api/Contract/getAllContractTypeByEntityId?contractId=" + ContractEditorNS.ContractId;
        }
        $("#drpContractTemplate").kendoDropDownList({
            dataTextField: "title",
            dataValueField: "contractTemplateId",
            dataSource: {
                transport: {
                    read: {
                        dataType: "json",
                        url: url,
                        async: false
                    }
                }
            },
            index: 0,
            change: ContractEditorNS.onChangeTemplate,
            dataBound: ContractEditorNS.ContractTemplateDataBound
        }).data("kendoDropDownList");
    } else {
        $("#btnPreviewInstanceTemplate").prop('disabled', true);
        $("#btnCompareTemplate").prop('disabled', true);
        $("#btnToggleTagsValue").prop('disabled', true);
    }
}

ContractEditorNS.ContractTemplateDataBound = function () {
    ContractEditorNS.TemplateContractValue = this.value();
    ContractEditorNS.loadContentTemplateData(ContractEditorNS.TemplateContractValue);
}

ContractEditorNS.onChangeTemplate = function () {
    ContractEditorNS.TemplateContractValue = this.value();
    $("#contract-change-type-popup").modal('show');
}

ContractEditorNS.placeholder = function (element) {
    return $("<li class='list-item' id='placeholder'>Drop Here!</li>");
}

ContractEditorNS.loadContentTemplateData = function (templateId) {
    var model = {};
    model.ContractTemplateId = templateId;
    model.ContractId = ContractEditorNS.ContractId;
    var url = "";
    if (ContractEditorNS.Permission.canView == true && ContractEditorNS.Permission.canWrite == false) {
        url = "api/Contract/getAllContractSectionByTemplateIdPreviousVersion";
    } else {
        url = "api/Contract/getAllContractSectionByTemplateId";
    }
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            if (data != false && data != "false") {
                $("#lblVersion").text("Version " + data[0].version);
                ContractEditorNS.AvailableTags = [];
                ContractEditorNS.EditorValue = data;
                ContractEditorNS.PrevVersion = ContractEditorNS.EditorValue[0].version;
                ContractEditorNS.loadLeftSection();
                ContractEditorNS.loadRightSection();
                ContractEditorNS.GetSectionTags();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            toastr.error('Something went wrong with the request!');
        }
    });
}

ContractEditorNS.GetSectionTags = function () {
    if (ContractEditorNS.AvailableTags.length > 0) {
        $.ajax({
            url: "api/Contract/getAllSectionTags",
            type: 'POST',
            data: JSON.stringify(ContractEditorNS.AvailableTags),
            contentType: 'application/json; charset=utf-8',
            async: false,
            success: function (data, textStatus, XMLHttpRequest) {
                if (data != false && data != "false") {
                    ContractEditorNS.TagsData = data;
                    ContractEditorNS.GetContentType(data);
                    $("#btnToggleTagsValue").prop('disabled', false);
                } else {
                    $('#grdTags').append("No tags available.");
                    $("#btnToggleTagsValue").prop('disabled', true);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error('Something went wrong with GetSectionTags request!');
            }
        });
    } else {
        $('#grdTags').append("No tags available.");
        $("#btnToggleTagsValue").prop('disabled', true);
    }

}

ContractEditorNS.loadLeftSection = function () {
    var sectionLeft = $("#sortableListLeft").empty();
    var valueLeft = "";
    for (i = 0; i < ContractEditorNS.EditorValue.length; i++) {
        if (ContractEditorNS.EditorValue[i].contractSectionId === undefined
            || ContractEditorNS.EditorValue[i].selected === 0) {
            valueLeft += "<li class='list-item' ondblclick='ContractEditorNS.loadContent(this)' id=" + i + " data-id=" + ContractEditorNS.EditorValue[i].sectionTemplateId + ">" + ContractEditorNS.EditorValue[i].name + "</li>";
        }
        ContractEditorNS.SplitTagsAvailable(ContractEditorNS.EditorValue[i].tags);
    }
    sectionLeft.append(valueLeft);
}

ContractEditorNS.SplitTagsAvailable = function (data) {
    if (data) {
        var arr = data.split(',');
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                var item = {};
                item.ContractTagId = arr[i];
                var ret = ContractEditorNS.AvailableTags.find(x => x.ContractTagId === arr[i]);
                if (ret === undefined) {
                    ContractEditorNS.AvailableTags.push(item);
                }
            }
        } else {
            var item = {};
            item.ContractTagId = arr[0];
            ContractEditorNS.AvailableTags.push(item);
        }
    }
}

ContractEditorNS.loadRightSection = function () {
    var sectionRight = $("#sortableListRight").empty();
    var valueRight = "";
    for (i = 0; i < ContractEditorNS.EditorValue.length; i++) {
        if (ContractEditorNS.EditorValue[i].selected > 0) {
            valueRight += "<li class='list-item' ondblclick='ContractEditorNS.loadContent(this)' id=" + i + " data-id=" + ContractEditorNS.EditorValue[i].sectionTemplateId + ">" + ContractEditorNS.EditorValue[i].name + "</li>";
            ContractEditorNS.EditorValue[i].orderNo = i + 1;
            if (ContractEditorNS.EditorValue[i].contractId === null) {
                ContractEditorNS.CreateContractSection(ContractEditorNS.EditorValue[i], 0);
            }
            if (ContractEditorNS.EditorValue[i].status == 4
                || (ContractEditorNS.Permission.updateContractVersion == true && ContractEditorNS.Permission.status > 0)) {
                var template = $("#drpContractTemplate").data("kendoDropDownList");
                template.enable(false);
            }
        }
    }
    sectionRight.append(valueRight);
    ContractEditorNS.LoadEditor();
}

ContractEditorNS.GetContentType = function (data) {
    $('#grdTags').empty();
    if (data.length > 0) {
        var htmlValue = '<table class="table table-bordered table-hover"><thead><tr><th>Tag Name</th><th>Values</th></tr></thead>';
        for (i = 0; i < data.length; i++) {
            var type = data[i].type;
            var name = data[i].name;
            var bindText = 'ContractEditorNS.' + name;
            if (type === "Text") {
                htmlValue += "<tr><td draggable='true' ondragstart='ContractEditorNS.dragTags(event)' id=" + data[i].contractTagId + "><span class='color-box' style=background-color:" + data[i].color + "></span>" + name + "</td><td><input id=" + "txt" + data[i].contractTagId + " onmouseleave='ContractEditorNS.tagSave(this)' class='k-textbox' type='text' name=" + data[i].contractTagId + " value=" + data[i].value + " data-bind=value:" + bindText + ",keyup: ContractEditorNS.handler></td></tr>";
            } else if (type === "Date") {
                htmlValue += "<tr><td draggable='true' ondragstart='ContractEditorNS.dragTags(event)' id=" + data[i].contractTagId + "><span class='color-box' style=background-color:" + data[i].color + "></span>" + name + "</td><td><input id=" + "dt" + data[i].contractTagId + " onmouseleave='ContractEditorNS.tagSave(this)'  name=" + data[i].contractTagId + " value=" + data[i].value + " data-bind=html:" + bindText + ",valueUpdate:'afterkeydown'></td></tr>";
            } else if (type === "Int"){
                htmlValue += "<tr><td draggable='true' ondragstart='ContractEditorNS.dragTags(event)' id=" + data[i].contractTagId + "><span class='color-box' style=background-color:" + data[i].color + "></span>" + name + "</td><td><input id=" + "int" + data[i].contractTagId + " onmouseleave='ContractEditorNS.tagSave(this)'  class='k-textbox' type='text' name=" + data[i].contractTagId + "tag_" + data[i].contractTagId + " value=" + data[i].value + " data-bind=html:" + bindText + ",valueUpdate:'afterkeydown'></td></tr>";
            } else if (type === "Decimal") {
                htmlValue += "<tr><td draggable='true' ondragstart='ContractEditorNS.dragTags(event)' id=" + data[i].contractTagId + "><span class='color-box' style=background-color:" + data[i].color + "></span>" + name + "</td><td><input id=" + "decimal" + data[i].contractTagId + " onmouseleave='ContractEditorNS.tagSave(this)'  class='k-textbox' type='text' name=" + data[i].contractTagId + "tag_" + data[i].contractTagId + " value=" + data[i].value + " data-bind=html:" + bindText + ",valueUpdate:'afterkeydown'></td></tr>";
        }

        }
        htmlValue += "</table>";

        $('#grdTags').append(htmlValue);
        for (j = 0; j < data.length; j++) {
            var typeVal = data[j].type;
            var id = "#dt" + data[j].contractTagId;
            if (typeVal === "Date") {
                $(id).kendoDateTimePicker({
                    value: new Date(),
                    dateInput: true
                });
            } else if (typeVal === "Decimal") {
                var id = "#decimal" + data[j].contractTagId;
                $(id).kendoNumericTextBox();
            } else if (typeVal === "Int") {
                var id = "#int" + data[j].contractTagId;
                $(id).kendoNumericTextBox({ format: "#", decimals: 0 });
            }
        }
        $('#grdTags').toggleClass("no-tag-red");
        $("#btnToggleTagsValue").prop('disabled', false);
    } else {
        $('#grdTags').append("No tags available.");
        $('#grdTags').toggleClass("no-tag-red");
        $("#btnToggleTagsValue").prop('disabled', true);
    }
}

ContractEditorNS.tagSave = function (e) {
    var ret = ContractEditorNS.TagsData.find(x => x.contractTagId === e.name);
    if (ret) {
        if (ret.value !== e.value) {
            ContractEditorNS.PreviousTagValue = ret.value;
            var indexTag = jQuery.inArray(ret, ContractEditorNS.TagsData);
            ContractEditorNS.TagsData[indexTag].value = e.value;
            $.ajax({
                url: 'api/contract/updateContractTag/',
                type: 'PUT',
                data: JSON.stringify(ContractEditorNS.TagsData[indexTag]),
                contentType: 'application/json; charset=utf-8',
                async: false,
                success: function (data, textStatus, XMLHttpRequest) {
                    if (ContractEditorNS.IsTagValue == true) {
                        ContractEditorNS.ToggleEditorContent('tagUpdate');
                    }
                    toastr.success('Contract tag successfully updated!');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    toastr.error('Something went wrong with the saving contract tag request!');
                }
            });
        }
    }
}

ContractEditorNS.AddBackgroundColorForSection = function (color, name, contractTagId) {
    for (var i = 0; i < ContractEditorNS.EditorValue.length; i++) {
        var bindText = 'ContractEditorNS.' + name + "'";
        var newSectionValue = '<span style="color:white;padding:1px 5px;background-color:' + color + ';">' + name + "</span>";

        ContractEditorNS.EditorValue[i].content = ContractEditorNS.EditorValue[i].content.replace(new RegExp(name, "g"), newSectionValue);
        if (ContractEditorNS.EditorValue[i].content.indexOf(name) >= 0) {
            ContractEditorNS.EditorValue[i].tags = contractTagId;
            ContractEditorNS.updateContractSectionTag(ContractEditorNS.EditorValue[i], contractTagId);
        }
    }
}

ContractEditorNS.LoadEditor = function () {
    var value = '';
    ContractEditorNS.editor.value(value);
    ContractEditorNS.SelSectionCount = $('#sortableListRight li').length;
    $('#sortableListRight li').each(function (i) {
        if ($(this).attr('id') !== 'placeholder') {
            var id = parseInt($(this).attr('id'));
            if (i < $('#sortableListRight li').length) {
                if (ContractEditorNS.EditorValue[id].sectionTemplateId == "a0428daa-f20e-4a57-98f5-b02d96fdefdf") {
                    value += "<div class='editor' id='productEditor' data-id=" + ContractEditorNS.EditorValue[id].sectionTemplateId + " data-contractsectionid=" + ContractEditorNS.EditorValue[id].contractSectionId + ">";
                 } else {
                    value += "<div class='editor' id=" + id + " data-id=" + ContractEditorNS.EditorValue[id].sectionTemplateId + " data-contractsectionid=" + ContractEditorNS.EditorValue[id].contractSectionId + ">";
                }
                
                value += ContractEditorNS.EditorValue[id].content;
                value += "</div>";
            }
        }
        ContractEditorNS.editor.value(value);
       // $("#tblProduct").attr("contenteditable", false);
        $(".k-editor-inline #productEditor").attr("contenteditable", false);
    });
}

ContractEditorNS.dragTags = function (ev) {
    var editorWrapper = $("#editorWrapper");
    var ret = ContractEditorNS.TagsData.find(x => x.contractTagId === ev.target.id);
    if (ret) {
        ContractEditorNS.ToggleEditorContent('');
        var type = ret.type;
        var indexTag = jQuery.inArray(ret, ContractEditorNS.TagsData);
        var id = "";
        if (type === "Text") {
            id = "#txt" + ev.target.id;
        } else if (type === "Date") {
            id = "#dt" + ev.target.id;
        } else if (type === "Int") {
            id = "#int" + ev.target.id;
        } else if (type === "Decimal") {
            id = "#decimal" + ev.target.id;
        }
        console.log("color:" + ContractEditorNS.TagsData[indexTag].color);
        var value = "&nbsp;<span style='color: white; padding: 1px 5px; background-color: " + ContractEditorNS.TagsData[indexTag].color + ";' >" + ContractEditorNS.TagsData[indexTag].name +"</span>&nbsp;";
        ev.dataTransfer.setData("text/html", value);
    }
}

ContractEditorNS.onEnd = function (e) {
    var value = '';
    var id = e.item[0].id
    var action = e.action;
    var sectionId = e.item[0].dataset.id;
    ContractEditorNS.SelSectionCount = $('#sortableListRight li').length;
    var count = 0;
    var isAddNewSection = false;
    $('#sortableListRight li').each(function (i) {
        if ($(this).attr('id') === 'placeholder') {
            count += 1;
            value += "<div id='editorDiv' id=" + id + " data-id=" + ContractEditorNS.EditorValue[id].sectionTemplateId + ">";
            value += ContractEditorNS.EditorValue[id].content;
            value += "</div>";
            ContractEditorNS.EditorValue[id].orderNo = count;
            var ret = ContractEditorNS.EditorValue.find(x => x.sectionTemplateId === sectionId && x.selected > 0);
            if (ret === undefined) {
                isAddNewSection = true;
                ContractEditorNS.CreateContractSection(ContractEditorNS.EditorValue[id], 1);
            }
        } else {
            if (id !== $(this).attr('id')) {
                count += 1;
                var idDiv = parseInt($(this).attr('id'));
                value += "<div class='editor' id=" + idDiv + " data-id=" + ContractEditorNS.EditorValue[idDiv].sectionTemplateId + ">";
                value += ContractEditorNS.EditorValue[idDiv].content;
                value += "</div>";
                ContractEditorNS.EditorValue[idDiv].orderNo = count;
            }
        }
        ContractEditorNS.editor.value(value);
    });
    if (ContractEditorNS.Permission.updateContractVersion == true && isAddNewSection === false &&
        (ContractEditorNS.Permission.status === 2 || ContractEditorNS.Permission.status === 7)) {
        if (ContractEditorNS.PrevVersion == ContractEditorNS.EditorValue[0].version) {
            ContractEditorNS.updateContractSectionToDraft();
            ContractEditorNS.Permission.updateContractVersion = false;
        }
    } else {
        if (isAddNewSection === false) {
            for (var i = 0; i < ContractEditorNS.EditorValue.length; i++) {
                ContractEditorNS.UpdateContractSection(ContractEditorNS.EditorValue[i]);
            }
        }
    }
}

ContractEditorNS.onEndRemove = function (e) {
    var value = '';
    var action = e.action;
    var sectionId = e.item[0].dataset.id;
    ContractEditorNS.SelSectionCount = $('#sortableListRight li').length;
    $('#sortableListRight li').each(function (i) {
        if ($('#sortableListRight li').length === 0) {
            value = '';
            ContractEditorNS.editor.value('');
        }
        if (action !== "receive") {
            if ($(this).attr('id') !== 'placeholder') {
                if (i < (parseInt($('#sortableListRight li').length))) {
                    var id = parseInt($(this).attr('id'));
                    value += "<div class='editor' id=" + id + " data-id=" + ContractEditorNS.EditorValue[id].sectionTemplateId + ">";
                    value += ContractEditorNS.EditorValue[id].content;
                    value += "</div>";
                }
            }
            ContractEditorNS.editor.value(value);
        } else {
            if ($(this).attr('id') !== 'placeholder') {
                if (i < (parseInt($('#sortableListRight li').length))) {
                    var id = parseInt($(this).attr('id'));
                    if ($(this).attr('data-id') === sectionId &&
                        ContractEditorNS.EditorValue[id].sectionTemplateId !== "a0428daa-f20e-4a57-98f5-b02d96fdefdf") {
                        ContractEditorNS.SelSectionCount -= 1;
                        ContractEditorNS.DeleteContractSection(ContractEditorNS.EditorValue[id]);
                    } else if ($(this).attr('data-id') === sectionId &&
                        ContractEditorNS.EditorValue[id].sectionTemplateId === "a0428daa-f20e-4a57-98f5-b02d96fdefdf") {
                        e.preventDefault();
                        toastr.info('Cannot remove Product Section');
                        return false;
                    }
                }
            }
        }
    });
}

ContractEditorNS.loadContent = function (e) {
    var id = e.id;
    var name = e.textContent;
    var iframe = $('#editorWrapper iframe').contents();
    $('#sortableListRight li').each(function (i) {
        if (i === 0 && name === $(this)[0].textContent) {
            iframe.scrollTop(0);
            return false;
        } else {
            if (name === $(this)[0].textContent) {
                iframe.scrollTop(($(this).innerHeight() + $(this).innerWidth()) * id);
                return false;
            }
        }
    });
}

ContractEditorNS.initTagEditor = function () {
    $("#contract-tag-type").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        change: function (e) {
            var widget = e.sender;
            if (widget.value() && widget.select() === -1) {
                widget.value("");
            }

            if (widget.value() == "Text") {
                $("#form-tag-text").show();
                $("#form-tag-datetime").hide();
                $("#form-tag-int").hide();
                $("#form-tag-decimal").hide();
            }
            else if (widget.value() == "Date") {
                $("#form-tag-text").hide();
                $("#form-tag-datetime").show();
                $("#form-tag-int").hide();
                $("#form-tag-decimal").hide();
            }
            else if (widget.value() == "Int") {
                $("#form-tag-text").hide();
                $("#form-tag-datetime").hide();
                $("#form-tag-int").show();
                $("#form-tag-decimal").hide();
            }
            else if (widget.value() == "Decimal") {
                $("#form-tag-text").hide();
                $("#form-tag-datetime").hide();
                $("#form-tag-int").hide();
                $("#form-tag-decimal").show();
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

    $("#contract-tag-value-datetime").kendoDateTimePicker({
        value: new Date(),
        dateInput: true
    });

    $("#contract-tag-value-int").kendoNumericTextBox({
        decimals: 0,
        format: "n0",
        value: 0
    });

    $("#contract-tag-value-decimal").kendoNumericTextBox({
        value: 0.0
    });

    $("#contract-tag-color").kendoColorPicker({
        buttons: false
    });
}

ContractEditorNS.addTag = function (model) {
    $('#contract-tag-create-popup').modal('hide');
    $.ajax({
        url: 'api/contract/createTag',
        type: 'POST',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            if (data != false && data != "false") {
                var item = {};
                item.contractTagId = data.contractTagId;
                item.name = model.Name;
                item.value = model.Value;
                item.color = model.Color;
                item.type = model.Type;
                ContractEditorNS.TagsData.push(item);
                ContractEditorNS.AvailableTags = [];
                ContractEditorNS.GetContentType(ContractEditorNS.TagsData);

                var color = $('#contract-tag-color').val();
                ContractEditorNS.AddBackgroundColorForSection(color, ContractEditorNS.SelectedTag, data.contractTagId);
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

ContractEditorNS.RemoveBackgroundColorForSection = function (color, name, contractTagId) {
    for (var i = 0; i < ContractEditorNS.EditorValue.length; i++) {
        var oldSectionValue = '<span style="color:white;padding:1px 5px;background-color:' + color + ';">' + name + "</span>";

        ContractEditorNS.EditorValue[i].content = ContractEditorNS.EditorValue[i].content.replace(new RegExp(oldSectionValue, "g"), name);

        if (ContractEditorNS.EditorValue[i].content.indexOf(name) >= 0) {
            ContractEditorNS.EditorValue[i].tags = contractTagId;
            ContractEditorNS.removeContractSectionTag(ContractEditorNS.EditorValue[i], contractTagId);
        }
    }
}

ContractEditorNS.updateContractSectionTag = function (contractSection, contractTagId) {
    var model = {};
    model.ContractSectionId = contractSection.contractSectionId;
    model.Tags = contractTagId;
    model.Content = contractSection.content;

    $.ajax({
        url: 'api/contract/updateTagContractSection/',
        type: 'POST',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            ContractEditorNS.LoadEditor();
            toastr.success('Tag successfully added');

            ContractEditorNS.SelectedTag = '';
            $("#contract-tag-name span").text('');
            $("#contract-tag-type").data("kendoComboBox").value("");
            $("#contract-tag-value-text").val(null);
            $("#contract-tag-value-datetime").val(null);
            $("#contract-tag-value-int").val(0);
            $("#contract-tag-value-decimal").val(0);

            $("#form-tag-text").hide();
            $("#form-tag-datetime").hide();
            $("#form-tag-int").hide();
            $("#form-tag-decimal").hide();
        }
    });
}

ContractEditorNS.removeContractSectionTag = function (contractSection, contractTagId) {
    var model = {};
    model.ContractSectionId = contractSection.contractSectionId;
    model.Tags = contractTagId;
    model.Content = contractSection.content;

    $.ajax({
        url: 'api/contract/deleteTagContractSection/',
        type: 'POST',
        data: JSON.stringify(model),
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (data, textStatus, XMLHttpRequest) {
            ContractEditorNS.LoadEditor();
            var retTag = ContractEditorNS.TagsData.find(x => x.contractTagId === contractTagId);
            if (retTag !== undefined) {
                var indexTag = jQuery.inArray(retTag, ContractEditorNS.TagsData);
                ContractEditorNS.TagsData.splice(indexTag, 1);
                ContractEditorNS.AvailableTags = [];
                ContractEditorNS.GetContentType(ContractEditorNS.TagsData);
            }
            
            toastr.success('Tag successfully removed');
        }
    });
}

function tagExist(selectedText) {
    var tagList = ContractEditorNS.TagsData;
    if (tagList) {
        for (var i = 0; i < tagList.length; i++) {
            if (tagList[i].name == selectedText) {
                return true;
            }
        }
    }
    
    return false;
}

function getIndexByProperty(data, key, value) {
    for (var i = 0; i < data.length; i++) {
        if (data[i][key] == value) {
            return i;
        }
    }
    return -1;
}