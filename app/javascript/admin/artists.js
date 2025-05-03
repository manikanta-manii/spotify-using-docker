$(document).ready(function() {
    $('#current_tab_content').on('click', '.manage_artist_btn', handleManageArtist);
    $('#current_tab_content').on('click', '.artist-delete', handleArtistDelete);
    $('#manage_artist_drawer').on('click', '.close-artist-drawer-btn', handleArtistDrawerClose);
    $('#manage_artist_drawer').on('click','.btn-save',handleArtistSave);
});

function handleArtistSave(){
    const isValid = validateArtistForm();
    if(isValid){
        const artistId = $(this).data('artist-id') || null;
        const ajaxUrlEndPoint = artistId ? `${artistId}` : '';
        const methodType = artistId ? 'PATCH' : 'POST';
        const ajaxUrl = `admin/artists/${ajaxUrlEndPoint}`;

        let formData = new FormData($("#manage_artist_form")[0]);
        $("#manage_artist_drawer").LoadingOverlay("show");
        $.ajax({
            url: ajaxUrl,
            method: methodType,
            data: formData,
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
            processData: false,
            contentType: false
        })
        .done(function(response) {
            handleArtistDrawerClose();
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
            $("#manage_artist_drawer").LoadingOverlay("hide");
        });
    }
}

function validateArtistForm() {
    const name = $('#artist_name').val().trim();
    const email = $('#artist_email').val().trim();
    const avatar = $('#artist_avatar')[0].files[0];

    let errors = [];

    if (!name) {
        errors.push('Name is required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.push('Email is required.');
    } else if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address.');
    }

    if (avatar) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(avatar.type)) {
            errors.push('Please upload a valid image file (JPEG, PNG, or GIF).');
        }
    }

    if (errors.length > 0) {
        alert(`There are ${errors.length} error(s):\n\n${errors.join('\n')}`);
        return false;
    }

    return true;
}
function handleManageArtist(){
    const artistId = $(this).data('artist-id') || null;
    $('#manage_artist_drawer .btn-save').data('artistId',artistId);
    $('#manage_artist_drawer h4').text(artistId ? 'Edit an artist' : 'Add an artist');
    openDrawer('manage_artist_drawer');
    $("#manage_artist_drawer").LoadingOverlay("show");
    $.ajax({
        url: "admin/artists/get_artist_form",
        method: "GET",
        data: {id: artistId },
        headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
    })
    .done(function(response) {
        const contentDiv = $('#manage_artist_drawer').find('div[slot="content"]');
        contentDiv.html(response.content);
    })
    .fail(function(response) {

    })
    .always(function() {
        $("#manage_artist_drawer").LoadingOverlay("hide");
    });
}

function handleArtistDrawerClose(){
    closeDrawer('manage_artist_drawer');
    $('#artists-table').bootstrapTable('refresh');
}

function artistNameFormatter(value, row, index){
    return `<span data-artist-id="${row.id}" class="artist-name manage_artist_btn">${value}</span>`
}

function artistAvatarFormatter(value, row, index) {
    return `<img src="${value}" alt="Avatar" class="artist-avatar">`;
}

function artistActionFormatter(value, row, index){
    return `<span class="material-symbols-outlined artist-delete" data-artist-id=${row.id}>delete</span>`
}

function artistQueryParams(params){
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

function handleArtistDelete(){
    if (confirm("Are you sure you want to delete this artist?")) {
        const artistId = $(this).data('artistId');
        $.ajax({
            url: `admin/artists/${artistId}`,
            method: 'DELETE',
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
        })
        .done(function(response) {
            $("#artists-table").bootstrapTable('refresh');
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