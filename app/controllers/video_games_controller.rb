class VideoGamesController < ApplicationController
  before_action :authenticate_user!
 
  def index
    respond_to do |format|
      format.json { render json: VideoGame.all.order(:id) }
    end
  end
   
  def show
    respond_to do |format|
      format.json { render json: VideoGame.find(params[:id]) }
    end
  end
   
  def update
    videogame = VideoGame.find(params[:id])
    videogame.update(name: params[:name])
       
    respond_to do |format|
      format.json { render json: videogame }
    end
  end
 
end
