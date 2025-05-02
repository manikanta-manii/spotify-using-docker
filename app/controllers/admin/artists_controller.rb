class Admin::ArtistsController < Admin::BaseController
  def index
    render json: {
      total: 10,
      rows: [
        {
          id: 1,
          name: "Anirudh",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "2002-12-15",
          email: "anirudh@example.com",
          bio: "Rockstar music composer"
        },
        {
          id: 2,
          name: "GV Prakash",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "1987-06-13",
          email: "gvprakash@example.com",
          bio: "Singer and composer"
        },
        {
          id: 3,
          name: "MM Keeravani",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "1961-07-04",
          email: "mmkeeravani@example.com",
          bio: "Award-winning composer"
        },
        {
          id: 4,
          name: "AR Rahman",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "1967-01-06",
          email: "arrahman@example.com",
          bio: "Legendary music director"
        },
        {
          id: 5,
          name: "Ilaiyaraaja",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "1943-06-02",
          email: "ilaiyaraaja@example.com",
          bio: "The Maestro of Indian music"
        },
        {
          id: 6,
          name: "Ilaiyaraaja",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "1943-06-02",
          email: "ilaiyaraaja@example.com",
          bio: "The Maestro of Indian music"
        },
        {
          id: 7,
          name: "Ilaiyaraaja",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "1943-06-02",
          email: "ilaiyaraaja@example.com",
          bio: "The Maestro of Indian music"
        },
        {
          id: 8,
          name: "Ilaiyaraaja",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "1943-06-02",
          email: "ilaiyaraaja@example.com",
          bio: "The Maestro of Indian music"
        },
        {
          id: 9,
          name: "Ilaiyaraaja",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "1943-06-02",
          email: "ilaiyaraaja@example.com",
          bio: "The Maestro of Indian music"
        },
        {
          id: 10,
          name: "Ilaiyaraaja",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "1943-06-02",
          email: "ilaiyaraaja@example.com",
          bio: "The Maestro of Indian music"
        },
        {
          id: 11,
          name: "Ilaiyaraaja",
          avatar: "https://i.pinimg.com/736x/f0/a6/f7/f0a6f72b9e638a652aec92c6f39d6b83.jpg",
          dob: "1943-06-02",
          email: "ilaiyaraaja@example.com",
          bio: "The Maestro of Indian music"
        }
      ]
    }
  end

  def create
  #   @artist = Artist.new(artist_params)
  #   if @artist.save
  #     render json: { message: 'Artist created successfully.', artist: @artist }, status: :created
  #   else
  #     render json: { errors: @artist.errors.full_messages }, status: :unprocessable_entity
  #   end
  end
end