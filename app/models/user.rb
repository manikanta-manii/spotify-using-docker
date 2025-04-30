class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_one_attached :avatar
  has_one :artist , dependent: :destroy
  has_many :playlists, dependent: :destroy

  # after_initialize :set_default_role
  # no need to set default role here as it is already set in the migration
  def get_role
    if self.role == 0
      "Admin"
    elsif self.role == 1
      "Artist"
    else
      "Listener"
    end
  end

  def is_admin?
    self.role == 0
  end

  def is_artist?
    self.role == 1
  end

  def is_listener?
    self.role == 2
  end

  # private
  #
  # def set_default_role
  #   self.role ||= 0
  # end

end
