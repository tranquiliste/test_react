class HomeController < ApplicationController
  def index
    render inline: "<%= react_component('HomeComponent', {}, {prerender: true}) %>", layout: 'application'
  end
end
