class Admin::ArtistsController < Admin::BaseController
  def index
    render json: Admin::ArtistsPresenter.new(params).gather_data
  end

  def get_artist_form
    if params[:id].present?
       @artist = Artist.find(params[:id])
    else
      @artist = User.new.build_artist
    end
    render json: {
      content: (render_to_string "admin/artists/form" , layout: false)
    }
  end

  def create
    @user = User.new(user_params.merge(password: "artist@123", role: 1 ))
    @artist = @user.build_artist(artist_params)
    # Here new user object is created , but not saved (with user params + password + role)
    # build_artist is ruby method which creates a new artist object but not saved , associated with user object
    if @user.save
      render json: { message: "Artist Created Successfully "}, status: :created
    else
      render json: { errors: @user.errors.full_messages + @artist.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @artist = Artist.find(params[:id])
    user_updated = @artist.user.update(user_params)
    artist_updated = @artist.update(artist_params)

    if user_updated && artist_updated
      render json: { message: "Artist updated successfully." }, status: :ok
    else
      render json: { errors: @artist.errors.full_messages + @artist.user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @artist = Artist.find(params[:id])
    @user = @artist.user

    if @user.destroy
      render json: { message: "Artist and associated user deleted successfully." }, status: :ok
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end


  # // My intial code
  # @user = User.new(user_params)
  # @user.role = 1
  # @user.password = "artist@123"
  # if @user.save
  #   @artist = Artist.new(artist_params)
  #   @artist.user_id = @user.id
  #   if @artist.save
  #     render json: { message: 'Artist created successfully.', artist: @artist }, status: :created
  #   else
  #     render json: { errors: @artist.errors.full_messages }, status: :unprocessable_entity
  #   end
  # else
  #   render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
  # end

  private

  def user_params
    params.require(:user).permit(:name,:avatar,:dob,:email);
  end

  def artist_params
    params.require(:artist).permit(:bio);
  end
end