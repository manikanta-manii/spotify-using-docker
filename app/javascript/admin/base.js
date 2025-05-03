$(document).ready(function() {
    loadTabContent('artists');
    $('#admin_base_page')
        .on('click', '.tab-button',handleTabClick);
});

function handleTabClick(){
    const currentActiveTab = $('.active');
    const clickedTab = $(this);
    if(currentActiveTab.is(clickedTab)){
        return;
    }
    $('.tab-button').removeClass('active');
    clickedTab.addClass('active');
    loadTabContent(clickedTab.data('tab'));
}

function loadTabContent(tabName){
    $("#current_tab_content").LoadingOverlay("show");
    $.ajax({
        url: "admin/get_tab_content",
        method: "GET",
        data: { tab_name : tabName }
    })
    .done(function(response) {
        $("#current_tab_content").html(response.content);
        $(`#${tabName}-table`).bootstrapTable();
    })
    .fail(function() {

    })
    .always(function() {
        $("#current_tab_content").LoadingOverlay("hide");
    });
}