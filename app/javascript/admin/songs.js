let songSelectionTable = null;
let allAlbumsOptions = null;
let allArtistsOptions = null;
let songCounter = 1;
let multiSelectComponents = [];
$(document).ready(function() {


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
    let uniqueId = cell.getRow().getData().id;
    let albumSelectDropDown = document.createElement("select");
    albumSelectDropDown.name = `song_album_${uniqueId}[]`;
    albumSelectDropDown.id = `song_album_${uniqueId}`;
    $(albumSelectDropDown).html(allAlbumsOptions);

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
        const multiSelectComponent = $(artistSelectDropDown).filterMultiSelect({
                placeholderText: "Select an artist(s)",
                filterText: "Search an artist",
                selectAllText: "Select all artists"
            }
        );
        multiSelectComponents.push({id: uniqueId,component: multiSelectComponent});
    });

    return artistSelectDropDown;
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
        audio_src: URL.createObjectURL(file)
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
        const contentDiv = $('#manage_song_drawer').find('div[slot="content"]');
        contentDiv.html(response.content);
    })
    .fail(function(response) {

    })
    .always(function() {
        $("#manage_artist_drawer").LoadingOverlay("hide");
    });
}

function createOptionTags(jsonResponse){
    return jsonResponse.map((data)=>`<option value="${data.value}">${data.name}</option>`).join('');
}

function handleSongDelete(){

}

function handleSongDrawerClose(){
    closeDrawer('manage_song_drawer');
    $('#songs-table').bootstrapTable('refresh');
}

function handleSongSave(){
    const songSelectionTableLength = songSelectionTable.getDataCount()
    if(!songSelectionTableLength){
        return;
    }
    const songSelectionTableIds =  songSelectionTable.getData().map((item)=>item.id);
    const isValid = songSelectionTable.getInvalidCells().length === 0 && checkAlbumValidation(songSelectionTableIds) && checkArtistsValidation(songSelectionTableIds);
    if(isValid){
        $("#manage_song_drawer").LoadingOverlay("show");
        const songs = getPlayload();

        const formData = new FormData();

        songs.forEach((song, index) => {
            formData.append(`songs[${index}][name]`, song.name);
            formData.append(`songs[${index}][audio_file]`, song.audio_file);
            formData.append(`songs[${index}][album_id]`, song.album_id);

            song.artist_ids.forEach((artistId, i) => {
                formData.append(`songs[${index}][artist_ids][]`, artistId);
            });
        });

        $.ajax({
            url: "admin/songs",
            method: "POST",
            data: formData,
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
            contentType: false,
            processData: false,
        })
        .done(function(response) {
            handleSongDrawerClose();
        })
        .fail(function(response) {
            const errors = response.responseJSON.errors;
            if (Array.isArray(errors) && errors.length > 0) {
                const errorMessage = `Please fix the following errors:\n\n${errors.join('\n')}`;
                alert(errorMessage);
            } else {
                alert('An unknown error occurred.');
            }
        })
        .always(function() {
            $("#manage_song_drawer").LoadingOverlay("hide");
        });
    }
}

function getPlayload(){
    let payloadArray = []
    songSelectionTable.getData().map((item)=>{
        payloadArray.push({
            name: item.name,
            audio_file: item.audio_file,
            album_id : $(`#song_album_${item.id}`).val(),
            artist_ids: getArtist(item.id)
        });
    });

    return payloadArray;
}

function getArtist(songId){
    const artistIds =  JSON.parse(multiSelectComponents.find((item)=> item.id === songId).component.getSelectedOptionsAsJson());
    for (const [key, value] of Object.entries(artistIds)) {
        return value;
    }
}
function checkAlbumValidation(songSelectionTableIds){
    let allFilled = true;
    let emptyAlbumIds = [];
       songSelectionTableIds.forEach((songId)=>{
            const albumIds = $(`#song_album_${songId}`).val();
            if(albumIds.length === 0){
                emptyAlbumIds.push(songId);
                allFilled = false;
            }
       });
       if(emptyAlbumIds.length){
           alert(`Please select an album for song with ID: ${emptyAlbumIds}`);
       }
   return allFilled;
}

function checkArtistsValidation(songSelectionTableIds){
    let allFilled = true;
    let emptyArtistIds = [];
    multiSelectComponents.filter((item)=>songSelectionTableIds.includes(item.id)).forEach((item)=>{
        const artistIds = JSON.parse(item.component.getSelectedOptionsAsJson());
        for (const [key, value] of Object.entries(artistIds)) {
            if(value.length === 0){
                emptyArtistIds.push(item.id);
                allFilled = false;
            }
        }
    });
    if(emptyArtistIds.length){
        alert(`Please select an artist for song with ID: ${emptyArtistIds}`);
    }
    return allFilled;
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

function songNameFormatter(value, row, index){
    return `<span data-song-id="${row.id}" class="song-name">${value}</span>`
}

function songImageFormatter(value, row, index) {
    return `<img src="${value}" alt="Image Cover" class="song-image-cover">`;
}

function songActionFormatter(value, row, index){
    return `<span class="material-symbols-outlined song-delete" data-song-id=${row.id}>delete</span>`
}

function songAudioFileFormatter(value,row,index){
    return `<audio controls>
                <source src="${value}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>`;
}

function songArtistsFormatter(value,row,index){
    debugger
    return value.map((artist)=>artist.name).join(', ');
}