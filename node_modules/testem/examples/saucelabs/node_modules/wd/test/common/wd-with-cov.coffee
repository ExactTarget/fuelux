module.exports = if process.env.WD_COV? 
  require '../../lib-cov/main' 
else 
  require '../../lib/main'
   