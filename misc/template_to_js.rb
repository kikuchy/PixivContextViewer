open(ARGV[0], "r"){|s|
  open(ARGV[1], "w"){|d|
    varname = File.basename(ARGV[0].gsub(/\./, "_"))
    d.write(varname + '="')
    d.write(s.read.gsub(/\n/, "\\\n").gsub(/"/, '\"'))
    d.write('";')
  }
}
