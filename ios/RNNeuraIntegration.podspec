Pod::Spec.new do |s|
  s.name         = "RNNeuraIntegration"
  s.version      = "0.20.0"
  s.summary      = "Neura for react-native"

  s.homepage     = "https://github.com/rebeccahughes/react-native-device-info"


  s.source       = { :git => "https://Jonathandayzz@bitbucket.org/dayzz/react-native-neura-integration.git" }

  s.source_files  = "RNNeuraIntegration/*.{h,m}"

  s.dependency 'React'

   s.license      = "MIT"
    s.authors      = { "Rebecca Hughes" => "rebecca@learnium.net" }
    s.ios.deployment_target = '8.0'
    s.tvos.deployment_target = '10.0'

end
