void setBuildStatus(String message, String state) {
    step([
        $class: "GitHubCommitStatusSetter",
        reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/projekt-zespolowy-ug/P.Y.T.A"],
        contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
        errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
        statusResultSource: [
            $class: "ConditionalStatusResultSource",
            results: [[$class: "AnyBuildResult", message: message, state: state]]
        ]
    ])
}

pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDENTIALS = 'DOCKERHUB-1'
        DOCKER_IMAGE_NAME = 'mateuszkurowski/p.y.t.a'
    }
    stages {
        stage('Clone the repository') {
            steps {
                checkout scm
            }
        }

        stage('Build and push backend') {
            agent any
            steps {
                script {
                    setBuildStatus("Building backend docker image...", "PENDING")
                    def backend_docker_image = docker.build("${DOCKER_IMAGE_NAME}-backend", "./backend")
                    
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_HUB_CREDENTIALS) {
                        backend_docker_image.push('latest')
                    }
                    setBuildStatus("Backend docker image pushed successfully", "SUCCESS")
                }
            }
        }

        stage('Build frontend image') {
            agent any
            steps {
                script {
                    setBuildStatus("Building frontend docker image...", "PENDING")
                    def frontend_docker_image = docker.build("${DOCKER_IMAGE_NAME}-frontend", "./frontend")
                    
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_HUB_CREDENTIALS) {
                        frontend_docker_image.push('latest')
                    }
                    setBuildStatus("Frontend docker image pushed successfully", "SUCCESS")
                }
            }
        }
    }

    post {
        success {
            script {
                setBuildStatus("Build succeeded", "SUCCESS")
            }
        }
        failure {
            script {
                setBuildStatus("Build failed", "FAILURE")
            }
        }
    }
}
