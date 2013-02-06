@echo OFF
echo "Adding Changes to Repository"
"C:\Program Files (x86)\Git\bin\git.exe" add -A
set /p message="Describe your changes: "
"C:\Program Files (x86)\Git\bin\git.exe" commit 