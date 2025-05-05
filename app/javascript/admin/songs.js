$(document).ready(function() {
    $('#current_tab_content').on('click', '.manage_song_btn', handleManageSong);
    $('#current_tab_content').on('click', '.song-delete', handleSongDelete);
    $('#manage_song_drawer').on('click', '.close-song-drawer-btn', handleSongDrawerClose);
    $('#manage_song_drawer').on('click','.btn-save',handleSongSave);
});


function handleManageSong(){
    openDrawer('manage_song_drawer');
    // const songId = $(this).data('song-id') || null;
    // $('#manage_artist_drawer .btn-save').data('artistId',artistId);
    // $('#manage_artist_drawer h4').text(artistId ? 'Edit an artist' : 'Add an artist');
    // openDrawer('manage_artist_drawer');
    // $("#manage_artist_drawer").LoadingOverlay("show");
    // $.ajax({
    //     url: "admin/artists/get_artist_form",
    //     method: "GET",
    //     data: {id: artistId },
    //     headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
    // })
//     .done(function(response) {
//         const contentDiv = $('#manage_artist_drawer').find('div[slot="content"]');
//         contentDiv.html(response.content);
//     })
//     .fail(function(response) {
//
//     })
//     .always(function() {
//         $("#manage_artist_drawer").LoadingOverlay("hide");
//     });
}

function handleSongDelete(){

}

function handleSongDrawerClose(){
    closeDrawer('manage_song_drawer');
    // $('#songs-table').bootstrapTable('refresh');
}

function handleSongSave(){

}

function songQueryParams(params){
    const sort_column = params && params.sort ? params.sort : 'name';
    const sort_order = params && params.order ? params.order : 'asc';
    const search_text = params && params.search ? params.search : '';

    return {
        sort_column: sort_column,
        sort_order: sort_order,
        search: search_text,
        per_page: params.limit,
        page: params.offset / params.limit + 1
    };
}
