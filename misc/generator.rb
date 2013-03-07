require File.dirname(__FILE__) + '/manifest.rb'

return if ARGV.count != 1
require ARGV[0]
Manifest.save(Dir.pwd)
