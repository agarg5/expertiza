class GameDataController < ApplicationController
  def index
    @assignmentGroup = AssignmentGroup.all
    @assignment = Assig nment.all
    
    @game_data = Hash.new
    @game_data["room"] = []
    @game_data["room"][0] = "building"

    respond_to do |format|
      # format.json  { render :json => @game_data }
      format.json  { render :json => @assignmentGroup }
    end
  end

end