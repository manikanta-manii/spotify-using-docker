class Admin::SongsController < Admin::BaseController
  def index

  end

  def get_add_song_form
    @artists = Artist.all.map { |artist| { name: artist.user.name , value: artist.id   } }
    @albums = [{name:"Select an album", value: "" }] + Album.all.map { |album| { name: album.name , value: album.id } }
    render json: { all_albums: @albums , all_artists: @artists }
  end

  def create
    puts "Hi"
  end


end