Rails.application.routes.draw do
  root 'home#index'
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :video_games, only: [:index, :show, :update]
  resources :home, only: :index
  resources :private, only: :index
 
  match "private/*path", to: 'private#index', via: [ :get, :post ]
  match "*path", to: 'home#index', via: [ :get, :post ]

end
