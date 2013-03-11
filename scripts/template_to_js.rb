require 'optparse'

OPTS = {}
opt = OptionParser.new
opt.on('-v [VAL]'){|v|
  OPTS[:varname] = v
}
opt.on('-p [VAL]'){|v|
  OPTS[:prefix] = v
}
opt.parse!(ARGV)

open(ARGV[0], "r"){|s|
  open(ARGV[1], "w"){|d|
    varname = (OPTS[:prefix] || "") << (OPTS[:varname] || File.basename(ARGV[0].gsub(/\./, "_")))
    d.write(varname + '="')
    d.write(s.read.gsub(/\n/, "\\\n").gsub(/"/, '\"'))
    d.write('";')
  }
}
