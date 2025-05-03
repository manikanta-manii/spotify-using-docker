$(document).ready(function() {
    $('#current_tab_content').on('click', '.manage_album_btn', handleManageAlbum);
    $('#current_tab_content').on('click', '.album-delete', handleAlbumDelete);
    $('#manage_album_drawer').on('click', '.close-album-drawer-btn', handleAlbumDrawerClose);
    $('#manage_album_drawer').on('click','.btn-save',handleAlbumSave);
});

function handleManageAlbum(){
    const albumId = $(this).data('album-id') || null;
    $('#manage_album_drawer .btn-save').data('albumId',albumId);
    $('#manage_album_drawer h4').text(albumId ? 'Edit an album' : 'Add an album');
    openDrawer('manage_album_drawer');
    $("#manage_album_drawer").LoadingOverlay("show");
    $.ajax({
        url: "admin/albums/get_album_form",
        method: "GET",
        data: {id: albumId },
        headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
    })
    .done(function(response) {
        const contentDiv = $('#manage_album_drawer').find('div[slot="content"]');
        contentDiv.html(response.content);
    })
    .fail(function(response) {

    })
    .always(function() {
        $("#manage_album_drawer").LoadingOverlay("hide");
    });
}

function handleAlbumDrawerClose(){
    closeDrawer('manage_album_drawer');
    $('#albums-table').bootstrapTable('refresh');
}

function handleAlbumSave(){
    const isValid = validateAlbumForm();
    if(isValid){
        const albumId = $(this).data('album-id') || null;
        const ajaxUrlEndPoint = albumId ? `${albumId}` : '';
        const methodType = albumId ? 'PATCH' : 'POST';
        const ajaxUrl = `admin/albums/${ajaxUrlEndPoint}`;

        let formData = new FormData($("#manage_album_form")[0]);
        $("#manage_album_drawer").LoadingOverlay("show");
        $.ajax({
            url: ajaxUrl,
            method: methodType,
            data: formData,
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
            processData: false,
            contentType: false
        })
        .done(function(response) {
            handleAlbumDrawerClose();
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
            $("#manage_album_drawer").LoadingOverlay("hide");
        });
    }
}

function validateAlbumForm(){
    let errors = [];
    const albumCoverImage = $('#album_cover_image')[0].files[0];
    const albumName = $('#album_name').val().trim();
    const musicDirector = $('#album_music_director').val();
    const releasedDate = $('#released_date').val();

    if (albumCoverImage) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validImageTypes.includes(albumCoverImage.type)) {
            errors.push('Please upload a valid image file (jpg, jpeg, png).');
        }
    }

    if (!albumName) {
        errors.push('Album name is required.');
    }

    if (!musicDirector) {
        errors.push('Please select a music director.');
    }

    if(!releasedDate){
        errors.push('Please enter released date of the album.');
    }

    if (errors.length > 0) {
        alert(`Please fix the following errors:\n\n${errors.join('\n')}`);
        return false;
    }

    return true;
}

function albumNameFormatter(value, row, index){
    return `<span data-album-id="${row.id}" class="album-name manage_album_btn">${value}</span>`
}

function albumImageFormatter(value, row, index) {
    return `<img src="${value}" alt="Image Cover" class="album-image-cover">`;
}

function albumActionFormatter(value, row, index){
    return `<span class="material-symbols-outlined album-delete" data-album-id=${row.id}>delete</span>`
}

function albumQueryParams(params){
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

function handleAlbumDelete(){
    if (confirm("Are you sure you want to delete this album?")) {
        const artistId = $(this).data('albumId');
        $.ajax({
            url: `admin/albums/${artistId}`,
            method: 'DELETE',
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
        })
        .done(function(response) {
            $("#albums-table").bootstrapTable('refresh');
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
    }
}