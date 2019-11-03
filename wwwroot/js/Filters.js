
var app = angular.module('targets', []);
app.controller('myCtrl', function ($scope, $http) {

    $scope.isFormSubmitted = false;
    $scope.isCalculatePricePressed = false;
    $scope.value = false;
    $scope.select = true;
    $scope.count = 1;
    $scope.nCount = 0;
    $scope.array = new Array();
    $scope.selectedUnitsArr = new Array();
    $scope.notDropDownValueParameters = new Array();
    $scope.numberValueParameters = new Array();
    $scope.dateValueParameters = new Array();
    $scope.totalUnits = 0;
    $scope.categoryId = "0";
    $scope.campaignId = "";
    $scope.allFiltersFilledErrorMsg = "";
    $scope.chooseAtLeastFilterErrorMsg = "";
    $scope.removeFiltersDuplicationErrorMsg = "";

    var url = window.location.href;
    var urlar = url.split('/');
    var campId = url.substring(url.lastIndexOf('/') + 1, url.length);
    var action = urlar[urlar.length - 2].toLowerCase();
    if (action.indexOf("edit") >= 0) {
        $scope.all = false;
        $scope.custom = true;
    }
    else {
        $scope.all = true;
        $scope.custom = false;
    }

    $scope.addRow = function () {
        $scope.selectedUnitsArr.push(0);
        //console.log($scope.array);
        $scope.array.push({
            "uni": new Date().getMilliseconds(),
            "paraid": "",
            "oprid": "",
            "value": ""
        });/*count=count+1+nCount; nCount=0;*/
    }

    $scope.remove = function (element) {
        //$scope.array.push($(element).parent().parent());
        $scope.array.splice(element.id, 1);
        $scope.selectedUnitsArr.splice(element.id, 1);

        $("#filtersErrorMsg").attr("hidden", true);

        if ($scope.custom && $scope.array.length == 0) {
            $("#filtersErrorMsg").attr("hidden", false);
            $("#filtersErrorMsg").html($scope.chooseAtLeastFilterErrorMsg);
        }
    }

    $scope.initialize = function (campaingId, categoryId) {
        $scope.campaignId = campaingId;
        $scope.categoryId = categoryId;
    }

    $scope.initializeMessages = function (allFiltersFilledErrorMsg, chooseAtLeastFilterErrorMsg, removeFiltersDuplicationErrorMsg) {
        $scope.allFiltersFilledErrorMsg = allFiltersFilledErrorMsg;
        $scope.chooseAtLeastFilterErrorMsg = chooseAtLeastFilterErrorMsg;
        $scope.removeFiltersDuplicationErrorMsg = removeFiltersDuplicationErrorMsg;
    }

    $scope.alterDates = function (endLessThanStartDateErrorMessage, reservedDateErrorMessage) {
        if ($scope.categoryId != null) {

            var filtersJArrayString = $scope.getFiltersAsStringJArray();

            $http.get(window.location.origin + "/Campaigns/GetReservedCampaign?campaignId=" + $scope.campaignId + "&categoryId=" + $scope.categoryId + "&filtersJArrayString=" + filtersJArrayString)
                .then(function (response) {
                    var reservedCampaigns = response.data;

                    var reservedStartDates = [];
                    var reservedEndDates = [];

                    for (var reservedCampaign in reservedCampaigns) {
                        reservedStartDates.push(convertDate(reservedCampaigns[reservedCampaign].startDate));
                        reservedEndDates.push(convertDate(reservedCampaigns[reservedCampaign].endDate));
                    }

                    createCalenars("create", reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage);
                });
        }
    }

    $scope.isFiltersDuplicated = function (withCalculatingPrice) {
        var filtersJArrayString = $scope.getFiltersAsStringJArray();

        $http.get(window.location.origin + "/Campaigns/IsFiltersDuplicatedAPI?filters=" + filtersJArrayString)
            .then(function (response) {
                var isDuplicated = response.data;
                if (isDuplicated) {
                    $("#filtersErrorMsg").attr("hidden", false);
                    $("#filtersErrorMsg").html($scope.removeFiltersDuplicationErrorMsg);
                    $scope.priceSpan = "";
                } else if (withCalculatingPrice) {
                    $scope.calculateTotalUnits();
                }
            });
    }

    $scope.getFiltersAsStringJArray = function () {
        var filtersJArrayString = "[";

        if ($scope.custom == true) {
            for (item in $scope.array) {
                //if operator and value is selected
                if ($scope.array[item].paraid != null && $scope.array[item].oprid != null && $scope.array[item].value != null)
                    filtersJArrayString += "{\"ParameterId\" : " + $scope.array[item].paraid + ", \"OperatorId\" : " + $scope.array[item].oprid + ", \"Value\" : " + $scope.array[item].value + "},";
            }
        }

        filtersJArrayString += "]";

        return filtersJArrayString;
    }

    $scope.validateFiltersOnSubmit = function ($event) {
        $scope.isFormSubmitted = true;

        if (!$scope.validateFilters(true, true)) {
            $event.preventDefault();
            return false;
        }
    }

    $scope.isAllFiltersHaveValue = function () {
        for (var filterIndex in $scope.array) {
            if ($scope.array[filterIndex].paraid == "" || $scope.array[filterIndex].paraid == null || $scope.array[filterIndex].oprid == "" || $scope.array[filterIndex].oprid == null || $scope.array[filterIndex].value == "" || $scope.array[filterIndex].value == null) {
                $("#filtersErrorMsg").attr("hidden", false);
                return false;
            }
        }

        return true;
    }

    $scope.validateFilters = function (withCheckFiltersDuplication, withCalculatingPrice) {
        //if the user choose custom then he must choose at least one filter
        if ($scope.custom && $scope.array.length == 0) {
            $("#filtersErrorMsg").attr("hidden", false);
            $("#filtersErrorMsg").html($scope.chooseAtLeastFilterErrorMsg);
            $scope.priceSpan = "";
            return false;
        }

        if (!$scope.isAllFiltersHaveValue()) {
            $("#filtersErrorMsg").html($scope.allFiltersFilledErrorMsg);
            $scope.priceSpan = "";
            return false;
        }

        if (!$scope.isAllFiltersInRange()) {
            $scope.priceSpan = "";
            return false;
        }

        if (withCheckFiltersDuplication)
            $scope.isFiltersDuplicated(withCalculatingPrice);

        return true;
    }

    $scope.changeFilter = function (filterIndex, endLessThanStartDateErrorMessage, reservedDateErrorMessage) {
        $("#filtersErrorMsg").attr("hidden", true);
        $scope.array[filterIndex].parameterErrorMsg = "";

        $scope.alterDates(endLessThanStartDateErrorMessage, reservedDateErrorMessage);
    }

    $scope.changeValue = function () {
        if ($scope.operator != 1)
            $scope.FilterValue = $scope.selectValue;
        else
            $scope.FilterValue = $scope.textValue;
    }

    $scope.calculateTotalUnits = function () {
        $scope.isCalculatePricePressed = true;

        $("#calculatePriceErrorMsg").attr("hidden", true);

        $scope.selected = angular.copy($scope.array);

        for (i in $scope.selected) {
            delete $scope.selected[i].uni;
            delete $scope.selected[i].$$hashKey;
        }
        //console.log($('#startDate').val());
        var req = {
            method: 'Get',
            url: window.location.origin + "/Campaigns/CalculatePrice?startDate=" + $('#StartDate').val() + "&endDate=" + $('#EndDate').val() + "&parameter=" + ($scope.all ? JSON.stringify(new Array()) : JSON.stringify($scope.selected)),
            headers: {
                'Content-Type': undefined
            },
            //data: { id: '1' }
        }
        $http(req)
            .then(function (response) {
                $scope.totalUnits = response.data;

                if (!isNaN($scope.totalUnits)) {
                    $scope.priceSpan = Math.round(response.data * 100) / 100;
                } else {
                    $scope.priceSpan = "";
                    $("#calculatePriceErrorMsg").attr("hidden", false);
                    $('#calculatePriceErrorMsg').html(response.data);
                }
            });
        //console.log(JSON.stringify($scope.selected));
    }

    $scope.initializeTargets = function (allFilters, campaignFilters) {
        if (campaignFilters == null) {
            $scope.all = true;
            $scope.custom = false;
        } else {
            $scope.all = false;
            $scope.custom = true;
        }

        $scope.parameters = allFilters;
        //console.log($scope.parameters);
        //check the parameters that have no values
        for (paraIndex in $scope.parameters) {
            // if parameter have no values then it's value is a number entered by user
            if ($scope.parameters[paraIndex].Values == "")
                $scope.notDropDownValueParameters.push($scope.parameters[paraIndex].Id);

            if ($scope.parameters[paraIndex].DataType == "DateTime")
                $scope.dateValueParameters.push($scope.parameters[paraIndex].Id);
        }

        // Use another loop because I check the value in notDropDownValueParameters
        for (paraIndex2 in $scope.parameters) {
            // Check if isNotDropDownValueParameters because the drop-down is foreign key so it is also "int" DataType so it's Number so we don't need it.
            // But we need just Number input type like "Age parameter".
            if ($scope.isNotDropDownValueParameters($scope.parameters[paraIndex2].Id) && $scope.parameters[paraIndex2].DataType == "int")
                $scope.numberValueParameters.push($scope.parameters[paraIndex2].Id);
        }

        //The below code is to initialize filters and units for edit campaign
        for (t in campaignFilters) {
            custom = true;
            all = false;
            value = parseInt(campaignFilters[t].value);

            // If value contain '/' then conver it to date
            if (campaignFilters[t].value.indexOf('/') > -1) {
                dateArr = campaignFilters[t].value.split('/');
                value = new Date(dateArr[0], dateArr[1] - 1, dateArr[2], 0, 0, 0, 0);
            }

            $scope.array.push({
                paraid: campaignFilters[t].parameterId + '',
                oprid: campaignFilters[t].operatorId + '',
                value: value
            });

            // if the parameter is selected and not "choose one"
            if (campaignFilters[t].parameterId != null)
                $scope.selectedUnitsArr.push($scope.parameters[campaignFilters[t].parameterId].Units);
            else
                $scope.selectedUnitsArr.push(null)
        }
    };

    $scope.isNotDropDownValueParameters = function (selectedParameterId) {
        for (paraIndex in $scope.notDropDownValueParameters) {
            if ($scope.notDropDownValueParameters[paraIndex] == selectedParameterId) {
                return true;
            }
        }
        return false;
    };

    $scope.isNumberValueParameters = function (selectedParameterId) {
        for (paraIndex in $scope.numberValueParameters) {
            if ($scope.numberValueParameters[paraIndex] == selectedParameterId) {
                return true;
            }
        }
        return false;
    };

    $scope.isDateValueParameters = function (selectedParameterId) {
        for (paraIndex in $scope.dateValueParameters) {
            if ($scope.dateValueParameters[paraIndex] == selectedParameterId) {
                return true;
            }
        }
        return false;
    };

    $scope.isAllFiltersInRange = function () {
        var returnValue = true;

        for (var filterIndex in $scope.array) {
            var paraId = $scope.array[filterIndex].paraid;
            var paraValue = $scope.array[filterIndex].value

            var paraIndex = $scope.getParameterIndexById(paraId);
            var paraDataType = $scope.parameters[paraIndex].DataType;

            // Check if the minimum value is a number or string
            if (!isNaN($scope.parameters[paraIndex].Min) || $scope.parameters[paraIndex].Min) {
                var min = $scope.parameters[paraIndex].Min;
                var max = $scope.parameters[paraIndex].Max;

                var parameterRangeErrorMsg = $scope.parameters[paraIndex].ParameterRangeErrorMsg;

                var oprId = $scope.array[filterIndex].oprid;
                var operIndex = $scope.getOperatorIndexById(paraIndex, oprId);
                var operator = $scope.parameters[paraIndex].Operators[operIndex].Name;

                if (!$scope.isInRange(paraValue, paraDataType, operator, min, max)) {
                    $scope.array[filterIndex].parameterErrorMsg = parameterRangeErrorMsg;
                    returnValue = false;
                }
            }
        }

        return returnValue;
    }

    $scope.isInRange = function (value, dataType, operator, min, max) {
        try {
            console.log(operator);

            if (dataType == "DateTime") {
                var date = value;
                var minDate = $scope.stringToDate(min, "/");
                var maxDate = $scope.stringToDate(max, "/");

                //The Operators should be flipped because we read from write to left.
                var dateMinComp = compareDates(date, minDate);
                if ((dateMinComp == -1 || dateMinComp == 0) && operator == "<") //Less Than
                    return false;
                var dateMaxComp = compareDates(date, maxDate);
                if ((dateMaxComp == 1 || dateMaxComp == 0) && operator == ">") //Greater Than
                    return false;
                if ((dateMinComp == -1 || dateMaxComp == 1) && operator == "=")
                    return false;

                return true;
            }
            else if (dataType == "int") {
                var num = parseInt(value);
                var minNum = parseInt(min);
                var maxNum = parseInt(max);

                //The Operators should be flipped because we read from write to left.
                if (num <= minNum && operator == "<") //Less Than
                    return false;
                if (num >= maxNum && operator == ">") //Greater Than
                    return false;
                if ((num < minNum || num > maxNum) && operator == "=")
                    return false;

                return true;
            }
        }
        catch
        {
            return false;
        }

        return false;
    }

    $scope.getParameterIndexById = function (id) {
        for (var paraIndex in $scope.parameters) {
            if ($scope.parameters[paraIndex].Id == id)
                return paraIndex;
        }

        return -1;
    }

    $scope.getOperatorIndexById = function (paraIndex, operId) {
        for (var operIndex in $scope.parameters[paraIndex].Operators) {
            if ($scope.parameters[paraIndex].Operators[operIndex].Id == operId)
                return operIndex;
        }

        return -1;
    }

    $scope.stringToDate = function (value, splitterStr) {
        try {
            var dateArr = value.split(splitterStr);

            var year = parseInt(dateArr[0]);
            var month = parseInt(dateArr[1] - 1);
            var day = parseInt(dateArr[2]);

            var date = new Date(year, month, day);

            return date;
        }
        catch
        {
            return null;
        }
    }
});

app.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);

        for (var i = 0; i < total; i++) {
            input.push(i);
        }

        return input;
    };
});

function convertDate(string) {
    var dateTimeArr = string.split('T', 1);
    var arr = dateTimeArr[0].split('-', 3);

    var date = new Date(arr[0], arr[1] - 1, arr[2], 0, 0, 0, 0);
    return date;
}

// This compare dates with just date (without timezone and time)
function compareDates(date1, date2) {
    var yearComp = compareNumbers(date1.getFullYear(), date2.getFullYear());
    if (yearComp != 0)
        return yearComp;

    var monthComp = compareNumbers(date1.getMonth(), date2.getMonth());
    if (monthComp != 0)
        return monthComp;

    var dayComp = compareNumbers(date1.getDate(), date2.getDate());
    if (dayComp != 0)
        return dayComp;


    // the two dates are equal
    return 0
}

function compareNumbers(num1, num2) {
    if (num1 > num2)
        return 1;
    if (num1 == num2)
        return 0;
    if (num1 < num2)
        return -1;
}