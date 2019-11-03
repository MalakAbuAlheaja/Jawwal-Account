var pendingCampaignsCount = 0;
var approvedCampaignsCount = 0;
var archivedCampaignsCount = 0;

function initializeVariables(_pendingCampaignsCount, _approvedCampaignsCount, _archivedCampaignsCount) {
    pendingCampaignsCount = _pendingCampaignsCount;
    approvedCampaignsCount = _approvedCampaignsCount;
    archivedCampaignsCount = _archivedCampaignsCount;
}

function ApproveCampaign(element, id) {
    // Delete old messages
    $("#SuccessApproveMessage").attr("hidden", true);
    $("#ErrorApproveMessage").attr("hidden", true);

    $("#waitingSpinner_" + id).attr("hidden", false);

    $.ajax({
        url: '/Admin/Campaigns/ApproveCampaign/' + id,
        success: function (data) {
            $("#waitingSpinner_" + id).attr("hidden", true);

            if (data == true) {
                $("#SuccessApproveMessage").attr("hidden", false);
                $("#ErrorApproveMessage").attr("hidden", true);
                var table = $('#campaigns-list-table').DataTable();
                table.row($(element).parents('tr')).remove().draw();
                
                pendingCampaignsCount -= 1;
                approvedCampaignsCount += 1;
                $("#pendingCampaignsCount").html(pendingCampaignsCount);
                $("#approvedCampaignsCount").html(approvedCampaignsCount);
                $("#pendingCampaignsCountNav").html(pendingCampaignsCount);
                $("#approvedCampaignsCountNav").html(approvedCampaignsCount);
            } else {
                $("#SuccessApproveMessage").attr("hidden", true);
                $("#ErrorApproveMessage").attr("hidden", false);
                $("#ErrorApproveMessage").html(data.Message);
            }
        }
    });
}

function RejectCampaign(element, id) {
    // Delete old messages
    $("#SuccessRejectMessage").attr("hidden", true);
    $("#ErrorRejectMessage").attr("hidden", true);

    $("#waitingSpinner_" + id).attr("hidden", false);

    $.ajax({
        url: '/Admin/Campaigns/RejectCampaign/' + id,
        success: function (data) {
            $("#waitingSpinner_" + id).attr("hidden", true);

            data = JSON.parse(data);
            if (data == true) {
                $("#SuccessRejectMessage").attr("hidden", false);
                $("#ErrorRejectMessage").attr("hidden", true);
                var table = $('#campaigns-list-table').DataTable();
                table.row($(element).parents('tr')).remove().draw();
                
                pendingCampaignsCount -= 1;
                archivedCampaignsCount += 1;
                $("#pendingCampaignsCount").html(pendingCampaignsCount);
                $("#archivedCampaignsCount").html(archivedCampaignsCount);
                $("#pendingCampaignsCountNav").html(pendingCampaignsCount);
                $("#archivedCampaignsCountNav").html(archivedCampaignsCount);
            } else {
                $("#SuccessRejectMessage").attr("hidden", true);
                $("#ErrorRejectMessage").attr("hidden", false);
            }
        }
    });
}

function ActivateCampaign(element, id) {
    // Delete old messages
    $("#SuccessDeactivateMessage").attr("hidden", true);
    $("#ErrorDeactivateMessage").attr("hidden", true);
    $("#SuccessActivateMessage").attr("hidden", true);
    $("#ErrorActivateMessage").attr("hidden", true);

    $("#waitingSpinner_" + id).attr("hidden", false);

    $.ajax({
        url: '/Admin/Campaigns/ActivateCampaign/' + id,
        success: function (data) {
            $("#waitingSpinner_" + id).attr("hidden", true);

            data = JSON.parse(data);
            if (data == true) {
                $("#SuccessActivateMessage").attr("hidden", false);
                $("#ErrorActivateMessage").attr("hidden", true);
                $(element).attr("onclick", "DeactivateCampaign(this," + id + ")");
                $(element).attr("checked", true);
            } else {
                $("#SuccessActivateMessage").attr("hidden", true);
                $("#ErrorActivateMessage").attr("hidden", false);
            }
        }
    });
}

function DeactivateCampaign(element, id) {
    // Delete old messages
    $("#SuccessDeactivateMessage").attr("hidden", true);
    $("#ErrorDeactivateMessage").attr("hidden", true);
    $("#SuccessActivateMessage").attr("hidden", true);
    $("#ErrorActivateMessage").attr("hidden", true);

    $("#waitingSpinner_" + id).attr("hidden", false);

    $.ajax({
        url: '/Admin/Campaigns/DeactivateCampaign/' + id,
        success: function (data) {
            $("#waitingSpinner_" + id).attr("hidden", true);

            data = JSON.parse(data);
            if (data == true) {
                $("#SuccessDeactivateMessage").attr("hidden", false);
                $("#ErrorDeactivateMessage").attr("hidden", true);
                $(element).attr("onclick", "ActivateCampaign(this," + id + ")");
                $(element).attr("checked", false);
            } else {
                $("#SuccessDeactivateMessage").attr("hidden", true);
                $("#ErrorDeactivateMessage").attr("hidden", false);
            }
        }
    });
}