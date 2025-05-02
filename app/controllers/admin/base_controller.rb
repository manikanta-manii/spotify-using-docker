class Admin::BaseController < ApplicationController
  def index

  end

  def get_tab_content
    render json: {
      content: (render_to_string partial: "admin/#{params[:tab_name]}/listing_page" )
    }
  end

end