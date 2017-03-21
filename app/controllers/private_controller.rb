class PrivateController < ApplicationController
  before_action :authenticate_user!
 
  def index
    render inline: "<%= react_component('PrivateRoute') %>", layout: 'application'
  end
 	
end
