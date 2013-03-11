require 'rubygems'
require 'json'

class ManifestEventPage
  @@propaties = [:scripts, :persistent]
  attr_accessor :mf_obj
  def initialize
    @scripts = []
    @persistent
    @mf_obj = {}
  end

  def self.to_chrome_manifest(mi)
    return JSON(mi)
  end
  def to_chrome_manifest
    return JSON(@mf_obj)
  end
  def method_missing(name, *args)
    exp = Regexp.new("^("+@@propaties.join("|")+")")
    if (match = exp.match(name.to_s)) && (args.size == 1) then
      @mf_obj[match[1]] = args[0]
      self
    elsif args.size == 0
      @mf_obj[match[1]]
    else
      super
    end
  end
end


class ManifestIcon
  @@propaties = [:size_48, :size_128, :size_32]
  attr_accessor :mf_obj
  def initialize
    @size_48
    @size_128
    @size_32
    @mf_obj = {}
  end

  def self.to_chrome_manifest(mi)
    return JSON(mi)
  end
  def to_chrome_manifest
    return JSON(@mf_obj)
  end
  def method_missing(name, *args)
    exp = Regexp.new("^("+@@propaties.join("|")+")")
    if (match = exp.match(name.to_s)) && (args.size == 1) then
      @mf_obj[match[1]] = args[0]
      self
    elsif args.size == 0
      @mf_obj[match[1]]
    else
      super
    end
  end
end

class ManifestAction
  @@propaties = [:default_icon, :default_title, :popup]
  attr_accessor :mf_obj
  def initialize
    @default_icon
    @default_title
    @popup
    @mf_obj = {}
  end
  def to_chrome_manifest
    return JSON(@mf_obj)
  end
  def method_missing(name, *args)
    exp = Regexp.new("^("+@@propaties.join("|")+")")
    if (match = exp.match(name.to_s)) && (args.size == 1) then
      @mf_obj[match[1]] = args[0]
      self
    elsif args.size == 0
      @mf_obj[match[1]]
    else
      super
    end
  end
end

class ManifestContentScripts
  DOCUMENT_IDLE = "document_idle"
  DOCUMENT_START = "document_start"
  DOCUMENT_END = "document_end"
  @@propaties = [:matches, :css, :js, :run_at, :all_frames]
  attr_accessor :mf_obj
  def initialize
    @matches = []
    @css = []
    @js = []
    @run_at = ManifestContentScripts::DOCUMENT_IDLE
    @all_frames = false
    @mf_obj = {}
  end
  def to_chrome_manifest
    return JSON(@mf_obj)
  end
  def method_missing(name, *args)
    exp = Regexp.new("^("+@@propaties.join("|")+")")
    if (match = exp.match(name.to_s)) && (args.size == 1) then
      @mf_obj[match[1]] = args[0]
      self
    elsif args.size == 0
      @mf_obj[match[1]]
    else
      super
    end
  end

end

class Manifest
  @@propaties = [:name, :version, :description, :default_locale, :background_page, :minimum_chrome_version, :option_page, :permissions, :update_url, :manifest_version]
  attr_reader :mf_obj

  def initialize
    @name
    @version
    @description
    @default_locale
    @background_page
    @minimum_chrome_version
    @option_page
    @permission = []
    @update_url
    @mf_obj = {}
  end

  def method_missing(name, *args)
    exp = Regexp.new("^("+@@propaties.join("|")+")")
    if (match = exp.match(name.to_s)) && (args.size == 1) then
      @mf_obj[match[1]] = args[0]
      self
    elsif args.size == 0
      @mf_obj[match[1]]
    else
      super
    end
  end

  def icons(&block)
    @icons_ = block.call(ManifestIcon.new)
    @mf_obj["icons"] = @icons_.mf_obj
    return self
  end

  def browser_action(&block)
    @browser_action_ = block.call(ManifestAction.new)
    @mf_obj["browser_action"] = @browser_action_.mf_obj
    return self
  end

  def page_action(&block)
    @page_action_ = block.call(ManifestAction.new)
    @mf_obj["page_action"] = @page_action_.mf_obj
    return self
  end

  def content_scripts(&block)
    @content_scripts_ = block.call(ManifestContentScripts.new)
    @mf_obj["content_scripts"] ||= []
    @mf_obj["content_scripts"] << @content_scripts_.mf_obj
    return self
  end

  def background(&block)
    @background_ = block.call(ManifestEventPage.new)
    @mf_obj["background"] = @background_.mf_obj
    return self
  end

  def self.set(&block)
    @@mf = block.call(Manifest.new)
  end
  def self.save(file_path)
    open(file_path, "w"){|f|
      f.write self.to_chrome_manifest(@@mf)
    }
  end
  def self.to_chrome_manifest(mf)
    return JSON(mf.mf_obj)
  end
end
