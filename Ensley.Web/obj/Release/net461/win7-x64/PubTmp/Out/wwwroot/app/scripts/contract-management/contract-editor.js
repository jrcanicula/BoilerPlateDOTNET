var ContractEditorNS = {};
ContractEditorNS.EditorValue = '';
ContractEditorNS.TagsData = '';
ContractEditorNS.Name = '';
ContractEditorNS.TemplateContractValue = '';

ContractEditorNS.init = function () {
    ContractEditorNS.initializeKendoEditorAndDnD();
}

ContractEditorNS.initializeKendoEditorAndDnD = function () {
    var templateName = 'sampleContract';
    $("#editor").kendoEditor({
        resizable: {
            content: true,
            toolbar: true
        },
        tools: ["pdf", "bold", "italic", "underline", "strikethrough", "justifyLeft", "justifyCenter", "justifyRight", "justifyFull", "insertUnorderedList", "insertOrderedList", "indent", "outdent", "createLink", "unlink", "insertImage", "insertFile", "subscript", "superscript", "tableWizard", "createTable", "addRowAbove", "addRowBelow", "addColumnLeft", "addColumnRight", "deleteRow", "deleteColumn", "viewHtml", "formatting", "cleanFormatting", "fontName", "fontSize", "foreColor", "backColor",],
        pdf: {
            fileName: templateName + ".pdf",
            paperSize: "a4",
            margin: {
                bottom: 20,
                left: 20,
                right: 20,
                top: 20
            }
        }
    });

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

    ContractEditorNS.GetTemplateContract();

    $("#drpContractTemplate").kendoDropDownList({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: ContractEditorNS.TemplateContractValue,
        index: 0,
        change: ContractEditorNS.onChangeTemplate
    });

    var value = $("#drpContractTemplate").val();
    ContractEditorNS.loadContentTemplateData(value);

    $("#btnCompareTemplate").click(function () {
        window.open('contract/contractversion', '_blank');
    }); 
}

ContractEditorNS.GetTemplateContract = function () {
    ContractEditorNS.TemplateContractValue = [
        { text: "Enterprise Agreement", value: "1" },
        { text: "End User License Agreement",value:"2"}
    ];
}

ContractEditorNS.onChangeTemplate = function () {
    var value = $("#drpContractTemplate").val();
    ContractEditorNS.loadContentTemplateData(value);
}

ContractEditorNS.placeholder = function (element) {
    return $("<li class='list-item' id='placeholder'>Drop Here!</li>");
}

ContractEditorNS.loadContentTemplateData = function (templateId) {
    ContractEditorNS.loadTagsContent();
    //// get section lists
    //$.ajax({
    //    url: "api/Contract/" + "templateId",
    //    type: 'POST',
    //    contentType: 'application/json; charset=utf-8',
    //    success: function (data, textStatus, XMLHttpRequest) {
    //        if (data != false && data != "false") {
    //            ContractEditorNS.EditorValue = data;
    //        }
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        toastr.error('Something went wrong with the request!');
    //    }
    //});
    if (templateId == 1) {
        ContractEditorNS.EditorValue = [
            { id: 0, name: 'Definition', value: '<h1 id="h0">Definitions</h1><p>Terms used in this agreement but not otherwise defined will have the definition provided in the Master Agreement. The following definitions also apply: </p><p>“Customer“ means the entity that has entered into this agreement with Microsoft and its Affiliates. </p><p>“Expiration Date“ means the date upon which the Enrollment expires. </p><p>“Enrolled Affiliate“ means an entity, either Customer or any one of Customer’s Affiliates, that has entered into an Enrollment under this agreement. </p><p>“Enrollment“ means the document that an Enrolled Affiliate submits under this agreement to place orders for Products and Services. </p><p>“Enterprise“ means Enrolled Affiliate and the Affiliates it chooses to include on its Enrollment. </p><p>“License“ means the right to download, install, access and use a Product. For certain Products, a License may be available on a fixed term or subscription basis (“Subscription License“). Licenses for Online Services will be considered Subscription Licenses. </p>', selected: true },
            { id: 1, name: 'Terms', value: '<h1 id="h1">Terms and Conditions</h1><p>License Grant. Microsoft grants the Enterprise a non-exclusive, worldwide and limited right to download, install and use software Products, and to access and use the Online Services, each in the quantity ordered under an Enrollment. The rights granted are subject to the terms of this agreement, the Product Use Rights and the Product List. Microsoft reserves all rights not expressly granted in this agreement.</p>', selected: true },
            { id: 2, name: 'The Law', value: '<h1>The Law</h1><p>Enterprise Agreements are governed by the Fair Work Act 2009. This Act sets out when and how Enterprise Agreements can be made, as well as the approval process that must be followed by the Fair Work Commission.</p>', selected: true },
            { id: 3, name: 'Permitted', value: '<h1>Permitted Matters and Compulsory Inclusions</h1><p>Enterprise Agreements may only contain terms and conditions relating to ‘permitted matters’. These are generally things that are directly relevant to the employer/employee relationship such as: <br/>Rates of pay<br/>Hours of Work<br/>Leave entitlements<br/>Allowances<br/>Overtime and penalty rates, and<br/>Codes of Conduct<br/>Enterprise Agreements that contain terms and conditions that are not directly relevant to the employer/employee relationship - or which contain prohibited matters - will not be approved by the Commission and will have no legal effect.</p>', selected: false },
            { id: 4, name: 'Bargaining', value: '<h1>Bargaining Representatives and ‘Good Faith’ Requirements</h1><p>If an employee belongs to a union and they choose not to appoint a different Bargaining Representative, the union will become their ‘default’ Bargaining Representative. The employee may still choose, at any time, to appoint a different Bargaining Representative if they wish.</p>', selected: false }
        ];
    } else {
        ContractEditorNS.EditorValue = [
            { id: 0, name: 'Description', value: '<h1>1. DESCRIPTION OF APPLICATION</h1><p>(a) Mobile Check Deposit is a personal financial information management service that allows you to transmit and deposit checks and other financial instruments through use of the application provided by us through our online banking services using compatible and supported mobile phones and/or other compatible and supported wireless devices or network devices under your control (the “Service”).</p><p>(b) We reserve the right to modify the scope of the Services at any time. We reserve the right to refuse to make any transaction you request through the Service. You agree and understand that the Services may not be accessible or may have limited utility over some networks, such as while roaming.</p>', selected: true },
            { id: 1, name: 'License', value: '<h1>2. LICENSE AND RESTRICTIONS</h1><p>(a) Subject to the terms of this Agreement, we hereby grant you a limited, personal, revocable, nonexclusive, nonsublicensable, nonassignable, nontransferable, nonresellable license and right to use the Application for the sole purpose of your use of the Service.</p><p> (b) You acknowledge and agree that any and all intellectual property rights (the “IP Rights”) in the Service and the Application are and shall remain the exclusive property of us. Nothing in this Agreement intends to or shall transfer any IP Rights to, or to vest any IP Rights in, you. You are only entitled to the limited use of the rights granted to you in this Agreement. You will not take any action to jeopardize, limit or interfere with the IP Rights. You acknowledge and agree that any unauthorized use of the IP Rights is a violation of this Agreement, as well as a violation of applicable intellectual property laws. You acknowledge and understand that all title and rights in and to any third party content that is not contained in the Service and Application, but may be accessed through the Service, is the property of the respective content owners and may be protected by applicable patent, copyright, or other intellectual property laws and treaties.</p>', selected: true },
            { id: 2, name: 'Terms', value: '<h1>3. TERMS</h1><p>(a) Fees. For every check deposited through this service there will be a $1.00 mobile deposit fee. You are responsible for paying the fees for the use of the Service. Woodland Bank may change the fees for use of the Service at any time pursuant to the section titled "Acceptance of these Terms" above. You authorize Woodland Bank to deduct such fees from the same bank account as your mobile deposit. </p><p>(b) Eligible items. You agree to scan and deposit only "checks" as that term is defined in Federal Reserve Regulation CC ("Reg. CC"). When the image of the check transmitted to Woodland Bank is converted to an image for subsequent presentment and collection, it shall thereafter be deemed an "item" within the meaning of Articles 3 and 4 of the Uniform Commercial Code.</p>', selected: true },
            { id: 3, name: 'Compliance', value: '<h1>4. COMPLIANCE AND INDEMNIFICATION</h1><p>(a) You agree to use the products and Service for lawful purposes and in compliance with all applicable laws, rules and regulations. You warrant that you will only  11/02/2015 transmit acceptable items for deposit and will handle the original items in accordance with applicable laws, rules and regulations. </p><p>(b) Any image of a check that you transmit using the Application must accurately and legibly provide all the information on the front and back of the check necessary to process the check, including any required endorsements. </p><p>(c) You are responsible for any loss or overdraft plus any applicable fees to your Account due to an item being returned.</p>', selected: false },
            { id: 4, name: 'Termination', value: '<h1>5. TERMINATION</h1><p>(a) We may terminate this Agreement at any time, for any reason, and without notice. This Agreement shall remain in full force and effect unless and until it is terminated by us. Without limiting the foregoing, this Agreement may be terminated if you breach any term of this Agreement, if you use the Services for any unauthorized or illegal purposes or you use the Services in a manner inconsistent with the terms of your account agreement or any other agreement with us. </p><p>(b) Upon termination of this Agreement you: (a) acknowledge and agree that all licenses and rights to use the Service and Application shall terminate; (b) will cease any and all use of the Application; and </p><p>(c) will remove the Application from all computing devices, hard drives, networks, and other storage media in your possession or under your control.</p>', selected: false },
            { id: 5, name: 'Legal', value: '<h1>6. LEGAL COMPLIANCE AND EXPORT RESTRICTIONS</h1><p>(a) You represent and warrant that: (1) you are not located in a country that is subject to a U.S. Government embargo, or that has been designated by the U.S. Government as a “terrorist supporting” country; and (2) you are not listed on any U.S. Government list of prohibited or restricted parties. You also acknowledge that the Service and Application may be subject to other U.S. and foreign laws and regulations governing the export of software by physical or electronic means. You  11/02/2015 agree to comply with all applicable US and foreign laws that apply to us as well as end-user, end-use, and destination restrictions imposed by U.S. and foreign governments.</p>', selected: false },
            { id: 6, name: 'Warranty', value: '<h1>7. WARRANTY DISCLAIMER</h1><p>(a) WE CANNOT FORESEE OR ANTICIPATE ALL TECHNICAL OR OTHER DIFFICULTIES RELATED TO THE APPLICATION OR SERVICES. THESE DIFFICULTIES MAY RESULT IN LOSS OF DATA, PERSONALIZATION SETTINGS OR OTHER APPLICATION INTERRUPTIONS. WE ASSUME NO RESPONSIBILITY FOR ANY DISCLOSURE OF ACCOUNT INFORMATION TO NON-PARTIES, THE TIMELINESS, DELETION, MISDELIVERY OR FAILURE TO STORE ANY USER DATA, COMMUNICATIONS OR PERSONALIZATION SETTINGS IN CONNECTION WITH YOUR USE OF THE APPLICATION. </p><p>(b) WE ASSUME NO RESPONSIBILITY FOR THE OPERATION, SECURITY, FUNCTIONALITY OR AVAILABILITY OF ANY COMPUTING DEVICE OR NETWORK WHICH YOU UTILIZE TO ACCESS THE APPLICATION OR USE SERVICE.</p>', selected:false}
        ];
    }
    
    
    var sectionLeft = $("#sortableListLeft").empty();
    var sectionRight = $("#sortableListRight").empty();
    var valueLeft = "";
    var valueRight = "";
    for (i = 0; i < ContractEditorNS.EditorValue.length; i++) {
        if (ContractEditorNS.EditorValue[i].selected) {
            valueRight += "<li class='list-item' ondblclick='ContractEditorNS.loadContent(this)' id=" + ContractEditorNS.EditorValue[i].id + ">" + ContractEditorNS.EditorValue[i].name + "</li>";
        } else {
            valueLeft += "<li class='list-item' ondblclick='ContractEditorNS.loadContent(this)' id=" + ContractEditorNS.EditorValue[i].id + ">" + ContractEditorNS.EditorValue[i].name + "</li>";
        }
    }
    sectionLeft.append(valueLeft);
    sectionRight.append(valueRight);

    ContractEditorNS.UpdateSectionValueBaseOnTags();
    ContractEditorNS.LoadEditor();
}

ContractEditorNS.loadTagsContent = function () {
    //// get tag lists
    //$.ajax({
    //    url: "api/Contract/GetTagLists" + "contractid",
    //    type: 'POST',
    //    contentType: 'application/json; charset=utf-8',
    //    success: function (data, textStatus, XMLHttpRequest) {
    //        if (data != false && data != "false") {
    //            ContractEditorNS.EditorValue = data;
    //        }
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        toastr.error('Something went wrong with the request!');
    //    }
    //});
    ContractEditorNS.TagsData = [
        { "id": 0, "text": "Customer", "value": "Microsoft", "type": "text", "color":"#FF0000", },
        { "id": 1, "text": "ExpiredDate", "value": "4/26/2018", "type": "date", "color": "#FFFF00" },
        { "id": 2, "text": "Affiliate", "value": "affiliates", "type": "text", "color": "#7FB3D5" },
        { "id": 3, "text": "Enrollment", "value": "Enrolled", "type": "text", "color": "#45B39D" },
        { "id": 4, "text": "Telno", "value": "0987654321", "type": "number", "color": "#58D68D" }
    ];

    ContractEditorNS.GetContentType(ContractEditorNS.TagsData);  
    return ContractEditorNS.TagsData;
}

ContractEditorNS.GetContentType = function (data) {
    var htmlValue = '<table class="table table-bordered table-hover"><thead><tr><th>Tag Name</th><th>Values</th></tr></thead>';
    for (i = 0; i < data.length; i++) {
        var type = data[i].type;
        var name = data[i].text;
        var bindText = 'ContractEditorNS.' + name;
        if (type == "text") {
            htmlValue += "<tr><td draggable='true' ondragstart='ContractEditorNS.dragTags(event)' id=" + data[i].id + "><span class='color-box' style=background-color:" + data[i].color + "></span>" + name + "</td><td><input id=" + "txt" + data[i].id + " class='k-textbox' type='text' name=" + "tag_" + data[i].id + " value=" + data[i].value + " data-bind=value:" + bindText +",keyup: ContractEditorNS.handler></td></tr>";
        } else if (type == "date") {
            htmlValue += "<tr><td draggable='true' ondragstart='ContractEditorNS.dragTags(event)' id=" + data[i].id + "><span class='color-box' style=background-color:" + data[i].color + "></span>" + name + "</td><td><input id=" + "dt" + data[i].id + " name=" + "tag_" + data[i].id + " value=" + data[i].value + " data-bind=html:" + bindText + ",valueUpdate:'afterkeydown'></td></tr>";
        } else {
            htmlValue += "<tr><td draggable='true' ondragstart='ContractEditorNS.dragTags(event)' id=" + data[i].id + "><span class='color-box' style=background-color:" + data[i].color + "></span>" + name + "</td><td><input id=" + "num" + data[i].id + " class='k-textbox' type='text' name=" + "tag_" + data[i].id + " value=" + data[i].value + " data-bind=html:" + bindText + ",valueUpdate:'afterkeydown'></td></tr>";
        }
        
    }
    htmlValue += "</table>";

    $('#grdTags').append(htmlValue);
    for (j = 0; j < data.length; j++) {
        var typeVal = data[j].type;
        var id = "#dt" + data[j].id;
        if (typeVal == "date") {
            $(id).kendoDateTimePicker({
                value: new Date(),
                dateInput: true
            });
        } else if (typeVal == "number") {
            $(id).kendoNumericTextBox();
        }
    } 
}

ContractEditorNS.UpdateSectionValueBaseOnTags = function () {
    for (var i = 0; i < ContractEditorNS.TagsData.length; i++) {
        var color = ContractEditorNS.TagsData[i].color;
        var value = ContractEditorNS.TagsData[i].value;
        var name = ContractEditorNS.TagsData[i].text;
        ContractEditorNS.AddBackgroundColorForSection(color, value, name);
    }
}

ContractEditorNS.AddBackgroundColorForSection = function (color, value, name) {
    for (var i = 0; i < ContractEditorNS.EditorValue.length; i++) {
        var bindText = 'ContractEditorNS.' + name+"'";
        var newSectionValue = "<span data-bind='text:" + bindText+" style='color:white;padding:1px 5px;background-color:" + color + ";'>" + value + "</span>";
        
        ContractEditorNS.EditorValue[i].value = ContractEditorNS.EditorValue[i].value.replace(value, newSectionValue);
    }
}

ContractEditorNS.LoadEditor = function () {
    var editor = $("#editor").data("kendoEditor");
    var value = '';
    $('#sortableListRight li').each(function (i) {
        if ($(this).attr('id') != 'placeholder') {
            if (i < $('#sortableListRight li').length) {
                value += ContractEditorNS.EditorValue[$(this).attr('id')].value;
            }
        }
        editor.value(value);
    });
}

ContractEditorNS.dragTags = function (ev) {
    var editorWrapper = $("#editorWrapper");
    var type = ContractEditorNS.TagsData[ev.target.id].type;
    var id = "";
    if (type == "text") {
        id = "#txt" + ev.target.id;
    } else if (type == "date") {
        id = "#dt" + ev.target.id;
    } else {
        id = "#num" + ev.target.id;
    }
    var bindText = 'ContractEditorNS.' + ContractEditorNS.TagsData[ev.target.id].text + "'";
    var value = "&nbsp;<span data-bind='text:" + bindText +" style='color:white;padding:1px 5px;background-color:" + ContractEditorNS.TagsData[ev.target.id].color + "';> " + $(id).val() + "</span>&nbsp;";
    ev.dataTransfer.setData("text/html", value);
}

ContractEditorNS.onEnd = function (e) {
    var editor = $("#editor").data("kendoEditor");
    var value = '';
    var id = e.item[0].id
    var action = e.action;
    $('#sortableListRight li').each(function (i) {
        if ($(this).attr('id') == 'placeholder') {
            value += ContractEditorNS.EditorValue[id].value;
        } else {
            if (id != $(this).attr('id')) {
                value += ContractEditorNS.EditorValue[$(this).attr('id')].value;
            }
        }
        editor.value(value);
    });
}

ContractEditorNS.onEndRemove = function (e) {
    var editor = $("#editor").data("kendoEditor");
    var value = '';
    var action = e.action;
    $('#sortableListRight li').each(function (i) {
        if ($('#sortableListRight li').length == 0) {
            value = '';
            editor.value('');
        }
        if (action != "receive") {
            if ($(this).attr('id') != 'placeholder') {
                if (i < (parseInt($('#sortableListRight li').length))) {
                    value += ContractEditorNS.EditorValue[parseInt($(this).attr('id'))].value;
                }
            }
            editor.value(value);
        }
    });
}

ContractEditorNS.loadContent = function (e) {
    var id = e.id;
    var name = e.textContent;
    var iframe = $('#editorWrapper iframe').contents();
    $('#sortableListRight li').each(function (i) {
        if (i == 0 && name == $(this)[0].textContent) {
            iframe.scrollTop(0);
            return false;
        } else {
            if (name == $(this)[0].textContent) {
                iframe.scrollTop(($(this).innerHeight() + $(this).innerWidth()) * id);
                return false;
            }
        }
    });
}