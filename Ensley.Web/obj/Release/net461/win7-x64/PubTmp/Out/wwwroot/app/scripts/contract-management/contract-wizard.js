var ContractWizardNS = {};
//** Wizard navigation ******
//***************************
ContractWizardNS.initializeWizard = function (vendorId, contractId) {

    $.ajax({
        url: "contract/ContractWizard", success: function (result) {
            var wizard = $("#contract-wizard");
            wizard.empty();
            wizard.html(result).css("display", "block");
            $("#main-content").css("display", "none");

            // JOI - make thhis deffered
            $.ajax({
                url: "contract/ContractGeneralInfo/?vendorId=" + vendorId + "&contractId=" + contractId, success: function (result) {
                    $("#step-1").html(result);
                }
            });   

            // Initialize Smart Wizard with ajax content load and cache disabled
            $('#wizard').smartWizard({
                onLeaveStep: leaveAStepCallback,
                onFinish: onFinishCallback
            });

        }
    });

    ContractWizardNS.initializeControl();
}

ContractWizardNS.initializeControl = function () {
    $("#divExit").css("display", "block");
    $("#divGlobalSearch").css("display", "none");
    
    $(".buttonExit").click(function () {
        $("#contract-wizard").css("display", "none");
        $("#main-content").css("display", "block");

        $("#divExit").css("display", "none");
        $("#divGlobalSearch").css("display", "");
    });
}

function setError(stepnumber) {
    $('#wizard').smartWizard('setError', { stepnum: stepnumber, iserror: true });
}

function leaveAStepCallback(obj, context) {
    return validateSteps(context.toStep, context.fromStep); // return false to stay on step and true to continue navigation
}

function onFinishCallback(objs, context) {
}

// Your Step validation logic
function validateSteps(toStep, stepnumber) {
    // contract UI
    if (toStep == 2) {
        ContractWizardNS.showPartialPage(2);
    }
    return true;
}


ContractWizardNS.showPartialPage = function (steps) {
    var url = "";
    var mainContent = "";
    var param = "";
    if (steps == 1) {
        url = "contract/ContractGeneralInfo/vendorId=";
        mainContent = "#step-1";
    }
    else if (steps == 2) {
        url = "contract/ContractEditor";
        mainContent = "#step-2";
        param = "?contractID" + ContractManagementNS.ContractID;
    }

    $.ajax({
        url: url + param, success: function (result) {
            $(mainContent).html(result);
        }
    });
}

