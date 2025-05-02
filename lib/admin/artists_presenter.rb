require 'will_paginate/array'
class Admin::ArtistsPresenter
  DEFAULT_PER_PAGE = 10
  DEFAULT_PAGE = 1
  SORTABLE_COLUMNS = [:name].freeze


  def initialize(params)
    @params = params
    @artists = get_all_artists
  end

  def gather_data
    artists = filter_artists
    { total: artists.total_entries, rows: artists }
  end

  private

  def artist_data(artist)
    data = Hash.new
    data[:id] = artist.id
    if artist.user.avatar.attached?
      data[:avatar] = Rails.application.routes.url_helpers.url_for(artist.user.avatar)
    end
    data[:name] = artist.user.name
    data[:dob] = artist.user.dob
    data[:email] = artist.user.email
    data[:bio] = artist.bio
    data
  end

  def get_all_artists
    artists = Artist.joins(:user)
    artists = artists.where(*search_condition) if search_condition
    artists
  end

  def sort_artists_by_column(artists)
    sort_column = SORTABLE_COLUMNS.include?(@params[:sort_column]) ? @params[:sort_column] : "name"
    sort_order = %w[asc desc].include?(@params[:sort_order]) ? @params[:sort_order] : "asc"
    sorted_artists = artists.sort_by { |artist| artist[sort_column].to_s }
    sorted_artists.reverse! if sort_order == 'desc'
    sorted_artists
  end

  def filter_artists
    page = @params[:page] || DEFAULT_PAGE
    per_page = @params[:per_page] || DEFAULT_PER_PAGE
    artists = @artists.map { |artist| artist_data(artist) }
    artists = sort_artists_by_column(artists)
    artists = artists.paginate(page: page, per_page: per_page)
    artists
  end

  def search_condition
    search = @params[:search]
    return unless search
    ["users.name LIKE ?", "%#{search}%"]
  end

end