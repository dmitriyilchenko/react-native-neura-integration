
require "json"
package = JSON.parse(File.read(File.join(__dir__, "../", "package.json")))

Pod::Spec.new do |s|
  s.name          = "NeuraSDKManager"
  s.version       = package["version"]
  s.summary       = package["description"]
  s.requires_arc  = true
  s.author        = { "youvalv" => "youval@theneura.com" }
  s.license       = package["license"]
  s.homepage      = package["homepage"]
  s.source        = { :git => "https://github.com/NeuraLabs/react_native_sample_app.git" }
  s.source_files = "NeuraSDKManager/NeuraSDKManager.{h,m}"
  s.dependency      "NeuraSDKFramework", "~> 4.5"
end
