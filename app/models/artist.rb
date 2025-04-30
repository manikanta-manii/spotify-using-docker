class Artist < ApplicationRecord
  belongs_to :user

  has_many :albums, dependent: :destroy
  has_many :song_artists, dependent: :destroy
  has_many :songs, through: :song_artists

  validates :user_id, uniqueness: true

  def artist_name
    user.name
  end

end