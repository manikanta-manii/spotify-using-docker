class Playlist < ApplicationRecord
  belongs_to :user

  has_many :playlist_songs, dependent: :destroy
  has_many :songs, through: :playlist_songs

  validates :name, presence: true, uniqueness: { scope: :user_id }
end