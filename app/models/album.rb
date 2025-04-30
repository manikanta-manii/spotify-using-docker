class Album < ApplicationRecord
  belongs_to :artist # Note: belongs_to is required by default in Rails 5+
  has_many :songs, dependent: :destroy
  has_one_attached :cover_image

  validates :name, presence: true
  validates :released_date, presence: true

end