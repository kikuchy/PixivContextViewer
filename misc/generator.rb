require 'manifest'

return if ARGV.count != 1
require ARGV[0]
Manifest.save(Dir.pwd)
