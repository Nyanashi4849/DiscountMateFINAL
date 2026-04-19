stage('Build') {
    steps {
        bat '''
        echo Cleaning old workspace (safe mode)
        
        echo Installing dependencies...
        npm install

        echo Running tests before build sanity check...
        npm test

        echo Building Docker image with version tag...
        docker build -t discountmate-api:%BUILD_NUMBER% .

        echo Saving Docker image as artifact...
        docker save discountmate-api:%BUILD_NUMBER% -o discountmate-api.tar
        '''
    }
}
