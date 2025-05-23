Rails.application.routes.draw do
  root "pages#index"
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  namespace :admin do
    root to: "base#index"
    get "get_tab_content" => "base#get_tab_content", as: :get_tab_content
    get "artists/get_artist_form" => "artists#get_artist_form", as: :get_artist_form
    get "albums/get_album_form" => "albums#get_album_form", as: :get_album_form
    get "songs/get_add_song_form" => "songs#get_add_song_form", as: :get_add_song_form
    resources :artists , only: [:index, :create , :update , :destroy]
    resources :albums , only: [:index, :create , :update , :destroy]
    resources :songs , only: [:index, :create , :update , :destroy]
  end
  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
end
