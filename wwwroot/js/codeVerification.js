var verifyPhoneIsClicked = false;
var isPhoneVerified = false;
var verifiedPhoneNumber = "";
var successedVerificationCode = null;

function VerifyPhone(number) {
    isPhoneVerified = true;
    verifiedPhoneNumber = number;
}

$("#profile-form").submit(function () {
    if (!isPhoneVerified) {
        $("#verificationCode_1").css({ "background-color": "#ffb3b3" });
        $("#verificationCode_2").css({ "background-color": "#ffb3b3" });
        $("#verificationCode_3").css({ "background-color": "#ffb3b3" });
        $("#verificationCode_4").css({ "background-color": "#ffb3b3" });
        $('#vcode').siblings('.success-msg').attr("hidden", true);
        $('#vcode').siblings('.error-msg').attr("hidden", false);

        $("#verificationCode_1").focus()
        return false;
    }
});

// check in edit page, if numebr is verified and the user change the number, then verify the new number
function phoneNumberKeyup() {
    var phoneNumber = $("#phoneNumber").val().toString();

    if (verifyPhoneIsClicked && phoneNumber.length == 9 && phoneNumber.substring(0, 2) == "59") {
        $('#PhoneNumberErrorMessage').attr("hidden", true);
    } else if (verifyPhoneIsClicked) {
        $('#PhoneNumberErrorMessage').attr("hidden", false);
    }

    if (verifiedPhoneNumber != "") {
        if (phoneNumber == verifiedPhoneNumber) {
            isPhoneVerified = true;
        } else {
            isPhoneVerified = false;
        }
    }
}

function verificationCodeKeyup() {
    var verificationCodeLength = $("#verificationCode_1").val().length + $("#verificationCode_2").val().length + $("#verificationCode_3").val().length + $("#verificationCode_4").val().length;
    var phoneNumber = $('#phoneNumber').val();
    if (verificationCodeLength == 4 && phoneNumber.length) {
        CheckVerificationCode();
    } 
}

function SendVerificationCode(resendButtonName, timeoutFailedMessage, failedMessage) {
    $('#sendVerificationCodeErrorMessage').attr("hidden", true);

    verifyPhoneIsClicked = true;

    var phoneNumber = $("#phoneNumber").val().toString();

    if (phoneNumber.length != 9 || phoneNumber.substring(0, 2) != "59") {
        $('#PhoneNumberErrorMessage').attr("hidden", false);
        return;
    }

    $("#sendVerificationCodeSpanMessage").html(resendButtonName);
    $("#sendVerificationCode").find('.spinner').attr("hidden", false);

    $("#verifyPhoneNumber").attr("hidden", false);
    $("#verifyPhoneNumber").attr("disabled", false);

    var reapeatNum = 2;
    SendVerificationCodeAJAX(timeoutFailedMessage, failedMessage, phoneNumber, reapeatNum);
}

function SendVerificationCodeAJAX(timeoutFailedMessage, failedMessage, phoneNumber, reapeatNum) {
    --reapeatNum;

    $.ajax({
        url: '/Home/SendVerificationCode?phoneNumber=' + phoneNumber,
        success: function (data) {
            if (data != false) {
                var result;
                try {
                    var result = JSON.parse(data);

                    if (result.Result === "Success") {
                        ShowSuccessSendVerificationCodeMsg();
                    } else {
                        if (reapeatNum == 0) {
                            ShowFailedSendVerificationCodeMsg(failedMessage);
                        } else {
                            SendVerificationCodeAJAX(timeoutFailedMessage, failedMessage, phoneNumber, reapeatNum);
                        }
                    }
                } catch (e) {
                    //There maybe wrong data sent with request
                    if (reapeatNum == 0) {
                        ShowFailedSendVerificationCodeMsg(failedMessage);
                    } else {
                        SendVerificationCodeAJAX(timeoutFailedMessage, failedMessage, phoneNumber, reapeatNum);
                    }
                }
            } else {
                if (reapeatNum == 0) {
                    ShowTimeoutFailedSendVerificationCodeMsg(timeoutFailedMessage);
                } else {
                    SendVerificationCodeAJAX(timeoutFailedMessage, failedMessage, phoneNumber, reapeatNum);
                }
            }
        },
        error: function (xhr, status) {
            if (reapeatNum == 0) {
                ShowFailedSendVerificationCodeMsg(failedMessage);
            } else {
                SendVerificationCodeAJAX(timeoutFailedMessage, failedMessage, phoneNumber, reapeatNum);
            }
        }
    });
}

function ShowSuccessSendVerificationCodeMsg() {
    $("#sendVerificationCode").find('.spinner').attr("hidden", true);
    $('#sendVerificationCodeMsg').attr("hidden", false);
}

function ShowFailedSendVerificationCodeMsg(failedMessage) {
    $('#sendVerificationCodeErrorMessage').attr("hidden", false);
    $("#sendVerificationCode").find('.spinner').attr("hidden", true);
    $('#sendVerificationCodeMsg').attr("hidden", true);

    $('#sendVerificationCodeErrorMessage').html(failedMessage);
}

function ShowTimeoutFailedSendVerificationCodeMsg(timeoutFailedMessage) {
    $('#sendVerificationCodeErrorMessage').attr("hidden", false);
    $("#sendVerificationCode").find('.spinner').attr("hidden", true);
    $('#sendVerificationCodeMsg').attr("hidden", true);

    $('#sendVerificationCodeErrorMessage').html(timeoutFailedMessage);
}

function CheckVerificationCode() {
    var verificationCode = $("#verificationCode_1").val() + $("#verificationCode_2").val() + $("#verificationCode_3").val() + $("#verificationCode_4").val();

    // if the phone was verified before with this verification code then no need to verify again
    if (successedVerificationCode != null && successedVerificationCode == verificationCode) {
        isPhoneVerified = true;
        successedVerificationCode = verificationCode;
        $("#verificationCode_1").css({ "background-color": "#c6ffb3" });
        $("#verificationCode_2").css({ "background-color": "#c6ffb3" });
        $("#verificationCode_3").css({ "background-color": "#c6ffb3" });
        $("#verificationCode_4").css({ "background-color": "#c6ffb3" });
        $('#vcode').siblings('.success-msg').attr("hidden", false);
        $('#vcode').siblings('.error-msg').attr("hidden", true);
    } else {
        var phoneNumber = $("#phoneNumber").val().toString();

        $.ajax({
            url: '/Home/CheckVerificationCode?phoneNumber=' + phoneNumber + '&verificationCode=' + verificationCode,
            success: function (data) {
                data = JSON.parse(data);
                if (data.Result == true) {
                    isPhoneVerified = true;
                    verifiedPhoneNumber = phoneNumber;
                    successedVerificationCode = verificationCode;
                    $("#verificationCode_1").css({ "background-color": "#c6ffb3" });
                    $("#verificationCode_2").css({ "background-color": "#c6ffb3" });
                    $("#verificationCode_3").css({ "background-color": "#c6ffb3" });
                    $("#verificationCode_4").css({ "background-color": "#c6ffb3" });
                    $('#vcode').siblings('.success-msg').attr("hidden", false);
                    $('#vcode').siblings('.error-msg').attr("hidden", true);
                } else {
                    isPhoneVerified = false;
                    $("#verificationCode_1").css({ "background-color": "#ffb3b3" });
                    $("#verificationCode_2").css({ "background-color": "#ffb3b3" });
                    $("#verificationCode_3").css({ "background-color": "#ffb3b3" });
                    $("#verificationCode_4").css({ "background-color": "#ffb3b3" });
                    $('#vcode').siblings('.success-msg').attr("hidden", true);
                    $('#vcode').siblings('.error-msg').attr("hidden", false);
                }
            }
        });
    }
}