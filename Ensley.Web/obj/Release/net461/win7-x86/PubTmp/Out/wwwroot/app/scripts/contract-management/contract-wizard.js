var ContractWizardNS = {};
ContractWizardNS.ContractId = null;
ContractWizardNS.VendorId = null;
//** Wizard navigation ******
//***************************
ContractWizardNS.initializeWizard = function (vendorId, contractId, steps) {
  ContractWizardNS.ContractId = contractId;
  ContractWizardNS.VendorId = vendorId;

  $.ajax({
    url: "contract/ContractWizard", success: function (result) {
      var wizard = $("#contract-wizard");
      wizard.empty();
      wizard.html(result).css("display", "block");
      $("#main-content").css("display", "none");

      ContractWizardNS.showPartialPage(steps);

      // Initialize Smart Wizard with ajax content load and cache disabled
      $('#wizard').smartWizard({
        onLeaveStep: leaveAStepCallback,
        onFinish: onFinishCallback
      });

      $("#wizard").smartWizard('goToStep', steps);

      if (steps != 1) {
        for (i = 1; i < steps; i++) {
          $('#wizard').smartWizard('enableStep', i);
        }
      }
    }
  });

  ContractWizardNS.initializeControl();
}

ContractWizardNS.initializeControl = function () {
  $("#divExit").css("display", "block");

  $(".buttonExit").click(function (e) {
    e.preventDefault();
    $("#contract-wizard").css("display", "none");
    $("#main-content").css("display", "block");
    $("#divExit").css("display", "none");
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
  var isValid = true;
  var message = 'Please check all required fields';
  if (stepnumber == 1 && toStep == 2) {
    if (!ContractGeneralInformationNS.Mode == 1 || $("#contact-permission-grid").data().kendoGrid.dataSource.view().length < 1) {
      isValid = false;
      message = 'Please check all required fields. Should have a permission to continue';
    }
  }
  else if (stepnumber == 2 && toStep == 3) {
    if (ContractEditorNS.SelSectionCount === 0) {
      message = 'Please select at least 1 section.';
      isValid = false;
    }
  }
  else if (stepnumber == 3 && toStep == 4) {
    var contractProductGrid = $("#contractProduct-grid").data("kendoGrid");

    if (contractProductGrid.dataSource.total() === 0) {
      message = 'Please add at least 1 product.';
      isValid = false;
    }
  }


  if (!isValid) {
    toastr.info(message);
  } else {
    ContractWizardNS.showPartialPage(toStep);
  }

  return isValid;
}

ContractWizardNS.showPartialPage = function (steps) {
  var url = "";
  var mainContent = "";
  var param = "";
  if (steps == 1) {
    url = "contract/ContractGeneralInfo";
    mainContent = "#step-1";
    param = "?vendorId=" + ContractWizardNS.VendorId + "&contractId=" + ContractWizardNS.ContractId;
  }
  else if (steps == 2) {
    url = "contract/ContractEditor";
    mainContent = "#step-2";
    param = "?contractId=" + ContractWizardNS.ContractId;
  }
  else if (steps == 3) {
    url = "contract/ContractProduct";
    mainContent = "#step-3";
    param = "?contractId=" + ContractWizardNS.ContractId;
  }
  else if (steps == 4) {
    url = "contract/ContractApproval";
    mainContent = "#step-4";
    param = "?contractId=" + ContractWizardNS.ContractId;
  }

  $.ajax({
    url: url + param, success: function (result) {
      $(mainContent).html(result);
    }
  });
}

