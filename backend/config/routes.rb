Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'auth/login', to: 'auth#login'
      get 'account/balance', to: 'accounts#balance'
      post 'transfers', to: 'transfers#create'
      get 'movements', to: 'movements#index'
    end
  end
end
