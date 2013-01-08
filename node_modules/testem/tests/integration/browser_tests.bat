@echo off
node testem.js launchers
for /f %%a in ('dir /ad /b examples') do call :testem %%a

exit /b

rem test'em for one example
:testem
echo Testing %1...
cd examples\%1
node ..\..\testem.js ci > out.tap
type out.tap | findstr /R /C:"# tests [0-9]*" /C:"# pass  [0-9]*"
del out.tap
cd ..\..
exit /b