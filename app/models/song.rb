class Song < ApplicationRecord
  belongs_to :album
  has_many :song_artists, dependent: :destroy
  has_many :artists, through: :song_artists
  has_one_attached :audio_file

  has_many :playlist_songs, dependent: :destroy
  has_many :playlists, through: :playlist_songs

end