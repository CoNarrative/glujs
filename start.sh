if [ -z $NAVEPATH ]; then
    bash -c "$(curl -s 'https://raw.github.com/isaacs/nave/master/nave.sh') use 0.6 bash $0" 
else
    echo "nodejs is installed, so let's install packages and run the app"
    npm install
    node app.js
fi
