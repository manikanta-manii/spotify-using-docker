// let tableData = null;
let songSelectionTable = null;
let allAlbumsOptions = null;
let allArtistsOptions = null;
let songCounter = 1;
$(document).ready(function() {

    songSelectionTable = new Tabulator("#songs-selection-table", {
        layout:"fitColumns",
        validationMode:"highlight",
        columns:[
            { title:"Sl.No", field:"id" , width: 100 , headerSort:false },
            { title:"Name <span class='ms-1 text-danger'>*</span>", field:"name" ,editor: 'input' , validator:"required"},
            { title:"Audio File <span class='ms-1 text-danger'>*</span>", field:"audio_src", formatter: audioFileFormatter , headerSort:false },
            { title:"Album <span class='ms-1 text-danger'>*</span>", field:"album", formatter: albumFormatter  , headerSort:false},
            { title:"Artists <span class='ms-1 text-danger'>*</span>", field:"artists",formatter: artistFormatter , headerSort:false},
            { title:"", field:"delete",width: 60, formatter: deleteFormater, headerSort:false },
        ],
    });

    $('#current_tab_content').on('click', '.manage_song_btn', handleManageSong);
    $('#current_tab_content').on('click', '.song-delete', handleSongDelete);

    $('#manage_song_drawer').on('click', '.close-song-drawer-btn', handleSongDrawerClose);
    $('#manage_song_drawer').on('click','.btn-save',handleSongSave);
    $('#manage_song_drawer').on('click','.add_song_icon',()=>{ $("#song_audio_file").click();});
    $('#manage_song_drawer').on('change','#song_audio_file',handleSongUpload);
    $('#manage_song_drawer').on('click', '.song-selection-delete', handleSongSelectionDelete);

});


function audioFileFormatter(cell){
    return `<audio controls>;
                <source src="${cell.getValue()}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>`;
}

function albumFormatter(cell,formatterParams, onRendered){
    debugger
    let uniqueId = cell.getRow().getData().id;
    let albumSelectDropDown = document.createElement("select");
    albumSelectDropDown.name = `song_album_${uniqueId}[]`;
    albumSelectDropDown.id = `song_album_${uniqueId}`;
    // artistSelectDropDown.multiple = true;
    $(albumSelectDropDown).html(allAlbumsOptions);


    // onRendered(function(){
    //     $(albumSelectDropDown).on("change", function () {
    //         debugger
    //         let selectedValue = $(this).val();
    //         cell.setValue(selectedValue);
    //         $(this).val(selectedValue);
    //     });
    // });

    return albumSelectDropDown;
}

function artistFormatter(cell, formatterParams, onRendered){
    let uniqueId = cell.getRow().getData().id;
    let artistSelectDropDown = document.createElement("select");
    artistSelectDropDown.name = `song_artists_${uniqueId}[]`;
    artistSelectDropDown.id = `song_artists_${uniqueId}`;
    artistSelectDropDown.multiple = true;
    $(artistSelectDropDown).html(allArtistsOptions);

    onRendered(function(){
        $(artistSelectDropDown).filterMultiSelect({
                placeholderText: "Select an artist(s)",
                filterText: "Search an artist",
                selectAllText: "Select all artists"
            }
        );
    });

    return artistSelectDropDown;

    //check why this is not working
    // const artistSelectDropDown =  `<select name="song_artists_${songCounter}[]" id="song_artists_${songCounter}" multiple>${allArtistsOptions}</select>`;
    // onRendered(function(){
    //     $(artistSelectDropDown).filterMultiSelect();
    // });
    //
    // return artistSelectDropDown;
}

function deleteFormater(cell){
    return `<span class="material-symbols-outlined song-selection-delete" data-song-selection-id="${cell.getRow().getData().id}">delete</span>`
}

function handleSongUpload(){
    const files = Array.from(this.files);
    const validAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/aac', 'audio/flac'];
    const rows = files
        .filter(file => {
            if (!validAudioTypes.includes(file.type)) {
                alert(`Invalid file type: ${file.name}. Please upload an audio file.`);
                return false;
            }
            return true;
        })
        .map((file, index) => ({
        id: songCounter++,
        name: file.name.replace(/\.[^/.]+$/, ''),
        audio_file: file,
        audio_src: URL.createObjectURL(file),
        artists_demo: ''
    }));
    songSelectionTable.addData(rows);
    $(this).val('');
}

function handleSongSelectionDelete(){
    songSelectionTable.deleteRow($(this).data('songSelectionId'));
}


function handleManageSong(){
    openDrawer('manage_song_drawer');
    $("#manage_artist_drawer").LoadingOverlay("show");
    $.ajax({
        url: "admin/songs/get_add_song_form",
        method: "GET",
        headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
    })
    .done(function(response) {
        allAlbumsOptions =  createOptionTags(response.all_albums);
        allArtistsOptions =  createOptionTags(response.all_artists);
    })
    .fail(function(response) {

    })
    .always(function() {
        $("#manage_artist_drawer").LoadingOverlay("hide");
    });



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

function createOptionTags(jsonResponse){
    return jsonResponse.map((data)=>`<option value="${data.value}">${data.name}</option>`).join('');
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
