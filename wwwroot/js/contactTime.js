function initializeContactTime() {
    convertDateToString('ContactStartTime', 'datetimepicker1');
    convertDateToString('ContactEndTime', 'datetimepicker2');
}

function convertDateToString(fromId, toId) {
    var time = $("#" + fromId).val();
    var amPm = "AM";
    var HoursAndMinutes = time.split(':', 2);
    var HoursAndMinutesString = HoursAndMinutes[0] + ":" + HoursAndMinutes[1];

    /*
    if (HoursAndMinutes[0] == "00")
        HoursAndMinutes[0] = 24;
    if (Number(HoursAndMinutes[0]) >= 12) {
        amPm = "PM";
        HoursAndMinutes[0] = Number(HoursAndMinutes[0]) - 12;
    }

    var HoursAndMinutesString = HoursAndMinutes[0] + ":" + HoursAndMinutes[1];
    var timeString = HoursAndMinutesString + " " + amPm;
    */
    let momentTime = moment().hours(HoursAndMinutes[0]).minutes(HoursAndMinutes[1]);

    //Set format before date otherwise error will occure
    $('#' + toId).datetimepicker('format', 'LT');
    $('#' + toId).datetimepicker('defaultDate', momentTime);
}

function changeDate(id, toId) {
    var timeString = $("#" + id).val();
    time = convertStringToDate(timeString);

    $("#" + toId).val(time);
}

function convertStringToDate(timeString) {
    var time = timeString.split(' ', 2);
    var amPm = time[1];
    var HoursAndMinutes = time[0].split(':', 2);

    if (Number(HoursAndMinutes[0]) < 10)
        HoursAndMinutes[0] = "0" + HoursAndMinutes[0];
    if (amPm.toUpperCase() == "PM")
        HoursAndMinutes[0] = 12 + Number(HoursAndMinutes[0]);
    if (HoursAndMinutes[0] == 24)
        HoursAndMinutes[0] = "00";

    var convertedTime = HoursAndMinutes[0] + ":" + HoursAndMinutes[1];
    return convertedTime;
}