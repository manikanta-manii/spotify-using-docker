class Admin::SongsController < Admin::BaseController
  def index
    render json: Admin::SongsPresenter.new(params).gather_data
  end

  def get_add_song_form
    @song_selection_table = render_to_string partial: "admin/songs/song_selection_table"
    # content = render_to_string "admin/artists/form" , layout: false
    @artists = Artist.all.map { |artist| { name: artist.user.name , value: artist.id   } }
    @albums = [{name:"Select an album", value: "" }] + Album.all.map { |album| { name: album.name , value: album.id } }
    render json: { all_albums: @albums , all_artists: @artists , content: @song_selection_table }
  end

  def create
    songs_creator = Admin::SongsCreator.new(songs_params)
    result = songs_creator.add_songs

    if result[:status] == :ok
      render json: { message: result[:message] }, status: :ok
    else
      render json: { errors: result[:errors] }, status: :unprocessable_entity
    end
  end

  private
  def songs_params
    params.require(:songs)
  end

end