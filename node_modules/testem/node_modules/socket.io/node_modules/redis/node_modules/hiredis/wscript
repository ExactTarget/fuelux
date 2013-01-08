def set_options(opt):
  opt.tool_options("compiler_cxx")

def configure(conf):
  conf.check_tool("compiler_cxx")
  conf.check_tool("node_addon")
  conf.env.append_unique('CXXFLAGS', ['-Wall', '-O3'])
  conf.env['LIBPATH_HIREDIS'] = '../deps/hiredis'
  conf.env['LIB_HIREDIS'] = 'hiredis'

def build(bld):
  ext = bld.new_task_gen("cxx", "shlib", "node_addon", uselib="HIREDIS")
  ext.cxxflags = ["-I../deps", "-g", "-Wall"]
  ext.source = "hiredis.cc reader.cc"
  ext.target = "hiredis"
