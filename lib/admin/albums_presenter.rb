require 'will_paginate/array'
class Admin::AlbumsPresenter
  DEFAULT_PER_PAGE = 10
  DEFAULT_PAGE = 1
  SORTABLE_COLUMNS = [:name].freeze

  def initialize(params)
    @params = params
    @albums = get_all_albums
  end

  def gather_data
    albums = filter_albums
    { total: albums.total_entries, rows: albums }
  end

  private

  def album_data(album)
    data = Hash.new
    data[:id] = album.id
    if album.cover_image.attached?
      data[:cover_image] = Rails.application.routes.url_helpers.url_for(album.cover_image)
    end
    data[:name] = album.name
    data[:released_date] = album.released_date
    data[:description] = album.description
    data[:music_director] = album.artist.user.name
    data
  end

  def get_all_albums
    albums = Album.where(*search_condition) if search_condition
    albums
  end

  def sort_albums_by_column(albums)
    sort_column = SORTABLE_COLUMNS.include?(@params[:sort_column]) ? @params[:sort_column] : "name"
    sort_order = %w[asc desc].include?(@params[:sort_order]) ? @params[:sort_order] : "asc"
    sorted_albums = albums.sort_by { |album| album[sort_column].to_s }
    sorted_albums.reverse! if sort_order == 'desc'
    sorted_albums
  end

  def filter_albums
    page = @params[:page] || DEFAULT_PAGE
    per_page = @params[:per_page] || DEFAULT_PER_PAGE
    albums = @albums.map { |album| album_data(album) }
    albums = sort_albums_by_column(albums)
    albums = albums.paginate(page: page, per_page: per_page)
    albums
  end

  def search_condition
    search = @params[:search]
    return unless search
    ["albums.name LIKE ?", "%#{search}%"]
  end

end