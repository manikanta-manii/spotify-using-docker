class Album < ApplicationRecord
  belongs_to :artist
  has_many :songs, dependent: :destroy
  has_one_attached :cover_image

  validates :name, presence: true
  validates :released_date, presence: true

end