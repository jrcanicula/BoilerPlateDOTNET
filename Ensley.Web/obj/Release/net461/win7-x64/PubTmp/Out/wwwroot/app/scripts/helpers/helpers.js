function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

var countryList = [
  { text: "Afghanistan", value: "Afghanistan" }, { text: "Albania", value: "Albania" }, { text: "Algeria", value: "Algeria" },
  { text: "Andorra", value: "Andorra" }, { text: "Angola", value: "Angola" }, { text: "Anguilla", value: "Anguilla" },
  { text: "Antigua & Barbuda", value: "Antigua & Barbuda" }, { text: "Argentina", value: "Argentina" }, { text: "Armenia", value: "Armenia" },
  { text: "Australia", value: "Australia" }, { text: "Austria", value: "Austria" }, { text: "Azerbaijan", value: "Azerbaijan" },
  { text: "Bahamas", value: "Bahamas" }, { text: "Bahrain", value: "Bahrain" }, { text: "Bangladesh", value: "Bangladesh" },
  { text: "Barbados", value: "Barbados" }, { text: "Belarus", value: "Belarus" }, { text: "Belgium", value: "Belgium" },
  { text: "Belize", value: "Belize" }, { text: "Benin", value: "Benin" }, { text: "Bermuda", value: "Bermuda" },
  { text: "Bhutan", value: "Bhutan" }, { text: "Bolivia", value: "Bolivia" }, { text: "Bosnia & Herzegovina", value: "Bosnia & Herzegovina" },
  { text: "Botswana", value: "Botswana" }, { text: "Brazil", value: "Brazil" }, { text: "Brunei Darussalam", value: "Brunei Darussalam" },
  { text: "Bulgaria", value: "Bulgaria" }, { text: "Burkina Faso", value: "Burkina Faso" }, { text: "Myanmar/Burma", value: "Myanmar/Burma" },
  { text: "Burundi", value: "Burundi" }, { text: "Cambodia", value: "Cambodia" }, { text: "Cameroon", value: "Cameroon" },
  { text: "Canada", value: "Canada" }, { text: "Cape Verde", value: "Cape Verde" }, { text: "Cayman Islands", value: "Cayman Islands" },
  { text: "Central African Republic", value: "Central African Republic" }, { text: "Chad", value: "Chad" }, { text: "Chile", value: "Chile" },
  { text: "China", value: "China" }, { text: "Colombia", value: "Colombia" }, { text: "Comoros", value: "Comoros" },
  { text: "Congo", value: "Congo" }, { text: "Costa Rica", value: "Costa Rica" }, { text: "Croatia", value: "Croatia" },
  { text: "Cuba", value: "Cuba" }, { text: "Cyprus", value: "Cyprus" }, { text: "Czech Republic", value: "Czech Republic" },
  { text: "Democratic Republic of the Congo", value: "Democratic Republic of the Congo" }, { text: "Denmark", value: "Denmark" }, { text: "Djibouti", value: "Djibouti" },
  { text: "Dominica", value: "Dominica" }, { text: "Dominican Republic", value: "Dominican Republic" }, { text: "Ecuador", value: "Ecuador" },
  { text: "Egypt", value: "Egypt" }, { text: "El Salvador", value: "El Salvador" }, { text: "Equatorial Guinea", value: "Equatorial Guinea" },
  { text: "Eritrea", value: "Eritrea" }, { text: "Estonia", value: "Estonia" }, { text: "Ethiopia", value: "Ethiopia" },
  { text: "Fiji", value: "Fiji" }, { text: "Finland", value: "Finland" }, { text: "France", value: "France" },
  { text: "French Guiana", value: "French Guiana" }, { text: "Gabon", value: "Gabon" }, { text: "Gambia", value: "Gambia" },
  { text: "Georgia", value: "Georgia" }, { text: "Germany", value: "Germany" }, { text: "Ghana", value: "Ghana" },
  { text: "Great Britain", value: "Great Britain" }, { text: "Greece", value: "Greece" }, { text: "Grenada", value: "Grenada" },
  { text: "Guadeloupe", value: "Guadeloupe" }, { text: "Guatemala", value: "Guatemala" }, { text: "Guinea", value: "Guinea" },
  { text: "Guinea-Bissau", value: "Guinea-Bissau" }, { text: "Guyana", value: "Guyana" }, { text: "Haiti", value: "Haiti" },
  { text: "Honduras", value: "Honduras" }, { text: "Hungary", value: "Hungary" }, { text: "Iceland", value: "Iceland" },
  { text: "India", value: "India" }, { text: "Indonesia", value: "Indonesia" }, { text: "Iran", value: "Iran" },
  { text: "Iraq", value: "Iraq" }, { text: "Israel and the Occupied Territories", value: "Israel and the Occupied Territories" }, { text: "Italy", value: "Italy" },
  { text: "Ivory Coast (Cote d'Ivoire)", value: "Ivory Coast (Cote d'Ivoire)" }, { text: "Jamaica", value: "Jamaica" }, { text: "Japan", value: "Japan" },
  { text: "Jordan", value: "Jordan" }, { text: "Kazakhstan", value: "Kazakhstan" }, { text: "Kenya", value: "Kenya" },
  { text: "Kosovo", value: "Kosovo" }, { text: "Kuwait", value: "Kuwait" }, { text: "Kyrgyz Republic (Kyrgyzstan)", value: "Kyrgyz Republic (Kyrgyzstan)" },
  { text: "Laos", value: "Laos" }, { text: "Latvia", value: "Latvia" }, { text: "Lebanon", value: "Lebanon" },
  { text: "Lesotho", value: "Lesotho" }, { text: "Liberia", value: "Liberia" }, { text: "Libya", value: "Libya" },
  { text: "Liechtenstein", value: "Liechtenstein" }, { text: "Lithuania", value: "Lithuania" }, { text: "Luxembourg", value: "Luxembourg" },
  { text: "Republic of Macedonia", value: "Republic of Macedonia" }, { text: "Madagascar", value: "Madagascar" }, { text: "Malawi", value: "Malawi" },
  { text: "Malaysia", value: "Malaysia" }, { text: "Maldives", value: "Maldives" }, { text: "Mali", value: "Mali" },
  { text: "Malta", value: "Malta" }, { text: "Martinique", value: "Martinique" }, { text: "Mauritania", value: "Mauritania" },
  { text: "Mauritius", value: "Mauritius" }, { text: "Mayotte", value: "Mayotte" }, { text: "Mexico", value: "Mexico" },
  { text: "Moldova, Republic of Monaco", value: "Moldova, Republic of Monaco" }, { text: "Mongolia", value: "Mongolia" }, { text: "Montenegro", value: "Montenegro" },
  { text: "Montserrat", value: "Montserrat" }, { text: "Morocco", value: "Morocco" }, { text: "Mozambique", value: "Mozambique" },
  { text: "Namibia", value: "Namibia" }, { text: "Nepal", value: "Nepal" }, { text: "Netherlands", value: "Netherlands" },
  { text: "New Zealand", value: "New Zealand" }, { text: "Nicaragua", value: "Nicaragua" }, { text: "Niger", value: "Niger" },
  { text: "Nigeria", value: "Nigeria" }, { text: "Korea, Democratic Republic of (North Korea)", value: "Korea, Democratic Republic of (North Korea)" }, { text: "Norway", value: "Norway" },
  { text: "Oman", value: "Oman" }, { text: "Pacific Islands", value: "Pacific Islands" }, { text: "Pakistan", value: "Pakistan" },
  { text: "Panama", value: "Panama" }, { text: "Papua New Guinea", value: "Papua New Guinea" }, { text: "Paraguay", value: "Paraguay" },
  { text: "Peru", value: "Peru" },
  { text: "Portugal", value: "Portugal" }, { text: "Philippines", value: "Philippines" }, { text: "Poland", value: "Poland" },
  { text: "Puerto Rico", value: "Puerto Rico" }, { text: "Qatar", value: "Qatar" }, { text: "Reunion", value: "Reunion" },
  { text: "Romania", value: "Romania" }, { text: "Russian Federation", value: "Russian Federation" }, { text: "Rwanda", value: "Rwanda" },
  { text: "Saint Kitts and Nevis", value: "Saint Kitts and Nevis" }, { text: "Saint Lucia", value: "Saint Lucia" }, { text: "Saint Vincent's & Grenadines", value: "Saint Vincent's & Grenadines" },
  { text: "Samoa", value: "Samoa" }, { text: "Sao Tome and Principe", value: "Sao Tome and Principe" }, { text: "Saudi Arabia", value: "Saudi Arabia" },
  { text: "Senegal", value: "Senegal" }, { text: "Serbia", value: "Serbia" }, { text: "Seychelles", value: "Seychelles" },
  { text: "Sierra Leone", value: "Sierra Leone" }, { text: "Singapore", value: "Singapore" }, { text: "Slovak Republic (Slovakia)", value: "Slovak Republic (Slovakia)" },
  { text: "Slovenia", value: "Slovenia" }, { text: "Solomon Islands", value: "Solomon Islands" }, { text: "Somalia", value: "Somalia" },
  { text: "South Africa", value: "South Africa" }, { text: "Korea, Republic of (South Korea)", value: "Korea, Republic of (South Korea)" }, { text: "South Sudan", value: "South Sudan" },
  { text: "Spain", value: "Spain" }, { text: "Sri Lanka", value: "Sri Lanka" }, { text: "Sudan", value: "Sudan" },
  { text: "Suriname", value: "Suriname" }, { text: "Swaziland", value: "Swaziland" }, { text: "Sweden", value: "Sweden" },
  { text: "Switzerland", value: "Switzerland" }, { text: "Syria", value: "Syria" }, { text: "Tajikistan", value: "Tajikistan" },
  { text: "Tanzania", value: "Tanzania" }, { text: "Thailand", value: "Thailand" }, { text: "Timor Leste", value: "Timor Leste" },
  { text: "Togo", value: "Togo" }, { text: "Trinidad & Tobago", value: "Trinidad & Tobago" }, { text: "Tunisia", value: "Tunisia" },
  { text: "Turkey", value: "Turkey" }, { text: "Turkmenistan", value: "Turkmenistan" }, { text: "Turks & Caicos Islands", value: "Turks & Caicos Islands" },
  { text: "Uganda", value: "Uganda" }, { text: "Ukraine", value: "Ukraine" }, { text: "United Arab Emirates", value: "United Arab Emirates" },
  { text: "United States of America (USA)", value: "United States of America (USA)" }, { text: "Uruguay", value: "Uruguay" }, { text: "Uzbekistan", value: "Uzbekistan" },
  { text: "Venezuela", value: "Venezuela" }, { text: "Vietnam", value: "Vietnam" }, { text: "Virgin Islands (UK)", value: "Virgin Islands (UK)" },
  { text: "Virgin Islands (US)", value: "Virgin Islands (US)" }, { text: "Yemen", value: "Yemen" }, { text: "Zambia", value: "Zambia" },
  { text: "Zimbabwe", value: "Zimbabwe" }
];


function customCanReadEditor(container, options) {
  var guid = kendo.guid();
  $('<input class="k-checkbox" id="' + guid + '" type="checkbox" name="canRead" data-type="boolean" data-bind="checked:canRead">').appendTo(container);
  $('<label class="k-checkbox-label" for="' + guid + '">&#8203;</label>').appendTo(container);
}

function customCanWriteEditor(container, options) {
  var guid = kendo.guid();
  $('<input class="k-checkbox" id="' + guid + '" type="checkbox" name="canWrite" data-type="boolean" data-bind="checked:canWrite">').appendTo(container);
  $('<label class="k-checkbox-label" for="' + guid + '">&#8203;</label>').appendTo(container);
}

function customBoolEditor(container, options) {
  var guid = kendo.guid();
  $('<input class="k-checkbox" id="' + guid + '" type="checkbox" name="Discontinued" data-type="boolean" data-bind="checked:Discontinued">').appendTo(container);
  $('<label class="k-checkbox-label" for="' + guid + '">&#8203;</label>').appendTo(container);
}