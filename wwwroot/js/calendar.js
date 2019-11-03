function createCalenars(formAction, reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage) {
    createCalendar("StartDate", reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage);
    createCalendar("EndDate", reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage);

    $("#StartDate").keyup(function () {
        checkDate(reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage)
    });

    $("#EndDate").keyup(function () {
        checkDate(reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage)
    });

    $("#" + formAction).click(function (event) {
        var isDateValid = checkDate(reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage);
        return isDateValid
    });


    checkDate(reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage);
    checkDate(reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage);
}

function createCalendar(id, reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage) {
    var disabledDateIndex = 0;

    //This is rendered each time pressed on calender
    $('#' + id).datepicker({
        language: 'ar',
        inline: false,
        minDate: new Date(),
        startDate: new Date(),
        am: "ص",
        pm: "م",
        prevHtml: '<svg><path d="M 14,12 l 5,5 l -5,5"></path></svg>',
        nextHtml: '<svg><path d="M 17,12 l -5,5 l 5,5"></path></svg>',
        monthsField: 'months',
        daysField: 'days',
        navTitles: {
            days: 'MM yyyy',
            months: 'yyyy',
            years: 'yyyy1 - yyyy2'
        }, 
        onRenderCell: function (date, cellType) {
            if (reservedStartDates.length > disabledDateIndex) {
                var startDate = reservedStartDates[disabledDateIndex];
                var endDate = reservedEndDates[disabledDateIndex];
                while (date > endDate && reservedStartDates.length > disabledDateIndex + 1) {
                    ++disabledDateIndex;
                    var startDate = reservedStartDates[disabledDateIndex];
                    var endDate = reservedEndDates[disabledDateIndex];
                }

                if (cellType == 'day' && date >= startDate && date <= endDate) {
                    return {
                        disabled: true,
                        classes: 'reserved-date text-white'
                    }
                }

                // Reset the disabledDateIndex because this datepicker code rendered each time you press on calender
                if (date > endDate && reservedStartDates.length == disabledDateIndex + 1) {
                    disabledDateIndex = 0;
                }
            }
        },
        onSelect: function () {
            checkDate(reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage);
        }
    })
}

function stringToDate(string) {
    var dateTimeArr = string.split(' ');
    var arr = dateTimeArr[0].split('/');
    var date = new Date(arr[2], arr[1] - 1, arr[0], 0, 0, 0, 0);
    return date;
}

function selectDate(id, selectedDate) {
    var date = stringToDate(selectedDate);
    $('#' + id).val(selectedDate);
    $('#' + id).data('datepicker').selectDate(date)
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
}

function checkDate(reservedStartDates, reservedEndDates, endLessThanStartDateErrorMessage, reservedDateErrorMessage) {
    var parts = $("#StartDate").val().split('/');
    var StartDate = new Date(parts[2], parts[1] - 1, parts[0]);
    var parts = $("#EndDate").val().split('/');
    var EndDate = new Date(parts[2], parts[1] - 1, parts[0]);

    if ($("#StartDate").val() != "" && $("#EndDate").val() != "" && StartDate > EndDate) {
        $("#dateErrorMessage").html(endLessThanStartDateErrorMessage);
        return false;
    } else {
        //if there's reserved dates then check
        if (reservedStartDates.length > 0) {
            //find reserved dates before selected start date, it must be less than start date.
            //find reserved dates after selected end date, it must be more than end date.
            //find reserved start date in between selected dates, if yes return fasle.

            for (reservedIndex in reservedStartDates) {
                //find reserved date in between selected dates, if yes return fasle.
                if (reservedStartDates[reservedIndex] >= StartDate && reservedEndDates[reservedIndex] <= EndDate) {
                    $("#dateErrorMessage").html(reservedDateErrorMessage);
                    return false;
                }
            }
        }

        $("#dateErrorMessage").html("");
        return true;
    }
}
