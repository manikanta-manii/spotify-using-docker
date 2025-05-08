class Admin::SongsController < Admin::BaseController
  def index

  end

  def get_add_song_form

    # content = render_to_string "admin/artists/form" , layout: false
    @artists = Artist.all.map { |artist| { name: artist.user.name , value: artist.id   } }
    @albums = [{name:"Select an album", value: "" }] + Album.all.map { |album| { name: album.name , value: album.id } }
    render json: { all_albums: @albums , all_artists: @artists }
  end

  def create
  #   songs_params = params[:songs]
  #
  #   songs_params.each do |_index, song_data|
  #     name = song_data[:name]
  #     audio_file = song_data[:audio_file]
  #     album_id = song_data[:album_id]
  #     artist_ids = song_data[:artist_ids].values
  #
  #     # Create the song record
  #     song = Song.new(name: name, album_id: album_id, audio_file: audio_file)
  #
  #     if song.save
  #       # Associate artists with the song
  #       song.artists << Artist.where(id: artist_ids)
  #     else
  #       render json: { errors: song.errors.full_messages }, status: :unprocessable_entity
  #       return
  #     end
  #   end
  #
  #   render json: { message: 'Songs created successfully' }, status: :ok
  end

end