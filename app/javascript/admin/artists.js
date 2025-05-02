$(document).ready(function() {
    $('#current_tab_content').on('click', '.manage_artist_btn', handleManageArtist);
    $('#manage_artist_drawer').on('click', '.close-artist-drawer-btn', handleArtistDrawerClose);
    $('#manage_artist_drawer').on('click','.btn-save',handleArtistSave);
});

function handleArtistSave(){
    const isValid = validateArtistForm();
    if(isValid){
        let formData = new FormData($("#manage_artist_form")[0]);
        $("#manage_artist_drawer").LoadingOverlay("show");
        $.ajax({
            url: "admin/artists",
            method: "POST",
            data: formData,
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
            processData: false,
            contentType: false
        })
        .done(function(response) {

        })
        .fail(function() {

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
    //do something
    openDrawer('manage_artist_drawer');
    //do something
}

function handleArtistDrawerClose(){
    // Do something
    closeDrawer('manage_artist_drawer');
    //do something
}
function artistNameFormatter(value, row, index){
    return `<span class="artist-name manage_artist_btn">${value}</span>`
}
function artistAvatarFormatter(value, row, index) {
    return `<img src="${value}" alt="Avatar" class="artist-avatar">`;
}

function artistActionFormatter(value, row, index){
    return `<span class="material-symbols-outlined artist-delete">delete</span>`
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