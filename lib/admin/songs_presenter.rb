require 'will_paginate/array'
class Admin::SongsPresenter
  DEFAULT_PER_PAGE = 10
  DEFAULT_PAGE = 1
  SORTABLE_COLUMNS = [:name].freeze

  def initialize(params)
    @params = params
    @songs = get_all_songs
  end

  def gather_data
    songs = filter_songs
    { total: songs.total_entries, rows: songs }
  end

  private

  def song_data(song)
    data = Hash.new
    data[:id] = song.id
    if song.album.cover_image.attached?
      data[:cover_image] = Rails.application.routes.url_helpers.url_for(song.album.cover_image)
    end
    if song.audio_file.attached?
      data[:audio_file] = Rails.application.routes.url_helpers.url_for(song.audio_file)
    end
    data[:name] = song.name
    data[:album] = song.album.name
    data[:artists] = song.artists.map { |artist| { id: artist.id, name: artist.user.name } }
    data
  end

  def get_all_songs
    songs = Song.where(*search_condition) if search_condition
    songs
  end

  def sort_songs_by_column(songs)
    sort_column = SORTABLE_COLUMNS.include?(@params[:sort_column]) ? @params[:sort_column] : "name"
    sort_order = %w[asc desc].include?(@params[:sort_order]) ? @params[:sort_order] : "asc"
    sorted_songs = songs.sort_by { |songs| songs[sort_column].to_s }
    sorted_songs.reverse! if sort_order == 'desc'
    sorted_songs
  end

  def filter_songs
    page = @params[:page] || DEFAULT_PAGE
    per_page = @params[:per_page] || DEFAULT_PER_PAGE
    songs = @songs.map { |song| song_data(song) }
    songs = sort_songs_by_column(songs)
    songs = songs.paginate(page: page, per_page: per_page)
    songs
  end

  def search_condition
    search = @params[:search]
    return unless search
    ["songs.name LIKE ?", "%#{search}%"]
  end

end