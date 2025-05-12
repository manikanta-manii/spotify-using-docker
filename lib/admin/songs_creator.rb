class Admin::SongsCreator
  def initialize(song_params)
    @song_params = song_params
  end

  def add_songs
    @song_params.each do |_index, song_data|
      add_song(song_data)
    end
    { message: 'Songs created successfully', status: :ok }
  rescue StandardError => e
    { errors: e.message, status: :unprocessable_entity }
  end

  private

  def add_song(song_data)
    song = Song.new(
      name: song_data[:name],
      audio_file: song_data[:audio_file],
      album_id: song_data[:album_id]
    )
    if song.save
      song.artists << Artist.where(id: song_data[:artist_ids])
    else
      raise StandardError, song.errors.full_messages.join(', ')
    end
  end
end