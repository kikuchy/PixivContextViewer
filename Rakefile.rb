require 'rake/clean'
require "FileUtils"

LESSC = "lessc"
CSS_SRC = FileList["css/*.less"]
CSS_TRG = CSS_SRC.ext('.css')

TMPL_SRC = FileList["templates/*.html.mustache"]
TMPL_TRG = TMPL_SRC.pathmap('%{html,}Xtemplate.js')

JS_SRC = FileList["lib/*/*.js", "lib/*.js"]
JS_TRG = JS_SRC.map do |p|
	"build/chrome/" + p
end

CONFIG_SRC = "config/extension_config.rb"
CONFIG_TRG = ["build/chrome/manifest.json"]

EXT_TARTGET = ["chrome", "opera", "safari"].map! do |n|
	"./build/"+n
end
EXT_TARTGET.each do |n|
	directory n
end


CLEAN.include JS_TRG
CLEAN.include CONFIG_TRG

task :default => [:chrome]

task :less => "css"

file "css" => CSS_TRG do |t|
end

rule '.css'  => ['.less'] do |t|
	sh "#{LESSC} #{t.source} > #{t.name}"
end

task :template => "mustache"

file 'mustache' => TMPL_TRG do |t|
end

rule '.template.js' => "%{template$,}Xhtml.mustache" do |t|
	sh "ruby ./scripts/template_to_js.rb #{t.source} #{t.name} -p pcv.contextViewer.templates."
	mv t.name, "./lib/front"
end

task :manifest => EXT_TARTGET + ["./build/chrome/manifest.json"]

file "./build/chrome/manifest.json" => CONFIG_SRC do |t|
	sh "ruby ./scripts/config_gen.rb ./config/extension_config.rb ./build/chrome/manifest.json"
end

task :copy_chrome_files => EXT_TARTGET + JS_SRC do
	FileUtils.copy_entry "./lib", "./build/chrome/lib"
	#FileUtils.copy_entry "./css", "./build/chrome/css"
end

task :chrome => [:less, :manifest, :template, :copy_chrome_files]
