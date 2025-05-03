class Admin::AlbumsController < Admin::BaseController

  def index
    render json: Admin::AlbumsPresenter.new(params).gather_data
  end

  def get_album_form
    if params[:id].present?
      @album = Album.find(params[:id])
    else
      @album = Album.new
    end
    render json: {
      content: (render_to_string "admin/albums/form" , layout: false)
    }
  end

  def create
    @album = Album.new(album_params)
    if @album.save
      render json: { message: "Album Created Successfully "}, status: :created
    else
      render json: { errors: @album.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @album = Album.find(params[:id])

    if @album.update(album_params)
      render json: { message: "Album updated successfully." }, status: :ok
    else
      render json: { errors: @album.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @album = Album.find(params[:id])

    if @album.destroy
      render json: { message: "Album deleted successfully." }, status: :ok
    else
      render json: { errors: @album.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def album_params
    params.require(:album).permit(:cover_image , :name, :released_date, :description, :artist_id)
  end

end