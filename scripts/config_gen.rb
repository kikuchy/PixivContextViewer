require File.dirname(__FILE__) + '/manifest.rb'

return if ARGV.count != 2
require ARGV[0]
Manifest.save(ARGV[1])
