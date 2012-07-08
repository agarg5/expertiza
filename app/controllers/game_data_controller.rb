class GameDataController < ApplicationController
  def index
    @game_data = GameDataHelper::get_game_data(session[:user].id)

    respond_to do |format|
      format.json  { render :json => @game_data }
    end
  end

end