require 'sinatra/base'

class Web < Sinatra::Base


configure do
  set :public_folder, 'public'
end

get "/" do
  redirect '/index.html'
end

get %r{/.*/$} do
  redirect "#{request.path_info}index.html"
end

not_found do
  redirect '/404.html'
end

end